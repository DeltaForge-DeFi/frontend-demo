import { publicClient, walletClient } from "@/shared/config/wagmi.config";
import { Account, Address } from "viem";

import DsProxyFactory from '@/shared/constants/contracts/abi/ds-proxy-factory.json'
import DsProxyJson from '@/shared/constants/contracts/abi/ds-proxy.abi.json'
import { toast } from "react-toastify";

// async function dsProxyExecute({
//     address,
//     dsProxyAddress,
//     executeContract,
//     executeData,
//     value = 0n,
//   }: {
//     address: Address;
//     executeContract: Address;
//     dsProxyAddress: Address;
//     executeData: Address;
//     value: bigint;
//   }) {
//     const hash = await walletClient.writeContract({
//       address: dsProxyAddress as `0x${string}`,
//       abi: dsProxyJson.abi,
//       functionName: 'execute',
//       args: [executeContract, executeData],
//       account: address as `0x${string}`,
//       value,
//       gas: 2000000n, // Added gas limit of 1 million units gas: 8000000n,
//     });

//     await publicClient.waitForTransactionReceipt({ hash });
//   }

export const DsProxy = {
    async read(address: string) {
        const data = await publicClient.readContract({
            address: DsProxyFactory.adress as Address,
            abi: DsProxyFactory.abi,
            functionName: 'getProxyByOwner',
            args: [address],
        });

        return data;
    },

    async build(address: Account) {
        const data = await walletClient.writeContract({
            address: DsProxyFactory.adress as Address,
            abi: DsProxyFactory.abi,
            functionName: 'build',
            account: address,
        })

        return data;
    },

    async execute({ value = 0n, dsProxyAddress, executeContract, executeData, address }: {
        dsProxyAddress: Address,
        executeContract: Address,
        executeData: Address,
        address: Address,
        value?: bigint,
    }) {
        const hash = await walletClient.writeContract({
            address: dsProxyAddress as `0x${string}`,
            abi: DsProxyJson,
            functionName: 'execute',
            args: [executeContract, executeData],
            account: address as `0x${string}`,
            value,
            gas: 2000000n, // Added gas limit of 1 million units gas: 8000000n,
        });

        console.log('DS proxy', hash)
        const result = await publicClient.waitForTransactionReceipt({ hash });
        //result.status = reverted
        console.log('result', result)
    },
}