import { google } from "@ai-sdk/google";
import chalk from "chalk";


export const availableTools = [
    {
        id: "google_search",
        name: "Google Search",
        description: "Access the lateest information using Google Search. Usefull for current events, news and real-time information",
        getTool: () => google.tools.googleSearch({}),
        enabled: false
    },
    {
        id: "code_execution",
        name: "Code Execution",
        description: "Generate amd execute Python code to perform calculations, solve problems or provide accurate information.",
        getTool: () => google.tools.codeExecution({}),
        enabled: false
    },
    {
        id: "url_context",
        name: "URL Context",
        description: "Provide specific URLs that you want the model to analyze directly from the prompt.",
        getTool: () => google.tools.urlContext({}),
        enabled: false
    }
]

export function getEnabledTools() {
    const tools = {}

    try {
        for (const toolConfig of availableTools) {
            if (toolConfig.enabled) {
                tools[toolConfig.id] = toolConfig.getTool()
            }
        }

        if (Object.keys(tools).length > 0) {
            console.log((chalk.gray(`\n[DEBUG] Enabled Tools: ${Object.keys(tools).join(", ")}`)));
        } else {
            console.log(chalk.yellow('[DEBUG] No tools enabled'));
        }

        return Object.keys(tools).length > 0 ? tools : undefined
    } catch (error) {
        console.error(chalk.red('[ERROR] Failed to initialize tools:'), error.message);
        return undefined
    }
}

export function toggleTool(toolId) {
    const tool = availableTools.find(t => t.id === toolId)

    if (tool) {
        tool.enabled = !tool.enabled
        console.log(chalk.yellow(`[DEBUG] Tool ${toolId} toggled to ${tool.enabled}`));

        return tool.enabled
    }
    console.log(chalk.yellow(`[DEBUG] Tool ${toolId} not found`));
    return false
}

export function enableTools(toolIds) {
    console.log(chalk.yellow(`[DEBUG] enableTool called with:`), toolIds);

    availableTools.forEach(tool => {
        const wasEnabled = tool.enabled
        tool.enabled = toolIds.includes(tool.id)

        if (tool.enabled !== wasEnabled) {
            console.log(chalk.yellow(`[DEBUG] ${tool.id}: ${wasEnabled} -> ${tool.enabled}`));
        }
    })
}

export function getEnabledToolNames() {
    const names = availableTools.filter(t => t.enabled).map(t => t.name)

    return names
}


export function resetTools() {
    availableTools.forEach(tool => {
        tool.enabled = false
    })
    console.log(chalk.yellow(`[DEBUG] All tools have been reset(Disabled)`));
}