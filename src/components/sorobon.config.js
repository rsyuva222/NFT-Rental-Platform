import {
    Networks,
    BASE_FEE,
    rpc as StellarRpc,
} from "@stellar/stellar-sdk";

export const RPC_URL = "https://soroban-testnet.stellar.org:443";
export const NETWORK = Networks.TESTNET;
export const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS_HERE";

export const server = new StellarRpc.Server(RPC_URL);

export const TX_PARAMS = {
    fee: BASE_FEE,
    networkPassphrase: NETWORK,
};