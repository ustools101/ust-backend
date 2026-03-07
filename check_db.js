require('dotenv').config();
const mongoose = require('mongoose');
const Link = require('./models/Link');

async function run() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const link = await Link.findOne({ linkId: 'o3s4Ri7Uy' });
        if (!link) {
            console.log("Link not found");
        } else {
            const page = link.customPages.find(p => p.pageNumber === 1);
            console.log(JSON.stringify(page, null, 2));
        }
    } catch (err) {
        console.error(err);
    } finally {
        process.exit(0);
    }
}
run();
