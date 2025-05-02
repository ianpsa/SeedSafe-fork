import { Client } from "userop";
import { AA_PLATFORM_CONFIG, CONTRACT_ADDRESSES } from "../../config/neroConfig";

export const getUserOperationClient = async () => {
  return await Client.init({
    entryPoint: CONTRACT_ADDRESSES.entryPoint,
    bundlerRpc: AA_PLATFORM_CONFIG.bundlerRpc,
    overridePaymasterRpc: `${AA_PLATFORM_CONFIG.paymasterUrl}?apiKey=${AA_PLATFORM_CONFIG.apiKey}`,
  });
};
