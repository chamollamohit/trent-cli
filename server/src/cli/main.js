#!/usr/bin/env node

import chalk from 'chalk'
import figlet from 'figlet'
import { Command } from 'commander'
import 'dotenv/config'
import { login, logout } from './commands/auth/login.js';
import { whoami } from './commands/who-am-i/who-am-i.js';
import { wakeUp } from './commands/ai/wakeUp.js';


async function main() {
    // Display Banner

    console.log(
        chalk.cyan(
            figlet.textSync("Trent CLI", {
                font: "Standard",
                horizontalLayout: "default"
            })
        )
    );

    console.log(chalk.red("A CLI based AI Tool \n"));
    const program = new Command("trent");

    program.version('0.0.1')
        .description("Trent CLI - A Cli Based AI Tool")
        .addCommand(login)
        .addCommand(logout)
        .addCommand(whoami)
        .addCommand(wakeUp)

    // Default action shows help
    program.action(() => {
        program.help();
    });

    program.parse()
}

main().catch((err) => {
    console.log(chalk.red("Error in Running Trent CLI :"), err);
    process.exit(1)
})