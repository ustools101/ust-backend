const { MongoClient } = require('mongodb');

async function main() {
    const client = new MongoClient('mongodb+srv://ustools101:dZCo7Un5dv2A50hE@cluster0.eqit0.mongodb.net/utlimate-social-tools');
    await client.connect();
    const db = client.db('utlimate-social-tools');

    // Sort by updatedAt descending to get the one the user *just* edited
    const link = await db.collection('links').findOne({ linkType: 'scratch' }, { sort: { updatedAt: -1 } });

    if (link && link.customPages && link.customPages.length > 0) {
        console.log("=== DB RECORD ===");
        console.log("updatedAt:", link.updatedAt);
        console.log("linkName:", link.linkName);
        console.log("backgroundColor:", link.customPages[0].backgroundColor);
        console.log("inputBackgroundColor:", link.customPages[0].inputBackgroundColor);
    } else {
        console.log("No custom links found.");
    }

    await client.close();
}
main().catch(console.error);
