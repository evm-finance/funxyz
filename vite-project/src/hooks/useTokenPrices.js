import { useQuery } from '@tanstack/react-query';
import { getAssetPriceInfo } from '@funkit/api-base';
import { SUPPORTED_TOKENS } from '../services/constants';

export function useTokenPrices() {
    return useQuery({
        queryKey: ['tokenPrices'],
        queryFn: async () => {
            const prices = {};

            for (const token of SUPPORTED_TOKENS) {
                const result = await getAssetPriceInfo({
                    chainId: '1',
                    assetTokenAddress: token.address,
                    apiKey: 'Z9SZaOwpmE40KX61mUKWm5hrpGh7WHVkaTvQJpQk', // ⚡ Insert your API key
                });
                prices[token.symbol] = result.price;
            }

            return prices;
        },
        staleTime: 60_000, // 1 min cache
    });
}