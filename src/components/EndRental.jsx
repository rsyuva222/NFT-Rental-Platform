import { useState } from "react";
import { endRental } from "./Soroban";

export default function EndRental({ caller }) {
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);

    const handleEnd = async () => {
        setLoading(true);
        setStatus("⏳ Ending rental... Approve in Freighter.");
        try {
            await endRental(caller);
            setStatus("✅ Rental ended. NFT returned to owner.");
        } catch (e) {
            setStatus("❌ Error: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#12121a] border border-gray-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-xl font-bold text-rose-400">End Rental</h2>
            <p className="text-gray-500 text-sm">Only callable after the rental duration has expired.</p>
            <button
                onClick={handleEnd}
                disabled={loading}
                className="w-full py-3 bg-rose-700 hover:bg-rose-600 text-white font-bold rounded-xl transition disabled:opacity-50"
            >
                {loading ? "Processing... (~15s)" : "End Rental"}
            </button>
            {status && (
                <p className={`text-sm ${status.startsWith("✅") ? "text-emerald-400" : status.startsWith("❌") ? "text-red-400" : "text-gray-400"}`}>
                    {status}
                </p>
            )}
        </div>
    );
}