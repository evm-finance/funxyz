export function TokenInput({ tokenSymbol, value, onChange }) {
    return (
        <div style={{ margin: "1rem 0" }}>
            <label>{tokenSymbol}</label><br />
            <input
                type="number"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Amount"
                style={{ padding: '0.5rem', width: '200px' }}
            />
        </div>
    );
}