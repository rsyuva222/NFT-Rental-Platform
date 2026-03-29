import React, { useState } from "react";
import { writeContract } from "./Soroban";

export default function RentNFT({ walletAddress }) {
    const [loading, setLoading] = useState(false);

    const handleRent = async () => {
        setLoading(true);
        try {
            const result = await writeContract("rent_nft", [2], walletAddress);
            console.log("Rent Result:", result);
            if (result && result.hash) alert("NFT Rented!");

        } catch (e) {
            alert("Rent Error: Switch to a DIFFERENT wallet account to rent!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button onClick={handleRent} disabled={loading || !walletAddress} style={btnStyle("#28a745")}>
            {loading ? "Processing..." : "Rent NFT"}
        </button>
    );
}

const btnStyle = (bg) => ({ backgroundColor: bg, color: "white", padding: "12px", borderRadius: "8px", width: "250px", margin: "5px", cursor: "pointer", border: "none" });