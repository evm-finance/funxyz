import { useState } from 'react';
import { ethers, parseUnits } from 'ethers';
import { useWallet } from './hooks/useWallet';
import { useUniswapSwap } from './hooks/useUniswapSwap';
import { useTokenPrices } from './hooks/useTokenPrices';
import { useApprovalStatus } from './hooks/useApprovalStatus';
import { useApproveToken } from './hooks/useApproveToken';
import { useQuoteSwap } from './hooks/useQuoteSwap';
import { SUPPORTED_TOKENS } from './services/constants';
import { TokenCard } from './components/TokenCard';
import { ButtonsRow } from './components/ButtonsRow';

// Default input/output tokens
const defaultInputToken = SUPPORTED_TOKENS.find(t => t.symbol === 'WETH');
const defaultOutputToken = SUPPORTED_TOKENS.find(t => t.symbol === 'USDC');

function App() {
    const { address, signer, connectWallet } = useWallet();
    const { swapExactTokensForTokens } = useUniswapSwap(signer);

    const [inputToken, setInputToken] = useState(defaultInputToken);
    const [outputToken, setOutputToken] = useState(defaultOutputToken);
    const [inputAmount, setInputAmount] = useState('');
    const [showTokenSelectorFor, setShowTokenSelectorFor] = useState(null);

    const { data: tokenPrices, isLoading: pricesLoading } = useTokenPrices();
    const { data: quotedOutputAmount } = useQuoteSwap(
        signer?.provider || null,
        inputToken,
        outputToken,
        inputAmount
    );
    const { data: isApproved, refetch: refetchApproval } = useApprovalStatus(signer, inputToken);
    const { approve } = useApproveToken(signer);

    const handleTokenSelect = (symbol) => {
        const selectedToken = SUPPORTED_TOKENS.find(t => t.symbol === symbol);
        if (!selectedToken) return;

        if (showTokenSelectorFor === 'input') {
            setInputToken(selectedToken);
            if (selectedToken.symbol === outputToken.symbol) {
                setOutputToken(SUPPORTED_TOKENS.find(t => t.symbol !== selectedToken.symbol));
            }
        } else if (showTokenSelectorFor === 'output') {
            setOutputToken(selectedToken);
            if (selectedToken.symbol === inputToken.symbol) {
                setInputToken(SUPPORTED_TOKENS.find(t => t.symbol !== selectedToken.symbol));
            }
        }

        setShowTokenSelectorFor(null);
    };

    const handleSwap = async () => {
        if (!signer) {
            alert('Please connect your wallet.');
            return;
        }
        try {
            const deadline = Math.floor(Date.now() / 1000) + 600; // 10 min
            const amountIn = parseUnits(inputAmount || '0', inputToken.decimals);
            const minAmountOut = expectedAmountOut * BigInt(10000 - 0.1 * 10000) / BigInt(10000);
            await swapExactTokensForTokens({
                amountIn,
                amountOutMin,
                path: [inputToken.address, outputToken.address],
                to: address,
                deadline,
            });

            alert('Swap Successful!');
        } catch (err) {
            console.error(err);
            alert('Swap failed.');
        }
    };

    const handleApprove = async () => {
        try {
            await approve(inputToken.address);
            await refetchApproval();
            alert(`Approved ${inputToken.symbol}!`);
        } catch (err) {
            console.error(err);
            alert('Approval failed.');
        }
    };

    const handleInputAmountChange = (value) => {
        setInputAmount(value);
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
            <h2>Swap</h2>

            {/* Token Selector */}
            {showTokenSelectorFor && (
                <ButtonsRow
                    tokens={SUPPORTED_TOKENS}
                    selectedSymbol={showTokenSelectorFor === 'input' ? inputToken.symbol : outputToken.symbol}
                    onSelect={handleTokenSelect}
                />
            )}

            {/* Input Token Card */}
            <TokenCard
                token={inputToken}
                amount={inputAmount}
                onAmountChange={handleInputAmountChange}
                onSelectToken={() => setShowTokenSelectorFor('input')}
                price={tokenPrices?.[inputToken.symbol]}
            />

            {/* Output Token Card */}
            <TokenCard
                token={outputToken}
                amount={quotedOutputAmount || ''}
                readOnly
                onSelectToken={() => setShowTokenSelectorFor('output')}
                price={tokenPrices?.[outputToken.symbol]}
            />

            {/* Action Button */}
            <div style={{ marginTop: '1rem' }}>
                {!signer ? (
                    <button onClick={connectWallet}>
                        Connect Wallet
                    </button>
                ) : inputToken.address !== '0x0000000000000000000000000000000000000000' && !isApproved ? (
                    <button onClick={handleApprove}>
                        Approve {inputToken.symbol}
                    </button>
                ) : (
                    <button onClick={handleSwap}>
                        Swap {inputToken.symbol} → {outputToken.symbol}
                    </button>
                )}
            </div>
        </div>
    );
}

export default App;