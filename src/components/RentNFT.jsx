import { useState } from "react";
import { rentNft } from "./Soroban";

export default function RentNFT({ caller }) {
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRent = async () => {
        setLoading(true);
        setStatus("⏳ Renting NFT... Approve in Freighter.");
        try {
            await rentNft(caller);
            setStatus("✅ NFT rented successfully!");
        } catch (e) {
            setStatus(`❌ Error: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-xl font-bold text-white">Rent NFT</h2>
            <p className="text-gray-400 text-sm">Your address will be set as the renter.</p>
            <button
                onClick={handleRent}
                disabled={loading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition disabled:opacity-50"
            >
                {loading ? "Processing..." : "Rent Now"}
            </button>
            {status && <p className="text-sm text-gray-300">{status}</p>}
        </div>
    );
}