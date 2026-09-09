import Account from "../models/Account.js";

export const createAccount = async(req, res) =>{
    const {accountType, currency}  = req.body;

    if(!accountType){
        return res.status(400).json({message: "Account Type is required"})
    }


    try {
        const newAccount = await Account.create({
            userId: req.user._id,
            accountType,
            currency: currency || 'INR',
            balance: 0.0,
        });

        res.status(201).json({
            message: 'Account created successfully',
            account: newAccount
        })

    } catch (error) {
        return res.status(400).json({message: error.message});
    }

}

export const getAccounts = async(req, res) =>{
    const userId = req.user._id;

    try{
        const accounts = await Account.find({userId}).sort({createdAt: -1});

        return res.status(200).json({
            success: true,
            count: accounts.length,
            accounts,
        })
    } catch (error){
        return res.status(500).json({message: error.message});
    }
}