import { useState } from 'react';
import { Web3Provider } from '@ethersproject/providers';
export function useWallet() {
    const [address, setAddress] = useState(null);
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);

    const connectWallet = async () => {
        try {
            if (!window.ethereum) {
                alert('Please install MetaMask!');
                return;
            }

            const newProvider = new Web3Provider(window.ethereum);
            const accounts = await newProvider.send("eth_requestAccounts", []);
            const newSigner = newProvider.getSigner();
            const newAddress = await newSigner.getAddress();

            setProvider(newProvider);
            setSigner(newSigner);
            setAddress(newAddress);
        } catch (err) {
            console.error("Wallet connection failed:", err);
            alert("Failed to connect wallet. See console for details.");
        }
    };

    const disconnectWallet = () => {
        setProvider(null);
        setSigner(null);
        setAddress(null);
    };

    return { address, provider, signer, connectWallet, disconnectWallet };
}