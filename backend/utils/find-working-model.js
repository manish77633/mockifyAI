const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function testModel(modelName) {
    const url = `https://generativelanguage.googleapis.com/v1beta/${modelName}:generateContent?key=${process.env.GEMINI_API_KEY}`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Return only the word 'OK'" }] }]
            })
        });
        const data = await response.json();
        if (response.status === 200) {
            console.log(`[SUCCESS] ${modelName}`);
            return true;
        } else {
            console.log(`[FAILED]  ${modelName} - ${response.status}: ${data.error?.message}`);
            return false;
        }
    } catch (e) {
        console.log(`[ERROR]   ${modelName} - ${e.message}`);
        return false;
    }
}

async function run() {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await res.json();
    if (!data.models) {
        console.log("Could not list models");
        return;
    }

    const generateModels = data.models
        .filter(m => m.supportedGenerationMethods.includes('generateContent'))
        .map(m => m.name);

    console.log(`Testing ${generateModels.length} models...`);
    for (const model of generateModels) {
        await testModel(model);
    }
}

run();
