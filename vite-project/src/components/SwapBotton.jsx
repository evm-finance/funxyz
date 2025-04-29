import { useUniswapSwap } from '../hooks/useUniswapSwap';

export function SwapButton({ signer, amountOutMin, path, to, deadline, ethValue }) {
    const { swapExactETHForTokens } = useUniswapSwap(signer);

    const handleSwap = async () => {
        try {
            await swapExactETHForTokens({ amountOutMin, path, to, deadline, ethValue });
            alert('Swap successful!');
        } catch (error) {
            console.error(error);
            alert('Swap failed.');
        }
    };

    return <button onClick={handleSwap}>Swap ETH for Tokens</button>;
}