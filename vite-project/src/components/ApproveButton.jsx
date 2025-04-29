import { useApproveERC20 } from '../hooks/useApproveToken';
import { UNISWAP_V2_ROUTER_ADDRESS } from '../services/constants';

export function ApproveButton({ signer, tokenAddress, amount }) {
    const { approve } = useApproveERC20(signer);

    const handleApprove = async () => {
        try {
            await approve(tokenAddress, UNISWAP_V2_ROUTER_ADDRESS, amount);
            alert('Approval successful!');
        } catch (error) {
            console.error(error);
            alert('Approval failed.');
        }
    };

    return <button onClick={handleApprove}>Approve Token</button>;
}