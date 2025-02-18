import { type Address, formatUnits } from 'viem';
import { publicClient } from '../config/wagmi.config';
import Erc20Abi from '@/shared/constants/contracts/abi/erc20.abi.json'
import { TokenDecimals } from '../constants/contracts/addresses';

/**
 * Checks if address has sufficient balance for the specified amount
 * @param tokenAddress Token address to check
 * @param amount Amount to check in ETH
 * @param address Wallet address to check
 * @returns Boolean indicating if balance is sufficient
 */
export async function hasEnoughBalance(
  tokenAddress: Address,
  amount: number,
  address: Address
): Promise<boolean> {
  try {
    const balance = await publicClient.readContract({
      address: tokenAddress,
      abi: Erc20Abi,
      functionName: 'balanceOf',
      args: [address],
    });

    if (!(tokenAddress in TokenDecimals)) {
      return false;
    }

    const decimals = TokenDecimals[tokenAddress as keyof typeof TokenDecimals];
    const formattedBalance = Number(formatUnits(balance as bigint, decimals));
    
    return formattedBalance >= amount;
  } catch {
    return false;
  }
}
