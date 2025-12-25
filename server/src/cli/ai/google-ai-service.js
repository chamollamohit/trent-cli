import { generateObject, streamText } from 'ai';
import { google } from "@ai-sdk/google";
import { config } from '../../config/google.config.js';
import chalk from 'chalk';


export class AIService {
    constructor() {
        if (!config.googleApiKey) {
            throw new Error("Google API KEY is not set in env")
        }

        this.model = google(config.model, {
            apiKey: config.googleApiKey
        })


    }

    /**
     * Send a message and get streaming reponse
     * @param {Array} messages
     * @param {function} onChunk
     * @param {Object} tools
     * @param {function} onToolCall
     * @return {Promise<Object>}
     */

    async sendMessage(messages, onChunk, tools = undefined, onToolCall = null) {
        try {
            const streamConfig = {
                model: this.model,
                messages: messages,
            }

            if (tools && Object.keys(tools).length > 0) {
                streamConfig.tools = tools;
                streamConfig.maxSteps = 5;
            }
            const result = streamText(streamConfig)
            let fullResponse = ""
            for await (const chunk of result.textStream) {
                fullResponse += chunk

                if (onChunk) {
                    onChunk(chunk)
                }
            }

            const fullResult = result

            const toolCalls = []
            const toolResults = []

            if (await fullResult.steps && Array.isArray(fullResult.steps)) {
                for (const step of fullResult.steps) {
                    if (step.toolCalls && step.toolCalls.length > 0) {
                        for (const toolCall of step.toolCalls) {
                            toolCalls.push(toolCall)

                            if (onToolCall) {
                                onToolCall(toolCall)
                            }
                        }
                    }

                    if (step.toolResults && step.toolResults.length > 0) {
                        toolResults.push(...step.toolResults)
                    }
                }
            }

            return {
                content: fullResponse,
                finishResponse: fullResult.finishReason,
                usage: fullResult.usage,
                toolCalls,
                toolResults,
                steps: fullResult.steps
            }
        } catch (error) {
            console.error(chalk.red("AI Service Error:"), error.message)
        }
    }

    /**
     * Get a non-streaming Response
     * @param {Array} messages - Array of message objects
     * @param {object} tools - Optional tools
     * @return {Promise<string>}  Response text
     */

    async getmessage(messages, tools = undefined) {
        let fullResponse = ""
        const result = await this.sendMessage(messages, (chunk) => {
            fullResponse += chunk
        }, tools)
        return result.content
    }
    /**
     * Generate structured output using a zod schema
     * @param {object} schema - Zod Schema
     * @param {String} prompt - Prompt for generating
     * @returns {Promise<object>} - Parsed object matching the schema
     */

    async generateStructuredResponse(schema, prompt) {
        try {
            const result = await generateObject({
                model: this.model,
                schema: schema,
                prompt: prompt
            })

            return result.object
        } catch (error) {
            console.error(chalk.red("AI Structured Response Generation Error:"), error.message)
            throw error
        }
    }
}
