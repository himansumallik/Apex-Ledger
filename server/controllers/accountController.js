import Account from '../models/Account.js';
import redis from '../config/redis.js'; 

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


export const getAccounts = async (req, res) => {
    const userId = req.user._id;
    const cacheKey = `accounts:${userId}`;

    try {
        // 1. Check Redis cache first
        const cachedAccounts = await redis.get(cacheKey);
        if (cachedAccounts) {
            console.log('Cache HIT for accounts:', cacheKey);
            const parsedData = JSON.parse(cachedAccounts);
            return res.status(200).json({
                success: true,
                count: parsedData.length,
                accounts: parsedData,
            });
        }

        console.log('Cache MISS for accounts. Querying MongoDB...');
        // 2. If not cached, query MongoDB
        const accounts = await Account.find({ userId }).sort({ createdAt: -1 });

        // 3. Store result in Redis with a 60-second expiry (EX 60)
        await redis.set(cacheKey, JSON.stringify(accounts), 'EX', 60);

        return res.status(200).json({
            success: true,
            count: accounts.length,
            accounts,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};