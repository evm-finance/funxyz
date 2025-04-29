import { ethers } from 'ethers';
import { UNISWAP_V2_ROUTER_ADDRESS, ERC20_ABI } from '../services/constants';

export function useApproveToken(signer) {
    const approve = async (tokenAddress) => {
        if (!signer) throw new Error("Wallet not connected");

        const erc20 = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
        const tx = await erc20.approve(UNISWAP_V2_ROUTER_ADDRESS, '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
        await tx.wait();

        return tx;
    };

    return { approve };
}