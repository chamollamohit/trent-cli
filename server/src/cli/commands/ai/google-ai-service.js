import { streamText } from 'ai';
import { google } from "@ai-sdk/google";
import { config } from '../../../config/google.config';
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
     * @param {Array} meessages
     * @param {function} onChunk
     * @param {Object} tools
     * @param {function} onToolCall
     * @return {Promise<Object>}
     */

    async sendMessage(message, onChunk, tools = undefined, onToolCall = null) {
        try {
            const streamConfig = {
                model: this.model,
                message: message,
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
            return {
                content: fullResponse,
                finishResponse: fullResult.finishReason,
                usage: fullResult.usage
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
        await this.sendMessage(messages, (chunk) => {
            fullResponse += chunk
        })

        return fullResponse
    }
}