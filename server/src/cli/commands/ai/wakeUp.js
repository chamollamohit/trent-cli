import chalk from "chalk";
import { getStoredToken } from "../../../lib/token.js"
import yoctoSpinner from "yocto-spinner";
import prisma from "../../../lib/db.js";
import { select } from "@clack/prompts";
import { Command } from "commander";
import { startChat } from "../../chat/chat-with-ai.js";
import { startToolChat } from "../../chat/chat-with-ai-tool.js";



const wakeUpAction = async () => {
    const token = await getStoredToken()

    if (!token) {
        console.log(chalk.red("Not Authenticated. Please Login"));
        return
    }
    const spinner = yoctoSpinner({ text: "Fetching user information..." })
    spinner.start()

    const user = await prisma.user.findFirst({
        where: {
            sessions: {
                some: {
                    token: token.access_token
                }
            }
        },
        select: {
            id: true,
            name: true,
            email: true,
            image: true
        }
    })
    spinner.stop()

    if (!user) {
        console.log(chalk.red("User not found."));
        return
    }

    console.log(chalk.green(`Welcome back, ${user.name} !\n`));

    const choice = await select({
        message: "Select an Option:",
        options: [{
            value: "chat",
            label: "Chat",
            hint: "Chat with AI"
        },
        {
            value: "tool",
            label: "Tool Calling",
            hint: "Chat with tools (Google Search, Code Execution"
        },
        {
            value: "agent",
            label: "Agentic Mode",
            hint: "Advance AI agent (Coming soon)"
        }
        ]
    })

    switch (choice) {
        case "chat":
            startChat("chat")
            break;
        case "tool":
            startToolChat()
            break;
        case "agent":
            console.log(chalk.yellow("Agentic mode coming soon"));
    }

}

export const wakeUp = new Command("wakeup")
    .description("Wakeup the ai")
    .action(wakeUpAction)