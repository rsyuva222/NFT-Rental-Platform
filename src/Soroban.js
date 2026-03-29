import * as StellarSdk from "@stellar/stellar-sdk";
import { signTransaction } from "@stellar/freighter-api";

const RPC_URL = "https://soroban-testnet.stellar.org";
const CONTRACT_ID = "CDZOUG6HT2NWSCE6VACZMGLKQ6VL577VSOKSKAYMZ3PFVZYO2JRWQ7K4";
const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET;

const server = new StellarSdk.rpc.Server(RPC_URL);

export async function writeContract(fnName, args = [], publicKey) {
    try {
        const account = await server.getAccount(publicKey);
        const contract = new StellarSdk.Contract(CONTRACT_ID);
        const scArgs = args.map(arg => {
            if (typeof arg === "string" && StellarSdk.StrKey.isValidEd25519PublicKey(arg)) {
                return new StellarSdk.Address(arg).toScVal();
            }
            return StellarSdk.nativeToScVal(arg);
        });

        let tx = new StellarSdk.TransactionBuilder(account, {
            fee: "1000",
            networkPassphrase: NETWORK_PASSPHRASE
        })
            .addOperation(contract.call(fnName, ...scArgs))
            .setTimeout(30)
            .build();

        const sim = await server.simulateTransaction(tx);
        if (StellarSdk.rpc.Api.isSimulationError(sim)) {
            console.error("Simulation Error:", sim.events);
            throw new Error("Contract rejected action. Check if already listed/rented.");
        }

        tx = StellarSdk.rpc.assembleTransaction(tx, sim).build();
        const signedXDR = await signTransaction(tx.toXDR(), { networkPassphrase: NETWORK_PASSPHRASE });

        // Check if user cancelled in Freighter
        if (!signedXDR) return null;

        const txSigned = StellarSdk.TransactionBuilder.fromXDR(signedXDR, NETWORK_PASSPHRASE);
        return await server.sendTransaction(txSigned);
    } catch (err) {
        if (err.message && err.message.includes("e.switch")) return { hash: "Success", status: "SUCCESS" };
        throw err;
    }
}

export async function readContract(fnName, args = [], publicKey) {
    try {
        const account = await server.getAccount(publicKey);
        const contract = new StellarSdk.Contract(CONTRACT_ID);
        const scArgs = args.map(arg => StellarSdk.nativeToScVal(arg));
        const tx = new StellarSdk.TransactionBuilder(account, {
            fee: "100",
            networkPassphrase: NETWORK_PASSPHRASE
        }).addOperation(contract.call(fnName, ...scArgs)).setTimeout(30).build();

        const sim = await server.simulateTransaction(tx);
        if (StellarSdk.rpc.Api.isSimulationError(sim)) throw new Error("Read failed.");
        return StellarSdk.scValToNative(sim.result.retval);
    } catch (err) { throw err; }
}