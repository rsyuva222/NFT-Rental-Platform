import { useState } from "react";
import ConnectWallet from "./components/ConnectWallet";
import ListNFT from "./components/ListNFT";
import RentNFT from "./components/RentNFT";
import EndRental from "./components/EndRental";
import ViewRental from "./components/ViewRental";

export default function App() {
    const [walletAddress, setWalletAddress] = useState(null);

    return (
        <div className="min-h-screen bg-gray-950 text-white px-4 py-10">
            <div className="max-w-2xl mx-auto space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-extrabold text-indigo-400">NFT Rental dApp</h1>
                    <p className="text-gray-400">Rent NFTs on the Stellar blockchain via Soroban</p>
                </div>

                {!walletAddress ? (
                    <div className="flex justify-center">
                        <ConnectWallet onConnect={setWalletAddress} />
                    </div>
                ) : (
                    <>
                        <div className="bg-gray-800 rounded-2xl px-6 py-4 text-sm text-gray-300">
                            <span className="text-white font-semibold">Connected: </span>
                            <span className="font-mono break-all">{walletAddress}</span>
                        </div>

                        <ListNFT caller={walletAddress} />
                        <RentNFT caller={walletAddress} />
                        <EndRental caller={walletAddress} />
                        <ViewRental caller={walletAddress} />
                    </>
                )}
            </div>
        </div>
    );
}