import express from 'express';
import {GoogleGenAI} from '@google/genai';
import Account from '../models/Account.js';
import Transaction from '../models/Transaction.js';
import {protect} from '../middleware/authMiddleware.js';
import 'dotenv/config';

const router = express.Router();
const ai = new GoogleGenAI();

router.post('/chat', protect, async(req,res) => {
    try{
        const {messages} = req.body;
        const userId = req.user.id;

        const accounts = await Account.find({userId});
        const transactions = await Transaction.find({userId}).sort({createdAt: -1}).limit(50);

        const financialContext = `
        Here is the user's current financial data:
        - Accounts & Balances: ${JSON.stringify(accounts)}
        - Recent Transactions: ${JSON.stringify(transactions)}
        `;

        const systemInstruction = `You are ApexAI, an intelligent, friendly personal financial assistant embedded inside the ApexLedger app. 
        Your job is to answer the user's questions strictly based on their real financial data provided below. 
        Be concise, clear, and professional.
        ${financialContext}`;

        const userPrompt = messages[messages.length - 1].content;

        const response = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: userPrompt,
            config: {
                systemInstruction: systemInstruction,
            }
        });

        res.json({reply: response.text});
    }catch(error){
        console.error('Gemini AI Chat Error:', error); 
        return res.status(500).json({message: 'Failed to generate AI response'});
    }
})

export default router;