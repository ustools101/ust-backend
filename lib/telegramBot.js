const TelegramBot = require('node-telegram-bot-api');
const User = require('../models/User');
require('dotenv').config();
const bcrypt = require('bcryptjs');

class TelegramBotService {
    constructor() {
        this.token = process.env.TELEGRAM_BOT_TOKEN;
        if (!this.token) {
            throw new Error('TELEGRAM_BOT_TOKEN is not set in environment variables');
        }

        // Initialize bot with polling
        this.bot = new TelegramBot(this.token, { polling: true });
        this.setupEventHandlers();
        console.log("Telegram Bot connected...")
    }

    setupEventHandlers() {
        // Handle incoming messages
        this.bot.on('message', async (msg) => {
            try{
                const chatId = msg.chat.id;
            
            // You can handle different message types or commands here
            if (msg.text.toLowerCase() === '/start' || msg.text.toLowerCase() === '/telegramid' || msg.text.toLowerCase() === 'start' || msg.text.toLowerCase() === 'telegramid') {
                this.sendMessage(chatId, chatId);
            }

            // handle password reset
            if(msg.text.toLowerCase() === '/reset' || msg.text.toLowerCase() === 'reset'){
                const chatId = msg.chat.id;
                const users = await User.find({telegramId: chatId});
                if(!users){
                    return this.sendMessage(chatId, 'You are not registered');
                }
                const newPassword = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                const hash = await bcrypt.hash(newPassword, 10);
                await User.updateMany({telegramId: chatId}, {password: hash});
                this.sendMessage(chatId,  `
New Password: ${newPassword}
                    `);
            }
            }catch(error){
                console.error(error);
            }
        });

        // Handle errors
        this.bot.on('error', (error) => {
            console.error('Telegram bot error:', error);
        });

        // Handle polling errors
        this.bot.on('polling_error', (error) => {
            console.error('Telegram polling error:', error);
        });
    }

    /**
     * Send a message to a specific chat ID
     * @param {string|number} chatId - The chat ID to send the message to
     * @param {string} message - The message to send
     * @returns {Promise<object>} - The response from Telegram
     */
    async sendMessage(chatId, message) {
        try {
            const response = await this.bot.sendMessage(chatId, message);
            return response;
        } catch (error) {
            console.error('Error sending Telegram message:', error);
            throw error;
        }
    }

    /**
     * Send an HTML formatted message to a specific chat ID
     * @param {string|number} chatId - The chat ID to send the message to
     * @param {string} message - The HTML formatted message
     * @returns {Promise<object>} - The response from Telegram
     */
    async sendHTMLMessage(chatId, message) {
        try {
            const response = await this.bot.sendMessage(chatId, message, {
                parse_mode: 'HTML'
            });
            return response;
        } catch (error) {
            console.error('Error sending HTML Telegram message:', error);
            throw error;
        }
    }

    /**
     * Send a photo to a specific chat ID
     * @param {string|number} chatId - The chat ID to send the photo to
     * @param {string|Buffer|Stream} photo - Photo to send (file path, URL, Buffer, or Stream)
     * @param {string} [caption] - Optional caption for the photo
     * @returns {Promise<object>} - The response from Telegram
     */
    async sendPhoto(chatId, photo, caption = '') {
        try {
            const response = await this.bot.sendPhoto(chatId, photo, {
                caption: caption
            });
            return response;
        } catch (error) {
            console.error('Error sending photo:', error);
            throw error;
        }
    }

    /**
     * Stop the bot polling
     */
    stop() {
        if (this.bot) {
            this.bot.stopPolling();
        }
    }
}

// Create singleton instance
const telegramBot = new TelegramBotService();

// Handle process termination
process.on('SIGINT', () => {
    telegramBot.stop();
    process.exit();
});

process.on('SIGTERM', () => {
    telegramBot.stop();
    process.exit();
});

module.exports = telegramBot;