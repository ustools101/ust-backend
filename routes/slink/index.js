const Link = require('../../models/Link');
const User = require('../../models/User');
const {visitorNotification} = require('../../templates/telegramNotifications');
const TelegramBotService = require('../../lib/telegramBot')
const router = require('express').Router();

const linkTypes = ["voting", "giveaway", "custom"]

router.get("/:linkId", async (req,res) => {
    try{
        const {linkId} = req.params;
        const link = await Link.findOne({linkId, expiresAt: {$gt: Date.now()}});
        if(link==null){
            return res.redirect("/not-found");
        }
        if(!linkTypes.includes(link.linkType)){
            return res.redirect("/not-found");
        }
        return res.render(`slink/${link.linkType}`, {req, link});
    }catch(error){
        console.log(error);
        return res.redirect("/not-found");
    }
})

module.exports = router;