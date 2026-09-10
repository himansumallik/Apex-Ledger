import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
    {
        accountId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Account',
            required: [true, 'Account ID is required'],
        },
        amount: {
            type: Number,
            required: [true, 'Amount is required'],
            min: [0.01, 'Amount must be greater than zero'],
        },
        type:{
            type: String,
            required: [true, 'Account type is required'],
            enum: {
                values: ['deposit', 'withdrawl'],
                message: '{VALUE} is not valid account type',
            },
            lowercase: true,
            trim: true,
        },
        categories: {
            type: String,
            required: [true, 'Category is required'],
            enum: {
                values: ['salary', 'groceries', 'entertainment', 'utilities', 'other'],
                message: '{VALUE} is not a valid categories type',
            },
            default: 'other',
            lowercase: true,
            trim: true,
        },
        description: {
            type: String,
            maxlength: [200, 'Description cannot exceed 200 characters'],
            trim: true,
        },
        date: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    },
)

transactionSchema.index({accountId: 1, date: -1});

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;