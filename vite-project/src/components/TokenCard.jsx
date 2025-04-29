export function TokenCard({ token, amount, onAmountChange, readOnly, onSelectToken, price }) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '1rem',
            border: '1px solid #eee',
            borderRadius: '16px',
            marginBottom: '1rem',
            backgroundColor: '#fff',
            boxShadow: '0 4px 8px rgba(0,0,0,0.05)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                <img
                    src={token.logoURI}
                    alt={token.symbol}
                    style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        marginRight: '0.5rem',
                        objectFit: 'cover',
                    }}
                />
                <strong>{token.symbol}</strong>
                <button
                    onClick={onSelectToken}
                    style={{
                        marginLeft: '0.5rem',
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.8rem'
                    }}
                >
                    Change
                </button>
            </div>

            {/* ✅ Show USD price if available */}
            {price !== undefined && (
                <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                    ${price.toFixed(2)}
                </div>
            )}

            <input
                type="number"
                value={amount}
                onChange={(e) => onAmountChange && onAmountChange(e.target.value)}
                readOnly={readOnly}
                placeholder="0.0"
                style={{
                    padding: '0.75rem',
                    textAlign: 'center',
                    width: '100%',
                    fontSize: '1.25rem'
                }}
            />
        </div>
    );
}