import { useState } from "react";
import ConnectWallet from "./components/ConnectWallet";
import ListNFT from "./components/ListNFT";
import RentNFT from "./components/RentNFT";
import EndRental from "./components/EndRental";
import ViewRental from "./components/ViewRental";

export default function App() {
    const [walletAddress, setWalletAddress] = useState(null);

    return (
        <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "white", padding: "40px 16px" }}>
            <div style={{ maxWidth: "640px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>

                <div style={{ textAlign: "center", padding: "24px 0" }}>
                    <h1 style={{ fontSize: "48px", fontWeight: "bold", margin: "0 0 8px 0" }}>
                        NFT <span style={{ color: "#818cf8" }}>Rental</span> dApp
                    </h1>
                    <p style={{ color: "#6b7280", margin: 0 }}>
                        Rent NFTs on the Stellar blockchain via Soroban
                    </p>
                </div>

                {!walletAddress ? (
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <ConnectWallet onConnect={setWalletAddress} />
                    </div>
                ) : (
                    <>
                        <div style={{ background: "#12121a", border: "1px solid #1f2937", borderRadius: "16px", padding: "16px 24px", display: "flex", alignItems: "center", gap: "12px" }}>
                            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#34d399" }}></div>
                            <span style={{ color: "#9ca3af", fontSize: "14px" }}>Connected:</span>
                            <span style={{ color: "#34d399", fontFamily: "monospace", fontSize: "12px", wordBreak: "break-all" }}>{walletAddress}</span>
                        </div>

                        <div style={{ background: "#12121a", border: "1px solid #1f2937", borderRadius: "16px", padding: "20px 24px" }}>
                            <p style={{ color: "white", fontWeight: "bold", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 16px 0" }}>How to use</p>
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

                                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "12px" }}>
                                    <span style={{ minWidth: "26px", height: "26px", borderRadius: "50%", background: "#eab308", color: "black", fontSize: "12px", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center" }}>1</span>
                                    <p style={{ color: "#d1d5db", fontSize: "14px", margin: 0 }}>Click <span style={{ color: "#facc15", fontWeight: "600" }}>List NFT</span> and approve in Freighter</p>
                                </div>

                                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "12px" }}>
                                    <span style={{ minWidth: "26px", height: "26px", borderRadius: "50%", background: "#10b981", color: "black", fontSize: "12px", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center" }}>2</span>
                                    <p style={{ color: "#d1d5db", fontSize: "14px", margin: 0 }}>Wait for <span style={{ color: "#34d399", fontWeight: "600" }}>✅ NFT listed!</span> then click <span style={{ color: "#34d399", fontWeight: "600" }}>Rent Now</span></p>
                                </div>

                                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "12px" }}>
                                    <span style={{ minWidth: "26px", height: "26px", borderRadius: "50%", background: "#0ea5e9", color: "black", fontSize: "12px", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center" }}>3</span>
                                    <p style={{ color: "#d1d5db", fontSize: "14px", margin: 0 }}>Click <span style={{ color: "#38bdf8", fontWeight: "600" }}>Fetch Rental</span> to view on-chain details</p>
                                </div>

                                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "12px" }}>
                                    <span style={{ minWidth: "26px", height: "26px", borderRadius: "50%", background: "#f43f5e", color: "white", fontSize: "12px", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center" }}>4</span>
                                    <p style={{ color: "#d1d5db", fontSize: "14px", margin: 0 }}>After duration expires, click <span style={{ color: "#fb7185", fontWeight: "600" }}>End Rental</span></p>
                                </div>

                            </div>
                        </div>

                        <div style={{ borderLeft: "4px solid #eab308", paddingLeft: "16px" }}>
                            <ListNFT caller={walletAddress} />
                        </div>

                        <div style={{ borderLeft: "4px solid #10b981", paddingLeft: "16px" }}>
                            <RentNFT caller={walletAddress} />
                        </div>

                        <div style={{ borderLeft: "4px solid #0ea5e9", paddingLeft: "16px" }}>
                            <ViewRental caller={walletAddress} />
                        </div>

                        <div style={{ borderLeft: "4px solid #f43f5e", paddingLeft: "16px" }}>
                            <EndRental caller={walletAddress} />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}