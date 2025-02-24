import { useState } from 'react';
import { ToastContainer, Bounce, toast } from 'react-toastify';

import { Header } from '@/widgets/header'

import useWallet from '@/entities/wallet/useWallet';
import { InfoProPageDialog } from './InfoProPageDialog';
import { hasEnoughBalance } from '@/shared/lib/hasEnoughBalance';
import { ContractAddresses } from '@/shared/constants/contracts/addresses';
import { Address, formatUnits, parseUnits } from 'viem';
import { checkAndApprove } from '@/shared/lib/approve';
import { gmxContract } from '@/entities/gmx/gmx-contract';
import { aaveContract } from '@/entities/aave/aave-contract';


export const ProPage = () => {
  const { active: isConnected, account: address, dsProxyAddress } = useWallet();

  const [longAmount, setLongAmount] = useState('4');
  const [shortAmount, setShortAmount] = useState('4');
  const [leverageLong, setLeverageLong] = useState('6');
  const [leverageShort, setLeverageShort] = useState('3');
  const [calculatedStrategy, setCalculatedStrategy] = useState<{
    aave: {
      longAmount: number;
      longLeverage: number;
      totalRate: number;
      criticalEthValue: number;
    };
    gmx: {
      shortAmount: number;
      shortLeverage: number;
      totalRate: number;
      criticalEthValue: number;
      initialCollateralDeltaAmount: number;
      sizeDeltaUsd: number;
      totalRateAPY: number;
    };
  } | null>(null);

  if (!isConnected || !address) {
    return (
      <div className="container mx-auto bg-gray-900 text-white">
        <Header />
        <div className="flex min-h-screen w-full items-center justify-center">
          <h2>Please connect your wallet</h2>
        </div>
      </div>
    );
  }

  const calculateStrategy = async () => {
    try {
      // setIsLoading(true);
      const response = await fetch(`${import.meta.env.VITE_ORACLE}calculateStrategyProfessional`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          longAmount: Number(longAmount),
          shortAmount: Number(shortAmount),
          leverageLong: Number(leverageLong),
          leverageShort: Number(leverageShort),
        }),
      });

      if (!response.ok) {
        throw new Error('Calculation failed');
      }

      const data = await response.json();
      setCalculatedStrategy(data);
    } catch (error) {
      console.error('Strategy calculation error:', error);
      toast.error('Failed to calculate strategy');
    } finally {
      // setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!calculatedStrategy) {
      toast.error('Please calculate the strategy first');
      return;
    }

    if (!address || !dsProxyAddress) return;

    const gmxAmount = parseUnits(String(calculatedStrategy?.gmx?.shortAmount), 6);
    const aaveAmount = parseUnits(String(calculatedStrategy?.aave?.longAmount), 6);

    const totalAmount = gmxAmount + aaveAmount;

    const isEnoughBalance = await hasEnoughBalance(ContractAddresses.USDC, Number(formatUnits(totalAmount, 6)), address);
    if (!isEnoughBalance) {
      toast.error('Insufficient USDC', {
        position: 'top-left',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
      return;
    }
    await checkAndApprove(address, ContractAddresses.USDC, dsProxyAddress, totalAmount);

    await gmxContract.createShort({ account: address as any, amount: gmxAmount, dsProxyAddress: dsProxyAddress as Address});
    await aaveContract.openLoooping({ account: address as any, amount: aaveAmount, dsProxyAddress: dsProxyAddress as Address });
  };

  return (
    <div className="container mx-auto text-white min-h-screen">
      <Header />
      <ToastContainer position="top-right" transition={Bounce} theme="dark" />
      <div className="w-full flex flex-row">
        <div className='flex flex-column items-top items-center w-full justify-center border-t-2 border-gray-700 mt-2'>
          <div className='mr-5 font-["Orbitron"] text-[34px] font-bold tracking-wider bg-clip-text pt-2'>PRO PAGE</div>
        </div>
      </div>
      <div className='mt-2 flex flex-column items-top items-center w-full justify-center'>
        <InfoProPageDialog />
      </div>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="grid grid-cols-2 gap-8 mb-6">
          {/* Long Position Inputs */}
          <div>
            <h3 className="text-xl font-bold mb-4">Long Position</h3>
            <div className="space-y-4">
              <div>
                <label className="block mb-2">Amount</label>
                <input
                  type="number"
                  value={longAmount}
                  onChange={(e) => setLongAmount(e.target.value)}
                  className="w-full p-2 border rounded bg-gray-800 border-gray-700 text-white"
                  min="0"
                />
              </div>
              <div>
                <label className="block mb-2">Leverage</label>
                <input
                  type="number"
                  value={leverageLong}
                  onChange={(e) => setLeverageLong(e.target.value)}
                  className="w-full p-2 border rounded bg-gray-800 border-gray-700 text-white"
                  min="1"
                  max="6"
                />
              </div>
            </div>
          </div>

          {/* Short Position Inputs */}
          <div>
            <h3 className="text-xl font-bold mb-4">Short Position</h3>
            <div className="space-y-4">
              <div>
                <label className="block mb-2">Amount</label>
                <input
                  type="number"
                  value={shortAmount}
                  onChange={(e) => setShortAmount(e.target.value)}
                  className="w-full p-2 border rounded bg-gray-800 border-gray-700 text-white"
                  min="0"
                />
              </div>
              <div>
                <label className="block mb-2">Leverage</label>
                <input
                  type="number"
                  value={leverageShort}
                  onChange={(e) => setLeverageShort(e.target.value)}
                  className="w-full p-2 border rounded bg-gray-800 border-gray-700 text-white"
                  min="2"
                  max="3"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={calculateStrategy}
          className="w-full bg-gray-700 text-white py-2 rounded hover:bg-gray-600 disabled:bg-gray-800 mb-4"
        >
          Calculate Strategy
        </button>

        {calculatedStrategy && (
          <div className="mb-6 p-6 bg-gray-800 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Strategy Calculation Results</h3>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold mb-2">Long Position (AAVE):</h4>
                <p>Amount: {calculatedStrategy.aave.longAmount} USDC</p>
                <p>Leverage: {calculatedStrategy.aave.longLeverage}x</p>
                {/* <p>Critical ETH Price: ${calculatedStrategy.aave.criticalEthValue.toFixed(2)}</p> */}
              </div>
              <div>
                <h4 className="font-bold mb-2">Short Position (GMX):</h4>
                <p>Amount: {calculatedStrategy.gmx.shortAmount} USDC</p>
                <p>Leverage: {calculatedStrategy.gmx.shortLeverage}x</p>
                {/* <p>Critical ETH Price: ${calculatedStrategy.gmx.criticalEthValue.toFixed(2)}</p> */}
              </div>
              <p>Rate: {calculatedStrategy.gmx.totalRate.toFixed(2)}%</p>
            </div>
            <div className="mt-4 text-center">
              {/* <p className="text-xl font-bold">Combined APY: {calculatedStrategy.gmx.totalRateAPY.toFixed(2)}%</p> */}
            </div>
          </div>
        )}
        <button
          onClick={handleSubmit}
          className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-700 transition-colors duration-200 border border-gray-700 shadow-lg disabled:bg-gray-900 disabled:border-gray-800 disabled:cursor-not-allowed"
        >
          Execute Strategy
        </button>
      </div>
    </div>
  );
};
