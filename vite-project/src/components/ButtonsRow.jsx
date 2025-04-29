export function ButtonsRow({ tokens, selectedSymbol, onSelect }) {
    return (
        <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '1rem',
            padding: '1rem'
        }}>
            {tokens.map(({ symbol, logoURI }) => (
                <button
                    key={symbol}
                    onClick={() => onSelect(symbol)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem 1rem',
                        borderRadius: '12px',
                        border: selectedSymbol === symbol ? '2px solid black' : '1px solid #ccc',
                        backgroundColor: selectedSymbol === symbol ? '#e6f7ff' : '#f9f9f9',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        minWidth: '160px',
                        justifyContent: 'flex-start',
                    }}
                >
                    {/* Token Logo */}
                    <img
                        src={logoURI}
                        alt={symbol}
                        style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',  // 👈 Makes the logo perfectly round
                            objectFit: 'cover',
                        }}
                    />
                    {/* Token Symbol */}
                    <span style={{ fontSize: '1rem' }}>{symbol}</span>
                </button>
            ))}
        </div>
    );
}