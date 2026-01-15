const express = require('express');
const router = express.Router();
const TelegramBotService = require('../../lib/telegramBot');
const User = require('../../models/User');
const { creditTransactionNotification } = require('../../templates/telegramNotifications');
const sendMessage = require("../../lib/telegramBot")
const bcrypt = require("bcryptjs")

// Send credit notification to user
router.post('/credits/add', async (req, res) => {
    try {
        const { email, amount } = req.body;

        if (!email || !amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Email and positive credit amount are required'
            });
        }

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Send telegram notification if user has telegramId
        if (user.telegramId) {
            const notificationMessage = await creditTransactionNotification(amount, user.points);
            await TelegramBotService.sendHTMLMessage(user.telegramId, notificationMessage);
        }

        res.json({
            success: true,
            message: 'Notification sent successfully',
            currentBalance: user.points
        });

    } catch (error) {
        console.error('Credit notification error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});


router.post("/webhook", async (req, res) => {
    try {
        const chatId = req.body.message.from.id;
        const text = req.body.message.text;

        if (text.toLowerCase() === '/start' || text.toLowerCase() === '/telegramid' || text.toLowerCase() === 'start' || text.toLowerCase() === 'telegramid') {
            await sendMessage(chatId, chatId);
        }

        // handle password reset
        if (text.toLowerCase() === '/reset' || text.toLowerCase() === 'reset') {
            const users = await User.find({ telegramId: chatId });
            if (!users) {
                await sendMessage(chatId, 'You are not registered');
            }
            const newPassword = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            const hash = await bcrypt.hash(newPassword, 10);
            await User.updateMany({ telegramId: chatId }, { password: hash });
            await sendMessage(chatId, `
New Password: ${newPassword}
                `);

        }

        res.status(200).json({ success: true })
    } catch (error) {
        console.log(error);
        res.status(200).json({ success: true })

    }
})

module.exports = router;