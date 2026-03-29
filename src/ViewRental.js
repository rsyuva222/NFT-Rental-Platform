import React, { useState } from "react";
import { readContract } from "./Soroban";

export default function ViewRental({ walletAddress }) {
    const [data, setData] = useState(null);

    const handleView = async () => {
        try {
            const result = await readContract("view_rental", [1], walletAddress);
            setData(result);
            console.log("Rental Data:", result);
        } catch (e) {
            alert("View Error: " + e.message);
        }
    };

    return (
        <div style={{ marginTop: "20px" }}>
            <button onClick={handleView} disabled={!walletAddress} style={btnStyle("#6c757d")}>
                View Rental Status
            </button>
            {data && <div style={{ marginTop: "10px", padding: "10px", border: "1px solid #ccc" }}>
                Status: {data.is_rented ? "Rented" : "Available"}
            </div>}
        </div>
    );
}

const btnStyle = (bg) => ({ backgroundColor: bg, color: "white", padding: "12px", borderRadius: "8px", width: "250px", margin: "5px", cursor: "pointer", border: "none" });