import { useQuery } from '@tanstack/react-query';
import { ethers } from 'ethers';
import { UNISWAP_V2_ROUTER_ADDRESS, ERC20_ABI } from '../services/constants';

export function useApprovalStatus(signer, token) {
    return useQuery({
        queryKey: ['approvalStatus', token?.address],
        queryFn: async () => {
            if (!signer || !token || token.address === ethers.constants.AddressZero) {
                return true; // Native ETH = always "approved"
            }

            const erc20 = new ethers.Contract(token.address, ERC20_ABI, signer);
            const owner = await signer.getAddress();
            const allowance = await erc20.allowance(owner, UNISWAP_V2_ROUTER_ADDRESS);

            return allowance.gt(0);
        },
        enabled: !!signer && !!token,
        refetchInterval: 15000,
    });
}