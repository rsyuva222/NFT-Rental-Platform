import {
    signTransaction,
    setAllowed,
    getAddress,
    requestAccess,
    isConnected
} from "@stellar/freighter-api";
import * as StellarSdk from "@stellar/stellar-sdk";

const server = new StellarSdk.Horizon.Server(
    "https://horizon-testnet.stellar.org"
);

// ✅ Check if Freighter exists
const checkConnection = async () => {
    const connected = await isConnected();
    if (!connected) {
        throw new Error("Freighter not installed");
    }
    return true;
};

// ✅ Request access safely
const getRequestAccess = async () => {
    try {
        return await requestAccess();
    } catch (err) {
        console.error("Access denied:", err);
        throw err;
    }
};

// ✅ Get public key safely
const retrievePublicKey = async () => {
    try {
        const { address } = await getAddress();
        return address;
    } catch (err) {
        console.error("Error getting address:", err);
        throw err;
    }
};

// ✅ Get balance safely
const getBalance = async () => {
    try {
        await checkConnection();

        const { address } = await getAddress();
        const account = await server.loadAccount(address);

        const xlm = account.balances.find(
            (b) => b.asset_type === "native"
        );

        return xlm?.balance || "0";
    } catch (err) {
        console.error("Balance error:", err);
        return "0";
    }
};

// ✅ Sign transaction safely
const userSignTransaction = async (xdr, signWith) => {
    try {
        return await signTransaction(xdr, {
            networkPassphrase: StellarSdk.Networks.TESTNET,
            accountToSign: signWith,
        });
    } catch (err) {
        console.error("Signing failed:", err);
        throw err;
    }
};
const connectWallet = async () => {
    await checkConnection();
    await getRequestAccess();
    return await retrievePublicKey();
};
export {
    checkConnection,
    retrievePublicKey,
    getBalance,
    userSignTransaction,
    getRequestAccess,
    connectWallet,
};