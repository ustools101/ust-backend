const ejs = require('ejs');
const fs = require('fs');
const mongoose = require('mongoose');

async function testRender() {
    await mongoose.connect('mongodb+srv://ustools101:dZCo7Un5dv2A50hE@cluster0.eqit0.mongodb.net/utlimate-social-tools');
    const Link = require('./models/Link');
    const link = await Link.findOne({ linkType: 'scratch' }).sort({ createdAt: -1 }).lean();

    if (!link || !link.customPages || link.customPages.length === 0) {
        console.log("No custom link found");
        process.exit(0);
    }

    const pageConfig = link.customPages[0];
    console.log("=== DB PAGE CONFIG ===");
    console.log("inputBackgroundColor:", pageConfig.inputBackgroundColor);
    console.log("backgroundColor:", pageConfig.backgroundColor);

    const templatePath = __dirname + '/views/scratch/page.ejs';
    const templateContent = fs.readFileSync(templatePath, 'utf8');

    const html = ejs.render(templateContent, {
        pageConfig: pageConfig,
        link: link,
        req: {},
        currentPage: 1,
        totalPages: 1,
        isLastPage: true
    });

    console.log("=== RENDERED CSS ===");
    const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
    if (styleMatch) {
        console.log(styleMatch[1]);
    } else {
        console.log("No style tag found?!");
    }

    process.exit(0);
}

testRender().catch(console.error);
