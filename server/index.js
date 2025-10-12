import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini AI
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const CRYPTO_SYSTEM_PROMPT = `You are a cryptocurrency expert assistant. You ONLY answer questions about:
- Cryptocurrencies (Bitcoin, Ethereum, altcoins, etc.)
- Blockchain technology
- DeFi (Decentralized Finance)
- NFTs and Web3
- Crypto trading, market analysis, and trends
- Crypto wallets and security
- Mining and staking

If asked about topics outside cryptocurrency, politely redirect the conversation back to crypto topics. Be helpful, informative, and concise.`;

// Chat endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Invalid messages format' });
        }

        // Convert OpenAI format messages to Gemini format
        // Combine system prompt with the conversation history
        let conversationText = CRYPTO_SYSTEM_PROMPT + '\n\n';
        
        messages.forEach(msg => {
            if (msg.role === 'user') {
                conversationText += `User: ${msg.content}\n\n`;
            } else if (msg.role === 'assistant') {
                conversationText += `Assistant: ${msg.content}\n\n`;
            }
        });

        // Generate response
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: conversationText,
        });

        const text = response.text;

        console.log('Gemini response received');

        res.json({
            message: text,
        });
    } catch (error) {
        console.error('Gemini API error:', error);
        console.error('Error details:', error.message);
        res.status(500).json({ 
            error: 'Failed to get response',
            details: error.message 
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🤖 Gemini AI: ${process.env.GEMINI_API_KEY ? 'Configured ✓' : 'Missing ✗'}`);
});