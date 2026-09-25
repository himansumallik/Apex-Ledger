import User from '../models/User.js';
import Account from '../models/Account.js';

export const getAdminDashboardData = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        const accounts = await Account.find().populate('userId', 'name email');
        //console.log(req);
        
        res.json({
            totalUsers: users.length,
            totalAccounts: accounts.length,
            users,
            accounts
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error in admin dashboard' });
    }
};