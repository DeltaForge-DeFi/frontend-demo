import { useMemo } from 'react';
import { useAccount } from 'wagmi';
import { GMXContract } from '../gmx-contract';
import { GMX_CONTRACT_ADDRESS } from '@/shared/constants/contracts';

export const useGMXContract = () => {
  const { address } = useAccount();

  const contract = useMemo(() => {
    if (!address) return null;
    return new GMXContract(GMX_CONTRACT_ADDRESS);
  }, [address]);

  return contract;
};