import { useState } from "react";
import api from "../services/api";

export const TransactionForm = ({accounts, onTransactionSuccess}) => {
    const accountId = accounts[0]?._id || '';
    const [type, setType] = useState('deposit');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Income');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async(e) => {
        e.preventDefault();
        setError('');
        if(Number(amount)>0){
            setError('Amount must be greater than 0');
            return;
        }

        const endpoint = type === 'deposit' ? '/transactions/deposit' : '/transactions/withdraw';

        const payload = {
            accountId: selectedAccountId || accounts[0]?._id,
            amount: Number(amount),
            category,
            description,
        };

        try{
            setLoading(true);
            await api.post(endpoint, payload);
            
            if(onTransactionSuccess) onTransactionSuccess();
            setAmount('');
            setDescription('');
        }catch(err){
            const msg = err.response?.data?.message || 'Transaction failed';
            setError(msg);
        }finally{
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} style={{ border: '1px solid #ddd', padding: '16px', margin: '16px 0' }}>
        <h3>Record a Transaction</h3>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {/* Account Selector */}
        <div>
            <label htmlFor="tx-account">Select Account: </label>
            <select
            id="tx-account"
            value={selectedAccountId}
            onChange={(e) => setSelectedAccountId(e.target.value)}
            >
            {accounts.map((acc) => (
                <option key={acc._id} value={acc._id}>
                {acc.accountType} — Balance: {acc.currency || '$'}{acc.balance}
                </option>
            ))}
            </select>
        </div>

        {/* Type Toggle: Deposit or Withdraw */}
        <div style={{ marginTop: '8px' }}>
            <label htmlFor="tx-type">Type: </label>
            <select
            id="tx-type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            >
            <option value="deposit">Deposit</option>
            <option value="withdraw">Withdraw</option>
            </select>
        </div>

        {/* Amount Input */}
        <div style={{ marginTop: '8px' }}>
            <label htmlFor="tx-amount">Amount: </label>
            <input
            id="tx-amount"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            />
        </div>

        {/* Category Dropdown */}
        <div style={{ marginTop: '8px' }}>
            <label htmlFor="tx-category">Category: </label>
            <select
            id="tx-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            >
            {type === 'deposit' ? (
                <>
                <option value="Salary">Salary</option>
                <option value="Investment">Investment</option>
                <option value="Gift">Gift</option>
                <option value="Other Income">Other Income</option>
                </>
            ) : (
                <>
                <option value="Food">Food</option>
                <option value="Rent">Rent</option>
                <option value="Utilities">Utilities</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Shopping">Shopping</option>
                <option value="Other Expense">Other Expense</option>
                </>
            )}
            </select>
        </div>

        {/* Description Field */}
        <div style={{ marginTop: '8px' }}>
            <label htmlFor="tx-desc">Description: </label>
            <input
            id="tx-desc"
            type="text"
            placeholder="e.g. Grocery run, Freelance check"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            />
        </div>

        {/* Submit Button */}
        <button type="submit" disabled={loading || accounts.length === 0} style={{ marginTop: '12px' }}>
            {loading ? 'Processing...' : `Submit ${type === 'deposit' ? 'Deposit' : 'Withdrawal'}`}
        </button>
        </form>
    );
}