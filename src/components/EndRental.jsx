import { useState } from "react";
import { endRental } from "./Soroban";

export default function EndRental({ caller }) {
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);

    const handleEnd = async () => {
        setLoading(true);
        setStatus("Ending rental...");
        try {
            await endRental(caller);
            setStatus("✅ Rental ended. NFT returned to owner.");
        } catch (e) {
            setStatus(`❌ Error: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-xl font-bold text-white">End Rental</h2>
            <p className="text-gray-400 text-sm">Only callable after rental period expires.</p>
            <button
                onClick={handleEnd}
                disabled={loading}
                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl transition disabled:opacity-50"
            >
                {loading ? "Processing..." : "End Rental"}
            </button>
            {status && <p className="text-sm text-gray-300">{status}</p>}
        </div>
    );
}