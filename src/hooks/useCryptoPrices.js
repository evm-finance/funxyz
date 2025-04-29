import { useQuery } from '@tanstack/react-query';
import { getTokenInfo, getTokenPrice } from '../services/fetchPrices';

export function useCryptoPrices(tokenSymbols) {
    return useQuery({
        queryKey: ['cryptoPrices', tokenSymbols],
        queryFn: async () => {
            //console.log(tokenSymbols)
            if (!tokenSymbols || tokenSymbols.length === 0) return {};

            const tokenInfos = await Promise.all(tokenSymbols.map(symbol => getTokenInfo(symbol)));
            //console.log(tokenInfos)
            const prices = await Promise.all(
                tokenInfos.map(tokenInfo => getTokenPrice(tokenInfo.address))
            );
            //console.log("prices",prices)


            const priceData = {};
            tokenSymbols.forEach((symbol, idx) => {
                priceData[symbol] = prices[idx].unitPrice;
            });

            return priceData;
        },
        refetchInterval: 10000,
    });
}