import React, { useState } from "react";
import { writeContract } from "./Soroban";

export default function ListNFT({ wallet }) {
    const [loading, setLoading] = useState(false);

    const handleList = async () => {
        if (!wallet) return alert("Connect Wallet!");
        setLoading(true);
        try {
            const result = await writeContract("list_nft", [wallet, 1000, 60], wallet);
            if (result && result.hash) alert("NFT Listed Successfully!");
        } catch (e) {
            alert("Error: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button onClick={handleList} disabled={loading || !wallet} style={btnStyle("#007bff")}>
            {loading ? "Processing..." : "List NFT"}
        </button>
    );
}

const btnStyle = (bg) => ({ backgroundColor: bg, color: "white", padding: "12px", borderRadius: "8px", width: "250px", margin: "5px", cursor: "pointer", border: "none" });