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
        <button
            onClick={handleConnect}
            disabled={loading}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition disabled:opacity-50"
        >
            {loading ? "Connecting..." : "Connect Freighter Wallet"}
            {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
        </button>
    );
}