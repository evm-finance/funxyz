import { useWallet } from '../hooks/useWallet';

export function ConnectWalletButton() {
    const { address, connectWallet, disconnectWallet } = useWallet();

    if (address) {
        return (
            <div>
                Connected to {address.slice(0,6)}...
                <button onClick={disconnectWallet}>Disconnect</button>
            </div>
        );
    }

    return <button onClick={connectWallet}>Connect Wallet</button>;
}