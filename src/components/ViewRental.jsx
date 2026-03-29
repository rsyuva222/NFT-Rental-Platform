import { useState } from "react";
import { viewRental } from "./Soroban";

export default function ViewRental({ caller }) {
    const [rental, setRental] = useState(null);
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);

    const handleView = async () => {
        setLoading(true);
        setStatus("Fetching rental details...");
        setRental(null);
        try {
            const data = await viewRental(caller);
            setRental(data);
            setStatus("");
        } catch (e) {
            setStatus(`❌ Error: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-xl font-bold text-white">View Rental Details</h2>
            <button
                onClick={handleView}
                disabled={loading}
                className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl transition disabled:opacity-50"
            >
                {loading ? "Fetching..." : "Fetch Rental"}
            </button>
            {status && <p className="text-sm text-gray-300">{status}</p>}
            {rental && (
                <div className="mt-4 space-y-2 text-sm text-gray-300 bg-gray-700 rounded-xl p-4">
                    <p><span className="text-white font-semibold">Owner:</span> {rental.owner}</p>
                    <p><span className="text-white font-semibold">Renter:</span> {rental.renter}</p>
                    <p><span className="text-white font-semibold">Price:</span> {rental.price.toString()} stroops</p>
                    <p><span className="text-white font-semibold">Duration:</span> {rental.duration.toString()}s</p>
                    <p><span className="text-white font-semibold">Start Time:</span> {rental.start_time.toString()}</p>
                    <p>
                        <span className="text-white font-semibold">Status:</span>{" "}
                        <span className={rental.is_rented ? "text-emerald-400" : "text-gray-400"}>
                            {rental.is_rented ? "Currently Rented" : "Available"}
                        </span>
                    </p>
                </div>
            )}
        </div>
    );
}