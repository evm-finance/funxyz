import { useCryptoPrices } from "../../hooks/useCryptoPrices.js";

export function CryptoPrices() {
    const { data, isLoading, error } = useCryptoPrices();

    if (isLoading) return <div>Loading prices...</div>;
    if (error) return <div>Error loading prices</div>;

    return (
        <div style={{ padding: "1rem" }}>
            {Object.entries(data || {}).map(([symbol, price]) => (
                <div key={symbol} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span>{symbol}</span>
                    <span>${price.toFixed(2)}</span>
                </div>
            ))}
        </div>
    );
}