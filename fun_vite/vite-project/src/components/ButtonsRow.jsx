export function ButtonsRow() {
    const buttons = ["USDC", "USDT", "ETH", "WBTC"];

    return (
        <div style={{
            display: "flex",
            justifyContent: "space-around",
            padding: "1rem",
            gap: "1rem",
        }}>
            {buttons.map((label) => (
                <button
                    key={label}
                    style={{
                        padding: "0.75rem 1.5rem",
                        borderRadius: "12px",
                        border: "1px solid #ccc",
                        backgroundColor: "#f9f9f9",
                        cursor: "pointer",
                        fontSize: "1rem",
                        fontWeight: "bold"
                    }}
                    onClick={() => console.log(`${label} clicked`)}
                >
                    {label}
                </button>
            ))}
        </div>
    );
}