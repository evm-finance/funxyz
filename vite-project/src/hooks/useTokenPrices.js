import { useQuery } from '@tanstack/react-query';
import { getAssetPriceInfo } from '@funkit/api-base';
import { SUPPORTED_TOKENS } from '../services/constants';

export function useTokenPrices() {
    return useQuery({
        queryKey: ['tokenPrices'],
        queryFn: async () => {
            const prices = {};

            for (const token of SUPPORTED_TOKENS) {
                try {
                    const result = await getAssetPriceInfo({
                        chainId: '1',
                        assetTokenAddress: token.address,
                        apiKey: 'Z9SZaOwpmE40KX61mUKWm5hrpGh7WHVkaTvQJpQk', // your key
                    });

                    console.log(`${token.symbol} price result:`, result);
                    prices[token.symbol] = result.unitPrice;
                } catch (err) {
                    console.error(`Error fetching ${token.symbol}:`, err);
                    prices[token.symbol] = undefined;
                }
            }

            console.log(prices)
            return prices;
        },
        staleTime: 60000,
        onSuccess: () => {
            setPriceLoaded(true);
        },
    });
}