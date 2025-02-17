import { publicClient } from '@/shared/config/wagmi.config';
import { Address, encodeAbiParameters, encodeFunctionData, parseEther, parseUnits } from 'viem';
import { DsProxy } from '../ds-proxy/ds-proxy';

import {ContractAddresses} from '@/shared/constants/contracts/addresses'
import gmxShort from '@/shared/constants/contracts/abi/gmx-short.json'
import { approve } from '@/shared/lib/approve';
import { toast } from 'react-toastify';

export const READER_ADDRESS = "0x0537C767cDAC0726c76Bb89e92904fe28fd02fE1";

export const GMX_READER_ABI = [
  {
    inputs: [
      {
        internalType: "contract DataStore",
        name: "dataStore",
        type: "address",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "start",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "end",
        type: "uint256",
      },
    ],
    name: "getAccountPositions",
    outputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
              {
                internalType: "address",
                name: "market",
                type: "address",
              },
              {
                internalType: "address",
                name: "collateralToken",
                type: "address",
              },
            ],
            internalType: "struct Position.Addresses",
            name: "addresses",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "sizeInUsd",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "sizeInTokens",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "collateralAmount",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "borrowingFactor",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "fundingFeeAmountPerSize",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "longTokenClaimableFundingAmountPerSize",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "shortTokenClaimableFundingAmountPerSize",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "increasedAtTime",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "decreasedAtTime",
                type: "uint256",
              },
            ],
            internalType: "struct Position.Numbers",
            name: "numbers",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "bool",
                name: "isLong",
                type: "bool",
              },
            ],
            internalType: "struct Position.Flags",
            name: "flags",
            type: "tuple",
          },
        ],
        internalType: "struct Position.Props[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];


export const DATA_STORE_ADDRESS = "0xFD70de6b91282D8017aA4E741e9Ae325CAb992d8";

export const gmxContract = {
  async readPositon(dsProxyAddress: Address) {
    const readResult = await publicClient.readContract({
      address: READER_ADDRESS as `0x${string}`,
      abi: GMX_READER_ABI,
      functionName: "getAccountPositions",
      args: [DATA_STORE_ADDRESS, dsProxyAddress, 0n, 100n],
    });

    return readResult as any[];
  },

  async createShort({
    amount,
    account,
    dsProxyAddress,
  }: {
    amount: bigint,
    dsProxyAddress: Address,
    account: Address
  }) {
    const value = parseEther("0.0005");

    const depositCallData = encodeAbiParameters(
      [
        { name: "user", type: "address" },
        { name: "market", type: "address" },
        { name: "sizeDeltaUsd", type: "uint256" },
        { name: "collateralAmount", type: "uint256" },
        { name: "exchangeRouter", type: "address" },
        { name: "reader", type: "address" },
        { name: "USDC", type: "address" },
        { name: "orderVaultAddress", type: "address" },
        { name: "dataStoreAddress", type: "address" },
        { name: "routerAddress", type: "address" },
      ],
      [
        account,
        ContractAddresses.GMX_MARKET,
        parseUnits("3", 30),
        amount,
        ContractAddresses.GMX_EXCHANGE_ROUTER,
        ContractAddresses.GMX_READER,
        ContractAddresses.USDC,
        ContractAddresses.GMX_ORDER_VAULT,
        ContractAddresses.GMX_DATA_STORE,
        ContractAddresses.GMX_ROUTER,
      ],
    );
  
    const executeData = encodeFunctionData({
      abi: gmxShort.abi,
      functionName: "createShort",
      args: [depositCallData],
    });
  
    const status = await DsProxy.execute({
      address: account,
      dsProxyAddress,
      executeContract: gmxShort.address as Address,
      executeData,
      value,
    })

    if (status === 'success') {
      toast.success("Short is opened", {
        position: 'top-left',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
    } else {
      toast.error("Short is error", {
        position: 'top-left',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
    }
  },

  async withdrawShort({dsProxyAddress, address}: {
    dsProxyAddress: Address
    address: Address,
  }) {
    const withdrawCallData = encodeAbiParameters(
      [
        { name: 'user', type: 'address' },
        { name: 'exchangeRouter', type: 'address' },
        { name: 'reader', type: 'address' },
        { name: 'USDC', type: 'address' },
        { name: 'orderVaultAddress', type: 'address' },
        { name: 'dataStoreAddress', type: 'address' },
        { name: 'routerAddress', type: 'address' },
      ],
      [address, ContractAddresses.GMX_EXCHANGE_ROUTER, READER_ADDRESS, ContractAddresses.USDC, ContractAddresses.GMX_ORDER_VAULT, DATA_STORE_ADDRESS, ContractAddresses.GMX_ROUTER],
    );

    const encodedData = encodeFunctionData({
      abi: gmxShort.abi,
      functionName: 'withdrawShort',
      args: [withdrawCallData],
    });


    try {
      await DsProxy.execute({
        address,
        dsProxyAddress,
        executeContract: gmxShort.address as Address,
        executeData: encodedData,
        value: parseEther('0.0005'),
        //@ts-ignore
        account: address as Address,
      })
  
      toast.success("Short is opened", {
        position: 'top-left',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
    } catch (error) {
      toast.error("Short is error", {
        position: 'top-left',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
    }
  },
}