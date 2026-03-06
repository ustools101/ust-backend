const http = require('http');

http.get('http://localhost:5000/slink/scratch/o3s4Ri7Uy/1', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const styleMatch = data.match(/<style>([\s\S]*?)<\/style>/);
        if (styleMatch) {
            console.log("=== LIVE CSS ===");
            console.log(styleMatch[1]);
        }

        const inputMatch = data.match(/<input[^>]+class="[^"]*input-custom[^"]*"[^>]*>/);
        if (inputMatch) {
            console.log("=== LIVE INPUT HTML ===");
            console.log(inputMatch[0]);
        }
    });
}).on('error', err => console.error(err));
