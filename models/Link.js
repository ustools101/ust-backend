const {models, model, Schema} = require("mongoose")

const LinkSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required'],
    },
    linkId: {
        type: String,
        required: [true, 'Link is required'],
    },
    linkName: {
        type: String,
        required: [true, 'Link name is required'],
    },
    linkType: {
        type: String,
        required: [true, 'Link type is required'],
    },
    title: {
        type: String,
    },
    writeup: {
        type: String,
        required: [true, 'Writeup is required'],
    },
    contestantName: {
        type: String,
    },
    expiresAt: {
        type: Date,
        required: [true, 'Expiry date is required'],
    },
    image: {
        type: String,
    },
    bannerImage:{
        type: String,
    },
    socialMedia: {
        type: Schema.Types.Mixed,
        required: [true, 'Social media is required'],
    },
    otpEnabled:{
        type: Boolean,
        required: false,
        default: true
    },
    retry:{
        type: Number,
        required: false,
        default: 1
    }
}, {
    timestamps: true
});


const Link = models.Link || model('Link', LinkSchema);

module.exports = Link;