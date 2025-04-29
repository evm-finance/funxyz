import { useCryptoPrices } from "../../hooks/useCryptoPrices.js";

export function TokenCards() {
    const tokenSymbols = ["USDC", "WETH", "WBTC", "USDT"];
    const { data, isLoading, error } = useCryptoPrices(tokenSymbols);

    console.log('Rendering TokenCards', { isLoading, data });


    if (isLoading) return <div>Loading tokens...</div>;
    if (error) return <div>Error loading tokens</div>;

    return (
        <div style={{
            display: "flex",
            justifyContent: "space-around",
            padding: "1rem",
            gap: "2rem",
            flexWrap: "wrap",
        }}>
            {Object.entries(data || {}).map(([symbol, price]) => (
                <div
                    key={symbol}
                    style={{
                        flex: "1 0 40%",
                        padding: "1.5rem",
                        borderRadius: "16px",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                        backgroundColor: "#ffffff",
                        textAlign: "center",
                    }}
                >
                    <h2 style={{ marginBottom: "0.5rem", fontSize: "1.5rem" }}>{symbol}</h2>
                    <p style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
                        {typeof price === 'number'
                            ? `$${price.toFixed(2)}`
                            : "Price unavailable"}
                    </p>
                </div>
            ))}
        </div>
    );
}