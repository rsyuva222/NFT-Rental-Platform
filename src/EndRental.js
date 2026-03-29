import React, { useState } from "react";
import { writeContract } from "./Soroban";

export default function EndRental({ walletAddress }) {
    const [loading, setLoading] = useState(false);

    const handleEnd = async () => {
        setLoading(true);
        try {
            const result = await writeContract("end_rental", [walletAddress, 1], walletAddress);
            if (result && result.hash) alert("Rental Ended!");
        } catch (e) {
            alert("End Error: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button onClick={handleEnd} disabled={loading || !walletAddress} style={btnStyle("#dc3545")}>
            {loading ? "Processing..." : "End Rental"}
        </button>
    );
}

const btnStyle = (bg) => ({ backgroundColor: bg, color: "white", padding: "12px", borderRadius: "8px", width: "250px", margin: "5px", cursor: "pointer", border: "none" });