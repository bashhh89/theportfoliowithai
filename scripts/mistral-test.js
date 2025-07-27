// Simple script to test Mistral API connection
const fetch = require('node-fetch');

// Get API key from environment variable or use the provided one
const apiKey = process.env.MISTRAL_API_KEY || 'ajrXjgkAaNFq0rTqgVQ88xOVj5veH5uj';

async function testMistralAPI() {
  try {
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'mistral-small-latest',
        messages: [
          { role: 'user', content: 'Hello, can you help me with my business automation?' }
        ],
        max_tokens: 100
      })
    });

    const data = await response.json();
    console.log('Mistral API Response:');
    console.log(JSON.stringify(data, null, 2));
    
    if (data.error) {
      console.error('Error:', data.error);
    } else {
      console.log('Success! API is working correctly.');
    }
  } catch (error) {
    console.error('Failed to connect to Mistral API:', error.message);
  }
}

console.log('Testing Mistral API connection...');
console.log(`Using API key: ${apiKey.substring(0, 5)}...${apiKey.substring(apiKey.length - 4)}`);
testMistralAPI();