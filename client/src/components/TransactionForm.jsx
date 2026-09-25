import { useState, useEffect } from "react";
import api from "../services/api";

export const TransactionForm = ({ accounts, onTransactionSuccess }) => {
    const [selectedAccountId, setSelectedAccountId] = useState(accounts[0]?._id || '');
    const [type, setType] = useState('deposit');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Salary');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Update selected account if accounts load or change
    useEffect(() => {
        if (accounts.length > 0 && !selectedAccountId) {
            setSelectedAccountId(accounts[0]._id);
        }
    }, [accounts]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Fixed validation: error if amount is zero or negative
        if (!amount || Number(amount) <= 0) {
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

        try {
            setLoading(true);
            await api.post(endpoint, payload);
            
            if (onTransactionSuccess) onTransactionSuccess();
            setAmount('');
            setDescription('');
        } catch (err) {
            const msg = err.response?.data?.message || 'Transaction failed';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ padding: '4px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', marginBottom: '16px' }}>
                Record a Transaction
            </h3>

            {error && <p style={{ color: '#dc2626', backgroundColor: '#fef2f2', padding: '10px', borderRadius: '6px', marginBottom: '12px', fontSize: '14px' }}>{error}</p>}

            {/* Account Selector */}
            <div style={{ marginBottom: '12px' }}>
                <label htmlFor="tx-account" style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                    Select Account:
                </label>
                <select
                    id="tx-account"
                    value={selectedAccountId}
                    onChange={(e) => setSelectedAccountId(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', backgroundColor: '#ffffff' }}
                >
                    {accounts.map((acc) => (
                        <option key={acc._id} value={acc._id}>
                            {acc.accountType} — Balance: {acc.currency || '$'}{acc.balance}
                        </option>
                    ))}
                </select>
            </div>

            {/* Type Toggle: Deposit or Withdraw */}
            <div style={{ marginBottom: '12px' }}>
                <label htmlFor="tx-type" style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                    Type:
                </label>
                <select
                    id="tx-type"
                    value={type}
                    onChange={(e) => {
                        setType(e.target.value);
                        // Default category based on type switch
                        setCategory(e.target.value === 'deposit' ? 'Salary' : 'Food');
                    }}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', backgroundColor: '#ffffff' }}
                >
                    <option value="deposit">Deposit</option>
                    <option value="withdraw">Withdraw</option>
                </select>
            </div>

            {/* Amount Input */}
            <div style={{ marginBottom: '12px' }}>
                <label htmlFor="tx-amount" style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                    Amount:
                </label>
                <input
                    id="tx-amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }}
                />
            </div>

            {/* Category Dropdown */}
            <div style={{ marginBottom: '12px' }}>
                <label htmlFor="tx-category" style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                    Category:
                </label>
                <select
                    id="tx-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', backgroundColor: '#ffffff' }}
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
            <div style={{ marginBottom: '16px' }}>
                <label htmlFor="tx-desc" style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                    Description (Optional):
                </label>
                <input
                    id="tx-desc"
                    type="text"
                    placeholder="e.g. Grocery run, Freelance check"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }}
                />
            </div>

            {/* Submit Button */}
            <button 
                type="submit" 
                disabled={loading || accounts.length === 0} 
                style={{ 
                    width: '100%',
                    backgroundColor: type === 'deposit' ? '#10b981' : '#2563eb', 
                    color: '#ffffff', 
                    border: 'none', 
                    borderRadius: '6px', 
                    padding: '12px', 
                    fontWeight: '600', 
                    cursor: 'pointer',
                    fontSize: '15px'
                }}
            >
                {loading ? 'Processing...' : `Submit ${type === 'deposit' ? 'Deposit' : 'Withdrawal'}`}
            </button>
        </form>
    );
};