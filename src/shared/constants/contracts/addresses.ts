export const ContractAddresses = {
    // GMX Contracts
    READER: '0xf60becbba223EEA9495Da3f606753867eC10d139' as const,

    GMX_EXCHANGE_ROUTER: "0x900173A66dbD345006C51fA35fA3aB760FcD843b" as const,
    GMX_ROUTER: "0x7452c558d45f8afC8c83dAe62C3f8A5BE19c71f6" as const,
    GMX_READER: "0x0537C767cDAC0726c76Bb89e92904fe28fd02fE1" as const,
    GMX_ORDER_VAULT: "0x31eF83a530Fde1B38EE9A18093A333D8Bbbc40D5" as const,
    GMX_DATA_STORE: "0xFD70de6b91282D8017aA4E741e9Ae325CAb992d8" as const,
    GMX_MARKET: "0x70d95587d40A2caf56bd97485aB3Eec10Bee6336" as const,
  
    // Token Addresses
    USDC: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831' as const,
    WETH: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1' as const,
  
    // Other Contracts
    UNISWAP_SWAP: '0xD8F8c0f418d34aA9B30d29D7Eaf975E4241aa2C2' as const,
} as const;

export const TokenDecimals = {
    [ContractAddresses.USDC]: 6,
    [ContractAddresses.WETH]: 18,
} as const;