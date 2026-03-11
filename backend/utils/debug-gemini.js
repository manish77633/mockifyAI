const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function checkModel(version, model) {
    const url = `https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "hi" }] }]
            })
        });
        const data = await response.json();
        if (response.status === 200) {
            console.log(`[SUCCESS] ${version}/${model}`);
        } else {
            console.log(`[FAILED]  ${version}/${model} - Status ${response.status}: ${data.error?.message || 'No message'}`);
        }
    } catch (e) {
        console.log(`[ERROR]   ${version}/${model} - ${e.message}`);
    }
}

async function run() {
    const models = [
        'gemini-1.5-flash',
        'gemini-1.5-flash-latest',
        'gemini-1.5-flash-001',
        'gemini-1.5-pro',
        'gemini-pro'
    ];
    const versions = ['v1', 'v1beta'];

    for (const v of versions) {
        for (const m of models) {
            await checkModel(v, m);
        }
    }
}

run();
