const {models, model, Schema} = require("mongoose")

const LogSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required'],
    },
    log: {
        type: Object,
        required: [true, 'Log is required'],
    }
}, {
    timestamps: true
});


const Log = models.Log || model('Log', LogSchema);

module.exports = Log;

