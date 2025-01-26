import { useState } from 'react';
import { formatUnits } from 'viem';
import { publicClient } from '@/shared/config/wagmi.config';

interface DebugWindowProps {
  dsProxy: string;
  shortInfo: any;
}

//@ts-ignore
const DebugWindow: React.FC<DebugWindowProps> = ({ dsProxy, readShortPosition }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [shortInfo, setShortInfo] = useState<Record<string, any>>({});
  const [currentCollateral, setCurrentCollateral] = useState('0');
  const [currentDebt, setCurrentDebt] = useState('0');
  const [healthFactor, setHealthFactor] = useState('0');

  // console.log(JSON.stringify(shortInfo));
  const addressPosition = '0x794a61358D6845594F94dc1DB02A252b5b4814aD';

  const getUserAccountData = async (proxyAddress: string) => {
    //@ts-ignore
    const { data } = await publicClient.simulateContract({
      address: addressPosition,
      abi: [
        {
          name: 'getUserAccountData',
          inputs: [{ type: 'address', name: 'user' }],
          outputs: [
            { type: 'uint256', name: 'totalCollateralBase' },
            { type: 'uint256', name: 'totalDebtBase' },
            { type: 'uint256', name: 'availableBorrowsBase' },
            { type: 'uint256', name: 'currentLiquidationThreshold' },
            { type: 'uint256', name: 'ltv' },
            { type: 'uint256', name: 'healthFactor' },
          ],
          stateMutability: 'view',
          type: 'function',
        },
      ],
      functionName: 'getUserAccountData',
      args: [proxyAddress],
    });

    const currentCollateral = formatUnits(data[0], 18);
    const currentDebt = formatUnits(data[1], 18);
    const healthFactor = formatUnits(data[5], 18);

    setCurrentCollateral(currentCollateral);
    setCurrentDebt(currentDebt);
    setHealthFactor(healthFactor);

    console.log({
      proxyAddress,
      currentCollateral: Number(currentCollateral).toFixed(18),
      currentDebt: Number(currentDebt).toFixed(18),
      healthFactor,
    });
  };

  return (
    <div className="debug-window border border-white p-5">
      <div className="mb-2 flex items-center justify-between">
        <h3>Debug Window:</h3>
        <div className="flex gap-2">
          <button onClick={() => setIsCollapsed(!isCollapsed)} className="rounded border border-white px-2 py-1">
            {isCollapsed ? 'Expand' : 'Collapse'}
          </button>
          <button
            onClick={async () => {
              const shortInfo = await readShortPosition(dsProxy);
              setShortInfo(shortInfo);
              await getUserAccountData(dsProxy);
            }}
            className="rounded border border-white px-2 py-1"
          >
            {'Update'}
          </button>
        </div>
      </div>
      {!isCollapsed && (
        <div>
          <pre>
            {JSON.stringify(
              {
                dsProxy,
                shortInfo,
              },
              (_, value) => (typeof value === 'bigint' ? value.toString() : value),
              2,
            )}
          </pre>
          <p>Proxy Address: {dsProxy}</p>
          <p>Current Collateral: {Number(currentCollateral).toFixed(18)}</p>
          <p>Current Debt: {Number(currentDebt).toFixed(18)}</p>
          <p>Health Factor: {healthFactor}</p>
        </div>
      )}
    </div>
  );
};

export default DebugWindow;
