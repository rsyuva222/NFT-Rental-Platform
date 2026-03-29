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

function parseReturnValue(returnValue) {
  if (!returnValue) return null;
  try {
    const b64 = returnValue.toXDR("base64");
    if (b64 === "AAAAAA==") {
      console.log("Return is void");
      return null;
    }
    const parsed = scValToNative(returnValue);
    console.log("Parsed:", parsed);
    return parsed;
  } catch (e) {
    console.log("parseReturnValue treating as void:", e.message);
    return null;
  }
}

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
    throw new Error("Submit error: " + JSON.stringify(send.errorResult));
  }

  await new Promise((r) => setTimeout(r, 3000));

  for (let i = 0; i < 30; i++) {
    const res = await server.getTransaction(send.hash);
    console.log("Poll " + (i + 1) + ": " + res.status);

    if (res.status === "SUCCESS") {
      console.log("SUCCESS! returnValue b64:", res.returnValue && res.returnValue.toXDR("base64"));
      return parseReturnValue(res.returnValue);
    }

    if (res.status === "FAILED") {
      throw new Error("Transaction FAILED: " + JSON.stringify(res));
    }

    await new Promise((r) => setTimeout(r, 2000));
  }

  throw new Error("Transaction timed out after 60s");
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
  if (!retval) {
    throw new Error("No return value from simulation");
  }

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
