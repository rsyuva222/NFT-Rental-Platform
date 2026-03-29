import { useState } from "react";
import { connectWallet } from "./Freighter";
import ListNFT from "./ListNFT";
import RentNFT from "./RentNFT";
import EndRental from "./EndRental"; // Added this
import ViewRental from "./ViewRental";

export default function App() {
    const [wallet, setWallet] = useState(null);

    const handleConnect = async () => {
        try {
            console.log("Connecting to Freighter...");
            const user = await connectWallet();

            if (user) {
                setWallet(user);
                console.log("Wallet Connected:", user);
            } else {
                alert("Connection failed: Please ensure Freighter is unlocked and you have approved access.");
            }
        } catch (e) {
            console.error("Connection error:", e);
            alert("Error: Freighter extension not found or connection refused.");
        }
    };

    return (
        <div style={{ textAlign: "center", padding: "40px", fontFamily: "Arial", backgroundColor: "#fff", minHeight: "100vh" }}>
            <h1>NFT Rental Platform</h1>

            {/* Wallet Connection Section */}
            <div style={{ marginBottom: "20px" }}>
                <button
                    onClick={handleConnect}
                    style={{
                        padding: "12px 24px",
                        cursor: "pointer",
                        fontSize: "16px",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        backgroundColor: wallet ? "#f0f0f0" : "#fff",
                        fontWeight: "bold"
                    }}
                >
                    {wallet ? `Connected: ${wallet.slice(0, 6)}...${wallet.slice(-4)}` : "Connect Wallet"}
                </button>

                {!wallet && (
                    <p style={{ color: "#666", fontSize: "14px", marginTop: "10px" }}>
                        Please connect your wallet to interact with the contract.
                    </p>
                )}
            </div>

            <hr style={{ margin: "30px auto", width: "80%", opacity: "0.3" }} />

            {/* Action Buttons Container */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "center" }}>

                {/* List Action */}
                <ListNFT wallet={wallet} />

                {/* Rent Action */}
                <RentNFT walletAddress={wallet} />

                {/* End Rental Action (The one you were missing) */}
                <EndRental walletAddress={wallet} />

                {/* View State */}
                <ViewRental walletAddress={wallet} />

            </div>
        </div>
    );
}