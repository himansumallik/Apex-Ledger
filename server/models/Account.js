import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User ID is required'],
        },
        accountType: {
            type: String,
            required: [true, 'Account type is required'],
            enum: {
                values: ['checking', 'savings', 'credit', 'investment'],
                message: `${VALUE} is not a valid account type`,
            },
            lowercase: true,
            trim: true,
        },
        balance: {
            type: Number,
            required: [true, 'Balance is required'],
            default: 0.0,
        },
        currency: {
            type: String,
            required: [true, 'Currency is required'],
            default: 'INR',
            uppercase: true,
            trim: true,
        },
    },
    {
        timestamps: true, 
    }
);

accountSchema.index({userId: 1});

const Account = mongoose.model('Account', accountSchema);

export default Account;