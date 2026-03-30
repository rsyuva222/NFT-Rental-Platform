import { useState } from "react";
import { connectWallet } from "./Freighter";

export default function ConnectWallet({ onConnect }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleConnect = async () => {
        setLoading(true);
        setError("");
        try {
            const pubKey = await connectWallet();
            onConnect(pubKey);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="text-center space-y-4">
            <button
                onClick={handleConnect}
                disabled={loading}
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all duration-200 disabled:opacity-50 text-lg shadow-lg shadow-indigo-900"
            >
                {loading ? "Connecting..." : "Connect Freighter Wallet"}
            </button>
            {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>
    );
}