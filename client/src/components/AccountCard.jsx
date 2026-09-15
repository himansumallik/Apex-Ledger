

export const AccountCard = ({account}) =>{
    const {accountType, balance, currency} = account;
    return (
        <div style={{ border: '1px solid #ccc', padding: '12px', margin: '8px 0' }}>
        <h3>{accountType.toUpperCase()}</h3>
        <p>Balance: {currency} {balance}</p>
        </div>
    );
}