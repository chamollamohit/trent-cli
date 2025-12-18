import { cancel, confirm, intro, isCancel, outro } from '@clack/prompts'
import { logger } from 'better-auth'
import { createAuthClient } from "better-auth/client"
import { deviceAuthorizationClient } from 'better-auth/client/plugins'
import chalk from 'chalk'
import { Command } from 'commander'
import fs from 'fs/promises'
import os from 'os'
import open from 'open'
import path from 'path'
import yoctospinner from 'yocto-spinner'
import * as z from 'zod/v4'
import dotenv from 'dotenv'
import prisma from '../../../lib/db.js'

dotenv.config()

const URL = "http://localhost:4000"
const CLIENT_ID = process.env.GITHUB_CLIENT_ID
const CONFIG_DIR = path.join(os.homedir(), '.better-auth')
const TOKEN_FILE = path.join(CONFIG_DIR, 'token.json')


export async function loginAction(opts) {
    const options = z.object({
        serverUrl: z.string().optional(),
        clientId: z.string().optional()
    })

    const serverUrl = options.serverUrl || URL
    const clientId = options.clientId || CLIENT_ID

    intro(chalk.bold("🔒Auth Cli Login"))

    const existingToken = false
    const expired = false

    if (existingToken && !expired) {
        const shouldReAuth = await confirm({
            message: "You are already logged-In. Do you want to login Again?",
            initialValue: false
        })

        if (isCancel(shouldReAuth) || !shouldReAuth) {
            cancel("Login Cancelled")
            process.exit(0)
        }
    }

    const authClient = createAuthClient({
        baseURL: serverUrl,
        plugins: [deviceAuthorizationClient()]
    })

    const spinner = yoctospinner({ text: "Requestiong device authrization..." })
    spinner.start()

    try {
        const { data, error } = await authClient.device.code({
            client_id: clientId,
            scope: "openid profile email"
        })
        spinner.stop()

        if (error || !data) {
            logger.error(`Failed tp request device authorization: ${error.error_description}`)
            process.exit(1)
        }

        const { device_code,
            expires_in,
            interval = 5,
            user_code,
            verification_uri,
            verification_uri_complete
        } = data

        console.log(chalk.cyan("Device Authrization Required"));

        console.log(`Please visit: ${chalk.underline.blue(verification_uri || verification_uri_complete)}`);

        console.log(`Enter Code: ${chalk.bold.green(user_code)}`);

        const shouldOpen = await confirm({
            message: "Open browser automatically",
            initialValue: true
        })

        if (!isCancel(shouldOpen) && shouldOpen) {
            const urlToOpen = verification_uri || verification_uri_complete
            await open(urlToOpen)
        }

        console.log(
            chalk.gray(`Waiting for authorization (expires in ${Math.floor(expires_in / 60)} minutes)...`)
        );
    } catch (error) {

    }
}

// Commander Setup

export const login = new Command('login')
    .description("login to Better Auth")
    .option("--server-url <url>", "The Better Auth server URL", URL)
    .option("--client-id <id>", "The OAuth Client ID", CLIENT_ID)
    .action(loginAction)
