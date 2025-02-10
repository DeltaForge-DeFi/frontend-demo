import { AAVE_DATA_PROVIDER_ADDRESS, AAVE_DATA_PROVIDER_ABI, AAVE_POOL_ABI } from '@/pages/lite/ui/closeLooping';
import { publicClient } from '@/shared/config/wagmi.config';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { useState } from 'react';
import { Address, formatUnits } from 'viem';

export const ReadLoopingPosition = () => {
  const dsProxy = localStorage.getItem('ds_proxy');
  const [address, setAddress] = useState(dsProxy || '');
  const [data, setDate] = useState({
    poolAddress: null,
    availableBorrowsBase: null,
    totalCollateralBase: null,
    healthFactor: null,
    totalDebtBase: null,
    ltv: null,
  });

  async function onClick() {
    const pool = (await publicClient.readContract({
      address: AAVE_DATA_PROVIDER_ADDRESS,
      abi: AAVE_DATA_PROVIDER_ABI,
      functionName: 'getPool',
    })) as unknown as Address;

    const POOL_ADDRESS = pool as Address;

    const [totalCollateralBaseRaw, totalDebtBaseRaw, availableBorrowsBaseRaw, currentLiquidationThreshold, ltvRaw, healthFactorRaw] =
      (await publicClient.readContract({
        address: POOL_ADDRESS,
        abi: AAVE_POOL_ABI,
        functionName: 'getUserAccountData',
        args: [address],
      })) as any;

    const totalCollateralBase = formatUnits(totalCollateralBaseRaw, 18);
    const totalDebtBase = formatUnits(totalDebtBaseRaw, 18) as any;
    const healthFactor = formatUnits(healthFactorRaw, 18);

    setDate({
      healthFactor: healthFactor as any,
      totalCollateralBase: totalCollateralBase as any,
      totalDebtBase,
      poolAddress: POOL_ADDRESS as any,
      availableBorrowsBase: availableBorrowsBaseRaw,
      ltv: ltvRaw,
    });
  }

  return (
    <div className="flex w-full max-w-sm flex-col items-center space-x-2 rounded-lg border-2 p-4">
      <div className="mb-3">Read Looping Position By Address:</div>
      <Input
        className="mb-3"
        type="address"
        placeholder="Address"
        value={address}
        onChange={(e) => {
          console.log(e.target.value);
          setAddress(e.target.value);
        }}
      />
      <Button onClick={onClick}>Get Data</Button>
      <div className="relative h-[400px] w-[300px] space-y-4 overflow-scroll">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="my-2 rounded-lg border p-2">
            <div className="overflow-scroll text-gray-600">
              <p className="text-sm font-semibold">{key}</p>
              <p className="p-5 text-gray-600">{value ? value : 'N/A'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
