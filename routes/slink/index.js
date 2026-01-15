const Link = require('../../models/Link');
const User = require('../../models/User');
const {visitorNotification} = require('../../templates/telegramNotifications');
const router = require('express').Router();
const sendMessage = require("../../lib/telegramBot")

const linkTypes = ["voting", "giveaway", "custom"]

router.get("/:linkId", async (req,res) => {
    try{
        const {linkId} = req.params;
        const link = await Link.findOne({linkId, expiresAt: {$gt: Date.now()}});
        if(link==null){
            return res.redirect(303, "/not-found");
        }
        if(!linkTypes.includes(link.linkType)){
            return res.redirect(303, "/not-found");
        }
        const user = await User.findById(link.userId);
        if(!user){
            return res.redirect(303, "/not-found");
        }
        const message = await visitorNotification(link.linkName);
        await sendMessage(user.telegramId, message);
        return res.render(`slink/${link.linkType}`, {req, link});
    }catch(error){
        console.log(error);
        return res.redirect(303, "/not-found");
    }
})

module.exports = router;