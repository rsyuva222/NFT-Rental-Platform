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
            setStatus("❌ Error: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#12121a] border border-gray-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-xl font-bold text-emerald-400">Rent NFT</h2>
            <p className="text-yellow-300 text-sm bg-yellow-900 bg-opacity-30 border border-yellow-800 rounded-xl px-4 py-2">
                ⚠️ Only click AFTER List NFT shows ✅ success.
            </p>
            <button
                onClick={handleRent}
                disabled={loading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition disabled:opacity-50"
            >
                {loading ? "Processing... (~15s)" : "Rent Now"}
            </button>
            {status && (
                <p className={`text-sm ${status.startsWith("✅") ? "text-emerald-400" : status.startsWith("❌") ? "text-red-400" : "text-gray-400"}`}>
                    {status}
                </p>
            )}
        </div>
    );
}