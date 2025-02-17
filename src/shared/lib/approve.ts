import { Address } from "viem";
import { publicClient, walletClient } from "../config/wagmi.config";
import Erc20Abi from '@/shared/constants/contracts/abi/erc20.abi.json'

export const approve = async (address: Address, token: Address, spender: Address, amount: bigint) => {
    await walletClient.writeContract({
        address: token,
        abi: Erc20Abi,
        functionName: "approve",
        gas: 2000000n,
        args: [spender, amount],
        account: address
    });
  };

  export const checkAndApprove = async (address: Address, token: Address, spender: Address, amount: bigint) => {
    const currentAllowance = await publicClient.readContract({
        address: token,
        abi: Erc20Abi,
        functionName: "allowance",
        args: [address, spender],
    }) as bigint;

    if (currentAllowance < amount) {
        await approve(address, token, spender, amount);
        return true;
    }
    
    return false;
};