import { useState } from 'react';
import { SUPPORTED_TOKENS } from './services/constants';
import { useWallet } from './hooks/useWallet';
import { useUniswapSwap } from './hooks/useUniswapSwap';
import { ButtonsRow } from './components/ButtonsRow';
import { TokenCard } from './components/TokenCard';
import { useApprovalStatus } from './hooks/useApprovalStatus';
import { useApproveToken } from './hooks/useApproveToken';
import { ethers} from 'ethers';
import { useTokenPrices } from './hooks/useTokenPrices';
import { parseUnits } from '@ethersproject/units';

function App() {
    const { address, signer, connectWallet } = useWallet();
    const { swapExactTokensForTokens } = useUniswapSwap(signer);

    const defaultInputToken = SUPPORTED_TOKENS.find(t => t.symbol === 'WETH');
    const defaultOutputToken = SUPPORTED_TOKENS.find(t => t.symbol === 'USDC');

    const [inputToken, setInputToken] = useState(defaultInputToken);
    const [outputToken, setOutputToken] = useState(defaultOutputToken);
    const [inputAmount, setInputAmount] = useState('');
    const [outputAmount, setOutputAmount] = useState('');
    const [showTokenSelectorFor, setShowTokenSelectorFor] = useState(null);

    const { approve } = useApproveToken(signer);
    const { data: isApproved, refetch: refetchApproval } = useApprovalStatus(signer, inputToken);



    const handleSwap = async () => {
        if (!signer) {
            alert("Please connect your wallet first.");
            return;
        }

        try {
            const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10 minutes
            const amountIn = parseUnits(inputAmount || '0', inputToken.decimals);

            await swapExactTokensForTokens({
                amountIn,
                amountOutMin: 0, // no slippage protection yet
                path: [inputToken.address, outputToken.address],
                to: address,
                deadline,
            });

            alert('Swap complete!');
        } catch (err) {
            console.error(err);
            alert('Swap failed.');
        }
    };

    const handleTokenSelect = (symbol) => {
        const selectedToken = SUPPORTED_TOKENS.find(t => t.symbol === symbol);
        if (!selectedToken) return;

        if (showTokenSelectorFor === 'input') {
            setInputToken(selectedToken);

            // Avoid input == output
            if (selectedToken.symbol === outputToken.symbol) {
                setOutputToken(SUPPORTED_TOKENS.find(t => t.symbol !== selectedToken.symbol));
            }
        } else if (showTokenSelectorFor === 'output') {
            setOutputToken(selectedToken);

            if (selectedToken.symbol === inputToken.symbol) {
                setInputToken(SUPPORTED_TOKENS.find(t => t.symbol !== selectedToken.symbol));
            }
        }

        setShowTokenSelectorFor(null); // hide token selector after selection
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
            <h2>Swap</h2>

            {showTokenSelectorFor && (
                <ButtonsRow
                    tokens={SUPPORTED_TOKENS}
                    selectedSymbol={(showTokenSelectorFor === 'input' ? inputToken.symbol : outputToken.symbol)}
                    onSelect={(symbol) => handleTokenSelect(symbol)}
                />
            )}

            <TokenCard
                token={inputToken}
                amount={inputAmount}
                onAmountChange={setInputAmount}
                onSelectToken={() => setShowTokenSelectorFor('input')}
            />

            <TokenCard
                token={outputToken}
                amount={outputAmount}
                readOnly
                onSelectToken={() => setShowTokenSelectorFor('output')}
            />

            <div style={{ marginTop: '1rem' }}>
                {!signer ? (
                    <button onClick={connectWallet}>Connect Wallet</button>
                ) : inputToken.address !== '0x0000000000000000000000000000000000000000' && !isApproved ? (
                    <button
                        onClick={async () => {
                            try {
                                await approve(inputToken.address);
                                await refetchApproval(); // after approve, refresh allowance
                                alert("Approval successful!");
                            } catch (err) {
                                console.error(err);
                                alert("Approval failed.");
                            }
                        }}
                        style={{ padding: '0.75rem 1.5rem', fontWeight: 'bold' }}
                    >
                        Approve {inputToken.symbol}
                    </button>
                ) : (
                    <button
                        onClick={handleSwap}
                        style={{ padding: '0.75rem 1.5rem', fontWeight: 'bold' }}
                    >
                        Swap {inputToken.symbol} → {outputToken.symbol}
                    </button>
                )}
            </div>
        </div>
    );
}

export default App;