import {
  Contract,
  TransactionBuilder,
  Networks,
  BASE_FEE,
  nativeToScVal,
  scValToNative,
  rpc as StellarRpc,
} from "@stellar/stellar-sdk";

import { userSignTransaction } from "./Freighter";

const RPC_URL = "https://soroban-testnet.stellar.org:443";
const NETWORK = Networks.TESTNET;
const CONTRACT_ADDRESS = "CDZOUG6HT2NWSCE6VACZMGLKQ6VL577VSOKSKAYMZ3PFVZYO2JRWQ7K4";

const server = new StellarRpc.Server(RPC_URL);

const TX_PARAMS = {
  fee: BASE_FEE,
  networkPassphrase: NETWORK,
};

const addressToScVal = (addressStr) =>
  nativeToScVal(addressStr, { type: "address" });

const numberToU64 = (value) =>
  nativeToScVal(Number(value), { type: "u64" });

function buildTx(sourceAccount, fnName, values) {
  const contract = new Contract(CONTRACT_ADDRESS);
  const builder = new TransactionBuilder(sourceAccount, TX_PARAMS);
  if (Array.isArray(values) && values.length > 0) {
    builder.addOperation(contract.call(fnName, ...values));
  } else if (values !== null && values !== undefined) {
    builder.addOperation(contract.call(fnName, values));
  } else {
    builder.addOperation(contract.call(fnName));
  }
  return builder.setTimeout(30).build();
}

async function pollTransaction(hash) {
  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    console.log("Poll " + (i + 1) + " for hash:", hash);

    try {
      const response = await fetch(RPC_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "getTransaction",
          params: { hash },
        }),
      });

      const data = await response.json();
      const result = data.result;
      console.log("Poll " + (i + 1) + " status:", result?.status);

      if (result?.status === "SUCCESS") {
        console.log("Transaction SUCCESS");
        return { status: "SUCCESS", returnValue: result.returnValue || null };
      }

      if (result?.status === "FAILED") {
        throw new Error("Transaction FAILED on-chain");
      }

    } catch (e) {
      if (e.message === "Transaction FAILED on-chain") throw e;
      console.log("Poll error (retrying):", e.message);
    }
  }

  throw new Error("Transaction timed out after 60s");
}

const VOID_FUNCTIONS = ["list_nft", "rent_nft", "end_rental"];

async function contractInt(caller, fnName, values) {
  console.log("contractInt:", fnName);

  const sourceAccount = await server.getAccount(caller);
  const tx = buildTx(sourceAccount, fnName, values);

  let preparedTx;
  try {
    preparedTx = await server.prepareTransaction(tx);
  } catch (e) {
    throw new Error("Simulation failed: " + e.message);
  }

  const xdrTx = preparedTx.toXDR();

  let signed;
  try {
    signed = await userSignTransaction(xdrTx, caller);
  } catch (e) {
    throw new Error("Signing failed: " + e.message);
  }

  let signedTx;
  try {
    signedTx = TransactionBuilder.fromXDR(signed.signedTxXdr, NETWORK);
  } catch (e) {
    throw new Error("fromXDR failed: " + e.message);
  }

  const send = await server.sendTransaction(signedTx);
  console.log("Submitted:", send.status, send.hash);

  if (send.status === "ERROR") {
    const errName = send.errorResult?._attributes?.result?._switch?.name;
    if (errName === "txTooLate") {
      throw new Error("Transaction expired. Wait 10s and try again.");
    }
    throw new Error("Submit error: " + JSON.stringify(send.errorResult));
  }

  const result = await pollTransaction(send.hash);

  if (result.status === "SUCCESS") {
    if (VOID_FUNCTIONS.includes(fnName)) {
      console.log("Void function success:", fnName);
      return null;
    }
    try {
      return scValToNative(result.returnValue);
    } catch (e) {
      console.log("scValToNative error:", e.message);
      return null;
    }
  }

  return null;
}

async function simulateCall(caller, fnName, values) {
  const sourceAccount = await server.getAccount(caller);
  const tx = buildTx(sourceAccount, fnName, values);

  let sim;
  try {
    sim = await server.simulateTransaction(tx);
  } catch (e) {
    throw new Error("Simulate error: " + e.message);
  }

  if (StellarRpc.Api.isSimulationError(sim)) {
    throw new Error(sim.error);
  }

  const retval = sim.result && sim.result.retval;
  if (!retval) throw new Error("No return value from simulation");

  return scValToNative(retval);
}

const listNft = async (caller, price, duration) => {
  const values = [
    addressToScVal(caller),
    numberToU64(price),
    numberToU64(duration),
  ];
  return await contractInt(caller, "list_nft", values);
};

const rentNft = async (caller) => {
  return await contractInt(caller, "rent_nft", addressToScVal(caller));
};

const endRental = async (caller) => {
  return await contractInt(caller, "end_rental", null);
};

const viewRental = async (caller) => {
  return await simulateCall(caller, "view_rental", null);
};

export { listNft, rentNft, endRental, viewRental };