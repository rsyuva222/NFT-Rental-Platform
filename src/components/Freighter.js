// src/components/Freighter.js

import {
    isConnected,
    isAllowed,
    setAllowed,
    getPublicKey,
    signTransaction,
} from "@stellar/freighter-api";

/* ================= Connect Wallet ================= */
export async function connectWallet() {
    try {
        // Check if Freighter extension is installed
        const connected = await isConnected();
        console.log("Freighter isConnected:", connected);

        if (!connected) {
            throw new Error(
                "Freighter wallet not found. Please install the Freighter Chrome extension."
            );
        }

        // Check if site is allowed
        const allowed = await isAllowed();
        console.log("Freighter isAllowed:", allowed);

        if (!allowed) {
            await setAllowed();
        }

        // Get public key
        const publicKey = await getPublicKey();
        console.log("Freighter publicKey:", publicKey);

        if (!publicKey) {
            throw new Error("Could not get public key from Freighter.");
        }

        return publicKey;
    } catch (e) {
        console.error("connectWallet error:", e);
        throw e;
    }
}

/* ================= Sign Transaction ================= */
export async function userSignTransaction(xdr, caller) {
    try {
        console.log("userSignTransaction → input XDR:", xdr);
        console.log("userSignTransaction → caller:", caller);

        const result = await signTransaction(xdr, {
            networkPassphrase: "Test SDF Network ; September 2015",
            accountToSign: caller,
        });

        console.log("signTransaction raw result:", result);
        console.log("signTransaction result type:", typeof result);

        // Freighter API changed return format across versions:
        // Old versions: returns { signedTxXdr: "..." }
        // New versions: returns the XDR string directly
        if (typeof result === "string") {
            console.log("Freighter returned XDR string directly");
            return { signedTxXdr: result };
        }

        if (result && typeof result.signedTxXdr === "string") {
            console.log("Freighter returned { signedTxXdr } object");
            return result;
        }

        // Handle newer Freighter API that returns { signature, signedTxXdr }
        if (result && result.signedTxXdr) {
            return { signedTxXdr: result.signedTxXdr };
        }

        console.error("Unexpected Freighter result shape:", result);
        throw new Error(
            `Unexpected sign result from Freighter: ${JSON.stringify(result)}`
        );
    } catch (e) {
        console.error("userSignTransaction error:", e);
        throw e;
    }
}