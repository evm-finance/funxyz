import { ethers } from 'ethers';
import { UNISWAP_V2_ROUTER_ADDRESS, UNISWAP_ROUTER_ABI } from '../services/constants';

/**
 * Hook for swapping ERC20 → ERC20 via Uniswap V2 Router
 * @param {ethers.Signer} signer - The connected wallet signer
 * @returns {function swapExactTokensForTokens}
 */
export function useUniswapSwap(signer) {
    const swapExactTokensForTokens = async ({ amountIn, amountOutMin, path, to, deadline }) => {
        if (!signer) throw new Error('Wallet signer is not connected');

        const router = new ethers.Contract(
            UNISWAP_V2_ROUTER_ADDRESS,
            UNISWAP_ROUTER_ABI,
            signer
        );

        const tx = await router.swapExactTokensForTokens(
            amountIn,
            amountOutMin,
            path,
            to,
            deadline
        );

        await tx.wait();
        return tx;
    };

    return { swapExactTokensForTokens };
}