import { useState, useMemo, useEffect } from 'react';
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

const defaultInputToken = SUPPORTED_TOKENS.find(t => t.symbol === 'WETH');
const defaultOutputToken = SUPPORTED_TOKENS.find(t => t.symbol === 'USDC');

function App() {
    const { address, signer, connectWallet } = useWallet();
    const { swapExactTokensForTokens } = useUniswapSwap(signer);

    const [inputToken, setInputToken] = useState(defaultInputToken);
    const [outputToken, setOutputToken] = useState(defaultOutputToken);

    const {
        data: tokenPrices,
        isLoading,
        isSuccess,
    } = useTokenPrices();

    const inputPrice = tokenPrices?.[inputToken.symbol];
    const outputPrice = tokenPrices?.[outputToken.symbol];
    const [inputAmount, setInputAmount] = useState('1');
    const [showTokenSelectorFor, setShowTokenSelectorFor] = useState(null);
    const [walletConnected, setWalletConnected] = useState(false);

    const { data: quotedOutputAmount } = useQuoteSwap(
        signer?.provider || null,
        inputToken,
        outputToken,
        inputAmount
    );



    // Debugging
    // console.log("tokenPrices:", tokenPrices);

    const fallbackQuote = useMemo(() => {
        if (!inputPrice || !outputPrice || !inputAmount) return '';
        const input = parseFloat(inputAmount);
        if (isNaN(input) || input <= 0) return '';
        const ratio = inputPrice / outputPrice;
        return (input * ratio).toFixed(6);
    }, [inputPrice, outputPrice, inputAmount]);

    const { data: isApproved, refetch: refetchApproval } = useApprovalStatus(signer, inputToken);
    const { approve } = useApproveToken(signer);



    const amountToDisplay = quotedOutputAmount || fallbackQuote || '';


    // Debugging
    // useEffect(() => {
    //   console.log("amountToDisplay updated:", amountToDisplay);
    // }, [amountToDisplay]);

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
        if (!signer || !quotedOutputAmount) {
            alert('Please connect your wallet and ensure quote is ready.');
            return;
        }

        try {
            const deadline = Math.floor(Date.now() / 1000) + 600; // 10 min
            const amountIn = parseUnits(inputAmount || '0', inputToken.decimals);
            const expectedAmountOut = parseUnits(quotedOutputAmount, outputToken.decimals);
            const minAmountOut = expectedAmountOut * BigInt(10000 - 1000) / BigInt(10000); // 10% slippage

            await swapExactTokensForTokens({
                amountIn,
                amountOutMin: minAmountOut,
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

    const handleConnectWallet = async () => {
        await connectWallet();
        setWalletConnected(true);
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

            {showTokenSelectorFor && (
                <ButtonsRow
                    tokens={SUPPORTED_TOKENS}
                    selectedSymbol={
                        showTokenSelectorFor === 'input' ? inputToken.symbol : outputToken.symbol
                    }
                    onSelect={handleTokenSelect}
                />
            )}

            <TokenCard
                token={inputToken}
                amount={inputAmount}
                onAmountChange={handleInputAmountChange}
                onSelectToken={() => setShowTokenSelectorFor('input')}
                price={tokenPrices?.[inputToken.symbol]}
            />

            <TokenCard
                token={outputToken}
                amount={amountToDisplay}
                readOnly
                onSelectToken={() => setShowTokenSelectorFor('output')}
                price={outputPrice}
            />

            <div style={{ marginTop: '1rem' }}>
                {!signer ? (
                    <button onClick={handleConnectWallet}>
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