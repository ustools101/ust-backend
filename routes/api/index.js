const express = require('express');
const router = express.Router();
const TelegramBotService = require('../../lib/telegramBot');
const User = require('../../models/User');
const { creditTransactionNotification } = require('../../templates/telegramNotifications');

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

module.exports = router;