import { cancel, confirm, intro, isCancel, outro } from '@clack/prompts'
import { logger } from 'better-auth'
import { createAuthClient } from "better-auth/client"
import { deviceAuthorizationClient } from 'better-auth/client/plugins'
import chalk from 'chalk'
import { Command } from 'commander'
import os from 'os'
import open from 'open'
import path from 'path'
import yoctospinner from 'yocto-spinner'
import * as z from 'zod/v4'
import dotenv from 'dotenv'
import prisma from '../../../lib/db.js'
import { clearStoredToken, getStoredToken, isTokenExpired, storeToken } from '../../../lib/token.js'

dotenv.config()

const URL = "http://localhost:4000"
const CLIENT_ID = process.env.GITHUB_CLIENT_ID
export const CONFIG_DIR = path.join(os.homedir(), '.trent-cli')
export const TOKEN_FILE = path.join(CONFIG_DIR, 'token.json')


export async function loginAction(opts) {
    const options = z.object({
        serverUrl: z.string().optional(),
        clientId: z.string().optional()
    })

    const serverUrl = options.serverUrl || URL
    const clientId = options.clientId || CLIENT_ID

    intro(chalk.bold("🔒Auth Cli Login"))

    const existingToken = await getStoredToken()
    const expired = await isTokenExpired()
    // console.log(expired);
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
            logger.error(`Failed to request device authorization: ${error.error_description}`)
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

        console.log(`Please visit: ${chalk.underline.blue(verification_uri_complete || verification_uri)}`);

        console.log(`Enter Code: ${chalk.bold.green(user_code)}`);

        console.log(
            chalk.gray(`Waiting for authorization (expires in ${Math.floor(expires_in / 60)} minutes)...`)
        );

        const shouldOpen = await confirm({
            message: "Open browser automatically",
            initialValue: true
        })

        if (!isCancel(shouldOpen) && shouldOpen) {
            const urlToOpen = verification_uri_complete || verification_uri
            await open(urlToOpen)
        }

        const token = await pollForToken(
            authClient,
            device_code,
            clientId,
            interval
        )

        if (token) {
            const saved = await storeToken(token)

            if (!saved) {
                console.log(chalk.yellow("\n⚠️ Warning: Could not save the authentication token."));
                console.log(chalk.yellow("You may need to login again on next use."));
            }
        }

        // Todo: Get the user data

        outro(chalk.green("Login successfull !"))
        console.log(chalk.gray(`\n Token saved to: ${TOKEN_FILE}`));

        console.log(chalk.gray("You can now use AI commands without logging in again. \n"));

    } catch (error) {
        spinner.stop()
        console.error(chalk.red("\nLogin failed:"), error.message)
        process.exit(1)
    }
}


async function pollForToken(authClient, deviceCode, clientId, initialInterval) {
    let pollingInterval = initialInterval
    const spinner = yoctospinner({ text: "", color: 'cyan' })
    let dots = 0

    const textInterval = setInterval(() => {
        dots = (dots + 1) % 4;
        spinner.text = chalk.gray(`Polling for authorization${".".repeat(dots)}${" ".repeat(3 - dots)}`);
    }, 300);

    return new Promise((resolve, reject) => {
        const poll = async () => {
            const cleanup = () => {
                clearInterval(textInterval);
                spinner.stop();
            };

            if (!spinner.isSpinning) spinner.start()

            try {
                const { data, error } = await authClient.device.token({
                    grant_type: "urn:ietf:params:oauth:grant-type:device_code",
                    device_code: deviceCode,
                    client_id: clientId,
                    fetchOptions: {
                        headers: {
                            "user-agent": `TRENT CLI`,
                        },
                    },
                })

                if (data?.access_token) {
                    console.log(chalk.bold.yellow("\nAuthorization successfull !"));
                    cleanup()
                    resolve(data)
                    return
                } else if (error) {
                    switch (error.error) {
                        case "authorization_pending":
                            break;
                        case "slow_down":
                            pollingInterval += 5;
                            break;
                        case "access_denied":
                            console.error("\nAccess was denied by the user");
                            process.exit(0)
                        case "expired_token":
                            console.error("\nThe device code has expired. Please try again.");
                            process.exit(0)
                        default:
                            cleanup()
                            logger.error(`Error: ${error.message}`);
                            console.log(error);
                            process.exit(1);
                    }
                }
            } catch (error) {
                cleanup()
                logger.error(`Network Error: ${err.message}`)
                process.exit(1)
            }
            setTimeout(poll, pollingInterval * 1000)
        }
        setTimeout(poll, pollingInterval * 1000)
    })
}

export async function logoutAction() {
    intro(chalk.bold("👋 Logout"))

    const token = await getStoredToken()

    if (!token) {
        console.log(chalk.yellow("You're not logged in."));
        process.exit(1)
    }

    const shouldLogout = await confirm({
        message: "Are you sure you want to logout?",
        initialValue: false,
    })

    if (isCancel(shouldLogout) || !shouldLogout) {
        cancel("Logut cancelled")
        process.exit(0)
    }

    const cleard = await clearStoredToken()

    if (cleard) {
        outro(chalk.green("✅ Successfully logged out!"))
    } else {
        console.log(chalk.yellow("⚠️ Could not clear token file."));
    }
}


// Commander Setup

export const login = new Command('login')
    .description("login to Trent-Cli")
    .option("--server-url <url>", "The Better Auth server URL", URL)
    .option("--client-id <id>", "The OAuth Client ID", CLIENT_ID)
    .action(loginAction)


export const logout = new Command('logout')
    .description("logout from Trent-Cli")
    .action(logoutAction)


