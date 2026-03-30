import { useState } from "react";
import { listNft } from "./Soroban";

export default function ListNFT({ caller }) {
    const [price, setPrice] = useState("");
    const [duration, setDuration] = useState("");
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);

    const handleList = async () => {
        if (!price || !duration) return setStatus("⚠️ Fill in both fields.");
        if (Number(price) <= 0 || Number(duration) <= 0)
            return setStatus("⚠️ Values must be greater than 0.");
        setLoading(true);
        setStatus("⏳ Listing NFT... Approve in Freighter.");
        try {
            await listNft(caller, Number(price), Number(duration));
            setStatus("✅ NFT listed successfully! Now click Rent Now.");
        } catch (e) {
            setStatus("❌ Error: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#12121a] border border-gray-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-xl font-bold text-yellow-400">List NFT for Rent</h2>
            <input
                type="number"
                placeholder="Price (in stroops)"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-[#1a1a2e] border border-gray-700 text-white rounded-xl px-4 py-3 outline-none focus:border-yellow-500 transition"
            />
            <input
                type="number"
                placeholder="Duration (in seconds)"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-[#1a1a2e] border border-gray-700 text-white rounded-xl px-4 py-3 outline-none focus:border-yellow-500 transition"
            />
            <button
                onClick={handleList}
                disabled={loading}
                className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition disabled:opacity-50"
            >
                {loading ? "Processing... (~15s)" : "List NFT"}
            </button>
            {status && (
                <p className={`text-sm ${status.startsWith("✅") ? "text-emerald-400" : status.startsWith("❌") ? "text-red-400" : "text-gray-400"}`}>
                    {status}
                </p>
            )}
        </div>
    );
}