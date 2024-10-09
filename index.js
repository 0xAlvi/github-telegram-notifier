const axios = require('axios');
require('dotenv').config();

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const REPO_URLS = [
    'https://github.com/username/repo1',
    'https://github.com/username/repo2',
    'https://github.com/username/repo3',
];

const PROFILE_URLS = [
    'https://github.com/username1',
    'https://github.com/username2',
    'https://github.com/username3'
];

let repoStates = {};
let existingRepos = new Set();

const getCurrentTimestamp = () => {
    return new Date().toISOString().replace('T', ' ').substring(0, 19);
};

const log = (message) => {
    console.log(`[🕒 ${getCurrentTimestamp()}] ${message}`);
};

const sendMessage = (message) => {
    const url = `https://api.telegram.org/bot${TOKEN}/sendMessage`;
    axios.post(url, {
        chat_id: CHAT_ID,
        text: message,
    }).then(() => {
        log(`📤 Telegram: ${message}`);
    }).catch(error => {
        log(`❌ Error sending message to Telegram: ${error.message}`);
    });
};

const fetchInitialRepos = async (username) => {
    try {
        const reposResponse = await axios.get(`https://api.github.com/users/${username}/repos`, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        reposResponse.data.forEach(repo => existingRepos.add(repo.name));
        log(`✅ Initial repositories for ${username} successfully added.`);
    } catch (error) {
        log(`❌ Error fetching initial repositories for ${username}: ${error.message}`);
    }
};

const checkRepoUpdates = async () => {
    log("🔄 Checking for repository updates...");
    try {
        for (const repoUrl of REPO_URLS) {
            const repoParts = repoUrl.split('/');
            const REPO_OWNER = repoParts[3];
            const REPO_NAME = repoParts[4];

            try {
                const commitsResponse = await axios.get(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/commits`, {
                    headers: {
                        'Authorization': `token ${GITHUB_TOKEN}`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                });
                const latestCommit = commitsResponse.data[0];

                if (!repoStates[repoUrl] || latestCommit.sha !== repoStates[repoUrl]) {
                    const message = `🔄 Repository *${REPO_NAME}* has been updated: ${latestCommit.commit.message}`;
                    sendMessage(message);
                    repoStates[repoUrl] = latestCommit.sha;
                    log(`📣 Notification sent: ${REPO_NAME} updated`);
                } else {
                    log(`🔇 No updates for ${REPO_NAME}`);
                }
            } catch (error) {
                log(`❌ Error fetching commits for ${REPO_NAME}: ${error.message}`);
            }
        }

        for (const profileUrl of PROFILE_URLS) {
            const username = profileUrl.split('/').pop();
            try {
                const reposResponse = await axios.get(`https://api.github.com/users/${username}/repos`, {
                    headers: {
                        'Authorization': `token ${GITHUB_TOKEN}`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                });
                const currentRepos = reposResponse.data.map(repo => repo.name);

                currentRepos.forEach(repo => {
                    if (!existingRepos.has(repo)) {
                        const message = `✨ New repository created by *${username}*: ${repo}`;
                        sendMessage(message);
                        existingRepos.add(repo);
                        log(`📣 Notification sent: New repository ${repo} by ${username}`);
                    } else {
                        log(`🔒 Repository ${repo} already exists.`);
                    }
                });
            } catch (error) {
                log(`❌ Error fetching repositories for ${username}: ${error.message}`);
            }
        }
    } catch (error) {
        log('❌ Error fetching updates: ' + error.message);
    }
};

const initializeBot = async () => {
    for (const profileUrl of PROFILE_URLS) {
        const username = profileUrl.split('/').pop();
        await fetchInitialRepos(username);
    }
    setInterval(checkRepoUpdates, 300000);
    log("✅ Bot has started and is monitoring updates...");
};

initializeBot();
