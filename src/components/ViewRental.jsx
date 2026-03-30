import { useState } from "react";
import { viewRental } from "./Soroban";

export default function ViewRental({ caller }) {
    const [rental, setRental] = useState(null);
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);

    const handleView = async () => {
        setLoading(true);
        setStatus("⏳ Fetching...");
        setRental(null);
        try {
            const data = await viewRental(caller);
            setRental(data);
            setStatus("");
        } catch (e) {
            setStatus("❌ Error: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (t) => {
        const n = Number(t);
        if (!n || n === 0) return "Not started";
        return new Date(n * 1000).toLocaleString();
    };

    const isRented = rental && rental.is_rented === true;
    const sameWallet = rental && rental.owner?.toString() === rental.renter?.toString();

    return (
        <div className="bg-[#12121a] border border-gray-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-xl font-bold text-sky-400">View Rental Details</h2>
            <button
                onClick={handleView}
                disabled={loading}
                className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl transition disabled:opacity-50"
            >
                {loading ? "Fetching..." : "Fetch Rental"}
            </button>
            {status && <p className="text-sm text-gray-400">{status}</p>}
            {rental && (
                <div className="space-y-3 bg-[#0d0d14] border border-gray-800 rounded-xl p-4 text-sm">
                    <div className="space-y-1">
                        <p className="text-gray-500 text-xs uppercase tracking-wider">Owner</p>
                        <p className="text-white font-mono text-xs break-all">{rental.owner?.toString()}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-gray-500 text-xs uppercase tracking-wider">Renter</p>
                        <p className={`font-mono text-xs break-all ${sameWallet ? "text-yellow-400" : "text-emerald-400"}`}>
                            {rental.renter?.toString()}
                        </p>

                    </div>
                    <div className="flex justify-between border-t border-gray-800 pt-3">
                        <span className="text-gray-500">Price</span>
                        <span className="text-white font-semibold">{rental.price?.toString()} stroops</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Duration</span>
                        <span className="text-white font-semibold">{rental.duration?.toString()}s</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Start Time</span>
                        <span className="text-white font-semibold">{formatTime(rental.start_time)}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-gray-800 pt-3">
                        <span className="text-gray-500">Status</span>
                        <span className={`font-bold px-3 py-1 rounded-full text-xs ${isRented ? "bg-emerald-900 text-emerald-300 border border-emerald-700" : "bg-gray-800 text-gray-400 border border-gray-700"}`}>
                            {isRented ? "🔒 Currently Rented" : "✅ Available"}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}