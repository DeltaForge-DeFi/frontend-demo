import { publicClient } from "@/shared/config/wagmi.config";
import { ContractAddresses } from "@/shared/constants/contracts/addresses";
import { approve } from "@/shared/lib/approve";
import { Address, encodeAbiParameters, encodeFunctionData, parseUnits } from "viem";
import { DsProxy } from "../ds-proxy/ds-proxy";


export const AAVE_OPEN_LOOPING_CONTRACT =
  "0xfC0116CC89C50496De9566c732498444670402a7";

export const AAVE_OPEN_LOOPING_ABI = [
  {
    inputs: [],
    name: "NonContractCall",
    type: "error",
  },
  {
    inputs: [],
    name: "ReturnIndexValueError",
    type: "error",
  },
  {
    inputs: [],
    name: "SenderNotAdmin",
    type: "error",
  },
  {
    inputs: [],
    name: "SenderNotOwner",
    type: "error",
  },
  {
    inputs: [],
    name: "SubIndexValueError",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "string",
        name: "logName",
        type: "string",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "ActionEvent",
    type: "event",
  },
  {
    inputs: [],
    name: "AAVE_REFERRAL_CODE",
    outputs: [
      {
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "NO_PARAM_MAPPING",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "RETURN_MAX_INDEX_VALUE",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "RETURN_MIN_INDEX_VALUE",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "SUB_MAX_INDEX_VALUE",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "SUB_MIN_INDEX_VALUE",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "actionType",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "adminData",
    outputs: [
      {
        internalType: "contract AdminData",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "_callData",
        type: "bytes",
      },
      {
        internalType: "bytes32[]",
        name: "_subdata",
        type: "bytes32[]",
      },
      {
        internalType: "uint8[]",
        name: "_paramMapping",
        type: "uint8[]",
      },
      {
        internalType: "bytes32[]",
        name: "_returnValues",
        type: "bytes32[]",
      },
    ],
    name: "executeAction",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "_callData",
        type: "bytes",
      },
    ],
    name: "executeActionDirect",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_proxy",
        type: "address",
      },
    ],
    name: "isDSProxy",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "kill",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "logger",
    outputs: [
      {
        internalType: "contract DefisaverLogger",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "registry",
    outputs: [
      {
        internalType: "contract DFSRegistry",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
      {
        internalType: "address",
        name: "_receiver",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "withdrawStuckFunds",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];


export const AAVE_DATA_PROVIDER_ADDRESS =
  "0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb" as Address;
export const AAVE_DATA_PROVIDER_ABI = [
  {
    type: "function",
    name: "getPool",
    constant: false,
    anonymous: false,
    stateMutability: "view",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        storage_location: "default",
        offset: 0,
        index:
          "0x0000000000000000000000000000000000000000000000000000000000000000",
        indexed: false,
        simple_type: { type: "address" },
      },
    ],
  },
];

export const AAVE_POOL_ABI = [
  {
    type: "function",
    name: "getUserAccountData",
    inputs: [
      {
        name: "user",
        type: "address",
      },
    ],
    outputs: [
      {
        name: "totalCollateralBase",
        type: "uint256",
      },
      {
        name: "totalDebtBase",
        type: "uint256",
      },
      {
        name: "availableBorrowsBase",
        type: "uint256",
      },
      {
        name: "currentLiquidationThreshold",
        type: "uint256",
      },
      {
        name: "ltv",
        type: "uint256",
      },
      {
        name: "healthFactor",
        type: "uint256",
      },
    ],
    stateMutability: "view",
  },
];


export const AAVE_CLOSE_LOOPING_ADDRESS =
  "0x5A86dC64ee2499f7d3a99d270082a9fb43a08326";

export const AAVE_CLOSE_LOOPING_ABI = [
  {
    inputs: [
      {
        internalType: "bytes",
        name: "_callData",
        type: "bytes",
      },
    ],
    name: "executeActionDirect",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];

export const aaveContract = {
  async readPositon(dsProxyAddress: Address) {
    const pool = (await publicClient.readContract({
      address: AAVE_DATA_PROVIDER_ADDRESS,
      abi: AAVE_DATA_PROVIDER_ABI,
      functionName: "getPool",
    })) as unknown as Address;

    const POOL_ADDRESS = pool as Address;

    const [
      totalCollateralBase,
      totalDebtBase,
      availableBorrowsBase,
      currentLiquidationThreshold,
      ltv,
      healthFactor,
    ] = (await publicClient.readContract({
      address: POOL_ADDRESS,
      abi: AAVE_POOL_ABI,
      functionName: "getUserAccountData",
      args: [dsProxyAddress],
    })) as any;


    return {
      totalCollateralBase,
      totalDebtBase,
      availableBorrowsBase,
      currentLiquidationThreshold,
      ltv,
      healthFactor,
    }
  },


  async openLoooping({ dsProxyAddress, account }: { dsProxyAddress: Address, account: Address }) {
    const initialAmount = parseUnits("1", 6);

    // await approve(account, ContractAddresses.USDC, dsProxyAddress, initialAmount);

    const callData = encodeAbiParameters(
      [
        { name: "initialSupplyAmount", type: "uint256" },
        { name: "borrowPercent", type: "uint256" },
        { name: "cycles", type: "uint8" },
      ],
      [
        initialAmount,
        BigInt(59), //60% от депозита
        2,
      ],
    );

    const executeData = encodeFunctionData({
      abi: AAVE_OPEN_LOOPING_ABI,
      functionName: "executeActionDirect",
      args: [callData],
    });

    await DsProxy.execute({
      address: account as any,
      dsProxyAddress,
      executeContract: AAVE_OPEN_LOOPING_CONTRACT,
      executeData,
    })
  },

  async closeLoooping({ dsProxyAddress, account }: { dsProxyAddress: Address, account: Address }) {

    const DEFAULT_AAVE_MARKET =
      "0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb" as Address;
    const MaxUint256 = BigInt(
      "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
    );

    const params = {
      assetId: 0,
      useDefaultMarket: true,
      amount: MaxUint256,
      to: account,
      market: DEFAULT_AAVE_MARKET,
    };

    const parameters = {
      functionName: "executeActionDirect",
      abi: AAVE_CLOSE_LOOPING_ABI,
      args: [
        encodeAbiParameters(
          [
            { name: "assetId", type: "uint16" },
            { name: "useDefaultMarket", type: "bool" },
            { name: "amount", type: "uint256" },
            { name: "to", type: "address" },
            { name: "market", type: "address" },
          ],
          [
            params.assetId,
            params.useDefaultMarket,
            params.amount,
            params.to,
            params.market,
          ],
        ),
      ],
    };

    const executeData = encodeFunctionData(parameters);

    const status = await DsProxy.execute({
      address: account as any,
      dsProxyAddress,
      executeContract: AAVE_CLOSE_LOOPING_ADDRESS as Address,
      executeData,
    })

    if (status ===  'reverted') { /* empty */ }
  }
}