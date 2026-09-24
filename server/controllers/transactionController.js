import mongoose from "mongoose";
import Transaction from "../models/Transaction.js";
import Account from "../models/Account.js";
import redis from "../config/redis.js"; // <-- Import Redis client

export const deposit = async(req,res) => {
    const {amount, description, category, accountId} = req.body;
    

    if( !accountId || !amount){
        return res.status(400).json({message: 'Account Id and Amount are required'});
    }

    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
        return res.status(400).json({ message: 'Amount must be a positive number' });
    }

    try {
        const account = await Account.findById(accountId);

        if(!account){
            console.log('Account not found for deposit:', accountId);
            return res.status(404).json({message: 'Account not found'})
        }

        if(account.userId.toString() != req.user._id.toString()){
            return res.status(403).json({message: 'Not authorized to access this account'});
        }

        account.balance += Number(amount);
        await account.save();

        const newTransaction = await Transaction.create({
            accountId: account._id,
            amount: Number(amount),
            type: 'deposit',
            category: category || 'others',
            description: description,
        })

        const cacheKey = `accounts:${account.userId}`;
        await redis.del(cacheKey);
        console.log(`Cache invalidated on deposit:`, cacheKey);

        return res.status(201).json({
            "message": "Deposit successful",
            "balance": account.balance,
            "transaction": newTransaction,
        })
    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}

export const withdraw = async(req, res) => {
    const {accountId, amount, category, description} = req.body;

    if(!accountId || amount === undefined){
        return res.status(400).json({message: 'Account ID and Amount is required'});
    }

    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
        return res.status(400).json({ message: 'Amount must be a positive number' });
    }

    try {
        const account = await Account.findById(accountId);

        if(!account){
            return res.status(404).json({message: 'Account not found'})
        }

        if(account.userId.toString() != req.user._id.toString()){
            return res.status(403).json({message: 'Not authorized to access this account'});
        }

        if(account.balance < numericAmount){
            return res.status(400).json({message: 'Insufficient funds'});
        }

        account.balance -= Number(numericAmount);
        await account.save();

        const newTransaction = await Transaction.create({
            accountId: account._id,
            amount: numericAmount,
            type: 'withdrawl',
            category: category || 'others',
            description: description || '',
        })

        const cacheKey = `accounts:${account.userId}`;
        await redis.del(cacheKey);
        console.log('Cache invalidated on withdrawal:', cacheKey);

        return res.status(201).json({
            "message": "Withdraw successful",
            "balance": account.balance,
            "transaction": newTransaction,
        })
    } catch (error) {
        return res.status(400).json({message: error.message});
    }

}

export const getTransactions = async (req, res) => {
    const { accountId } = req.params;
    const userId = req.user._id;

    if (!accountId) {
        return res.status(400).json({ message: 'Account ID is required' });
    }

    try {
        const cacheKey = `transactions:${accountId}`;

        // 1. Check Redis Cache first (Wrapped in try/catch for fallback resilience)
        try {
            const cachedTxs = await redis.get(cacheKey);
            if (cachedTxs) {
                console.log('Cache HIT for transactions:', cacheKey);
                return res.status(200).json(JSON.parse(cachedTxs));
            }
        } catch (redisErr) {
            console.error('Redis read error, falling back to MongoDB:', redisErr);
        }

        console.log('Cache MISS for transactions. Querying MongoDB...');

        // 2. Validate account and authorization
        const account = await Account.findById(accountId);
        
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        if (account.userId.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Not authorized to access this account' });
        }

        const transactions = await Transaction.find({ accountId }).sort({ date: -1 });

        const responsePayload = {
            success: true,
            count: transactions.length,
            transactions,
        };

        // 3. Store the result in Redis with a 60-second TTL (Wrapped in try/catch)
        try {
            await redis.set(cacheKey, JSON.stringify(responsePayload), 'EX', 60);
        } catch (redisErr) {
            console.error('Redis write error:', redisErr);
        }

        return res.status(200).json(responsePayload);

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};