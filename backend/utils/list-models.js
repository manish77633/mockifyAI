const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (response.status === 200) {
            console.log('Available Models:');
            data.models.forEach(m => {
                console.log(`- ${m.name} (Methods: ${m.supportedGenerationMethods.join(', ')})`);
            });
        } else {
            console.log(`Failed to list models - Status ${response.status}: ${data.error?.message || 'No message'}`);
        }
    } catch (e) {
        console.log(`Error listing models: ${e.message}`);
    }
}

listModels();
