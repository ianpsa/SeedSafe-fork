export const NERO_CHAIN_CONFIG = {
    chainId: 689,
    rpcUrl: "https://rpc-testnet.nerochain.io",
    chainName: "NERO Testnet",
    explorer: "https://testnet.neroscan.io",
    currency: "NERO",
  };
  
  export const CONTRACT_ADDRESSES = {
    entryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
    accountFactory: "0x9406Cc6185a346906296840746125a0E44976454",
  };
  
  export const AA_PLATFORM_CONFIG = {
    bundlerRpc: "https://bundler.service.nerochain.io",
    paymasterRpc: "https://paymaster-testnet.nerochain.io",
    apiKey: import.meta.env.VITE_PAYMASTER_API_KEY, // Vite-style .env
  };
  