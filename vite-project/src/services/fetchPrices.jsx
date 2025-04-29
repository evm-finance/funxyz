import { getAssetErc20ByChainAndSymbol, getAssetPriceInfo } from '@funkit/api-base';

const API_KEY = "Z9SZaOwpmE40KX61mUKWm5hrpGh7WHVkaTvQJpQk";

export async function getTokenInfo(symbol) {
    const result = await getAssetErc20ByChainAndSymbol({
        chainId: '1',
        symbol,
        apiKey: API_KEY
    });
    return result;
}

export async function getTokenPrice(tokenAddress) {
    const result = await getAssetPriceInfo({
        chainId: '1',
        assetTokenAddress: tokenAddress,
        apiKey: API_KEY
    });
    return result;
}