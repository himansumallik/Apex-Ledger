import mongoose from "mongoose";
import Transaction from "../models/Transaction";
import Account from "../models/Account";

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

        return res.status(201).json({
            "message": "Deposit successful",
            "balance": account.balance,
            "transaction": newTransaction,
        })
    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}