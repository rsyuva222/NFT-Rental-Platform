// src/components/ListNFT.jsx
import { useState } from "react";
import { listNft } from "./Soroban";

export default function ListNFT({ caller }) {
    const [price, setPrice] = useState("");
    const [duration, setDuration] = useState("");
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);

    const handleList = async () => {
        if (!price || !duration) return setStatus("⚠️ Fill in both fields.");
        setLoading(true);
        setStatus("⏳ Listing NFT... Approve in Freighter.");
        try {
            await listNft(caller, Number(price), Number(duration));
            setStatus("⏳ Transaction submitted! Waiting for confirmation (~10s)...");
        } catch (e) {
            setStatus(`❌ Error: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-xl font-bold text-white">List NFT for Rent</h2>
            <p className="text-gray-400 text-sm">
                ⚠️ You must list the NFT first before renting or viewing.
            </p>
            <input
                type="number"
                placeholder="Price (in stroops)"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 outline-none"
            />
            <input
                type="number"
                placeholder="Duration (in seconds, e.g. 3600 = 1hr)"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 outline-none"
            />
            <button
                onClick={handleList}
                disabled={loading}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition disabled:opacity-50"
            >
                {loading ? "Processing..." : "List NFT"}
            </button>
            {status && <p className="text-sm text-gray-300 mt-1">{status}</p>}
        </div>
    );
}