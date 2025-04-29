import { useQuery } from '@tanstack/react-query';
import { ethers } from 'ethers';
import { UNISWAP_V2_ROUTER_ADDRESS, UNISWAP_ROUTER_ABI } from '../services/constants';

export function useQuoteSwap(provider, inputToken, outputToken, inputAmount) {
    return useQuery({
        queryKey: ['quote', inputToken?.address, outputToken?.address, inputAmount],
        queryFn: async () => {
            if (!provider || !inputToken || !outputToken || !inputAmount) return null;

            const router = new ethers.Contract(
                UNISWAP_V2_ROUTER_ADDRESS,
                UNISWAP_ROUTER_ABI,
                provider
            );

            const path = [inputToken.address, outputToken.address];
            const amountIn = ethers.parseUnits(inputAmount || '0', inputToken.decimals);

            const amountsOut = await router.getAmountsOut(amountIn, path);
            return ethers.formatUnits(amountsOut[1], outputToken.decimals);
        },
        enabled: !!provider && !!inputToken && !!outputToken && inputAmount > 0,
        refetchOnWindowFocus: false,
    });
}