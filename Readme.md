# Trent CLI

**Trent CLI** is a powerful command-line interface tool that integrates AI capabilities directly into your terminal. Built with Node.js, it offers seamless authentication, AI chat features, tool calling (Google Search, Code Execution), and an advanced agentic mode.

## 🚀 Features

-   **Secure Authentication**: Robust login system using Device Flow authorization powered by Better Auth.
-   **AI Chat**: Direct conversational interface with an AI assistant.
-   **Tool Calling**: Empower the AI to perform tasks like Google Search and Code Execution.
-   **Agentic Mode**: Advanced autonomous agent capabilities for complex tasks.
-   **User Management**: distinct `whoami` command to view authenticated user details.
-   **Modern Stack**: Built with TypeScript, Prisma, Google AI SDK, and Next.js.

## 🛠️ Tech Stack

-   **Runtime**: Node.js
-   **CLI Framework**: [Commander.js](https://github.com/tj/commander.js)
-   **Styling**: [Chalk](https://github.com/chalk/chalk), [Figlet](https://github.com/patorjk/figlet.js), [Ora/Spinner](https://github.com/sindresorhus/yocto-spinner)
-   **Database/ORM**: [Prisma](https://www.prisma.io/)
-   **Authentication**: [Better Auth](https://www.better-auth.com/)
-   **AI Engine**: [VERCEL AI SDK](https://ai-sdk.dev/)
-   **Frontend (Auth UI)**: Next.js, Tailwind CSS, Shadcn UI

## 📦 Installation

To run Trent CLI locally, you need to set up both the server (CLI) and the client (Auth UI).

### Prerequisites

-   Node.js
-   npm, yarn, or pnpm
-   PostgreSQL (for Prisma)

### 1. Server & CLI Setup

1.  Navigate to the server directory:

    ```bash
    cd server
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Set up environment variables (`.env`):

    ```env
    DATABASE_URL="postgresql://..."
    GITHUB_CLIENT_ID="your_github_client_id"
    GITHUB_CLIENT_SECRET="your_github_client_secret"
    BETTER_AUTH_SECRET="your_auth_secret"
    GOOGLE_GENERATIVE_AI_API_KEY="your_gemini_api_key"
    PORT =
    BETTER_AUTH_URL=
    TRENT_MODE = gemini-2.5-flash
    ```

4.  Run Database Migrations:

    ```bash
    npx prisma migrate dev
    ```

5.  Link the CLI globally (for development):
    ```bash
    npm link
    ```
    _Now you can use the `trent` command anywhere on your system._

### 2. Client Setup (Authentication UI)

1.  Navigate to the client directory:

    ```bash
    cd client
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```
    The client will run at `http://localhost:3000`.

## 💻 Usage

Once installed, you can use the `trent` command from your terminal.

### Authentication

**Login**
Authenticate securely using the device flow. This will open your browser to the client application for verification.

```bash
trent login
```

**Logout** Sign out of the CLI and clear stored tokens.

```bash
trent logout
```

**Check Status** View the currently logged-in user's information.

```bash
trent whoami
```

### AI Capabilities

**Wake Up AI** This is the main entry point for AI interactions. It presents a menu to choose your interaction mode.

```bash
trent wakeup
```

Upon running this command, you will be prompted to select a mode:

1. **Chat**: Standard conversational AI.

2. **Tool Calling**: AI with access to external tools (Google Search, etc.).

3. **Agentic Mode**: Autonomous agent for multi-step complex tasks.

### 📂 Project Structure

trent-cli/
├── client/ # Next.js Frontend (Auth Provider)
│ ├── app/ # App Router Pages
│ ├── components/ # UI Components (Shadcn)
│ └── lib/ # Client-side utilities
├── server/ # Node.js Server & CLI
│ ├── src/
│ │ ├── cli/ # CLI Entry points & Commands
│ │ │ ├── commands/ # login, logout, wakeup, whoami
│ │ │ └── chat/ # Chat logic (Basic, Tool, Agent)
│ │ ├── config/ # App Configurations
│ │ ├── lib/ # Shared utilities (DB, Auth, Token)
│ │ └── service/ # Business logic services
│ └── prisma/ # Database Schema & Migrations
