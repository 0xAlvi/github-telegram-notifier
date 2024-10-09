# GitHub Telegram Notifier Bot

This bot notifies you of updates and new repositories for specified GitHub users and repositories via Telegram.

## Table of Contents

1. [Creating a Telegram Bot](#creating-a-telegram-bot)
2. [Getting Your Chat ID](#getting-your-chat-id)
3. [Cloning the Repository](#cloning-the-repository)
4. [Installing Dependencies](#installing-dependencies)
5. [Setting Up Environment Variables](#setting-up-environment-variables)
6. [Running the Bot](#running-the-bot)
7. [Usage](#usage)
8. [Customizing the Bot](#customizing-the-bot)

## Creating a Telegram Bot

1. Open Telegram and search for the user `@BotFather`.
2. Start a chat with `@BotFather` and send the command `/newbot`.
3. Follow the prompts to create your bot. You will receive a token to access the Telegram Bot API.

## Getting Your Chat ID

1. Start a chat with your newly created bot.
2. Send any message to your bot.
3. To find your chat ID, use the following URL in your browser, replacing `YOUR_BOT_TOKEN` with your bot's token:
   ```
   https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates
   ```
4. Look for your chat ID in the JSON response. It will be in the format of `{"chat":{"id":YOUR_CHAT_ID,...}}`.

## Cloning the Repository

Open your terminal and run the following command to clone the repository:

```bash
git clone https://github.com/0xAlvi/github-telegram-notifier.git
```

## Installing Dependencies

Navigate into the cloned directory:

```bash
cd github-telegram-notif
```

Install the required modules:

```bash
npm install
```

## Setting Up Environment Variables

Create a `.env` file and add the following lines:

```
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_chat_id
GITHUB_TOKEN=your_personal_access_token
```

### Explanation of Variables

- **TELEGRAM_BOT_TOKEN**: The token you received from BotFather when you created your Telegram bot.
- **TELEGRAM_CHAT_ID**: Your unique chat ID obtained from the previous steps.
- **GITHUB_TOKEN**: Your personal access token from GitHub. You can create one by following these steps:
  1. Go to GitHub and navigate to `Settings`.
  2. Click on `Developer settings`, then `Personal access tokens`.
  3. Click on `Generate new token` and select the necessary scopes (like `repo` for repository access).

## Running the Bot

Once everything is set up, you can run the bot:

```bash
node index.js
```

## Usage

The bot will automatically start monitoring the specified GitHub repositories and user profiles for updates and new repositories. Notifications will be sent to your Telegram chat whenever there are updates.

## Customizing the Bot

You can modify the `REPO_URLS` and `PROFILE_URLS` arrays in the `index.js` file to add or remove repositories and users you want to monitor.
