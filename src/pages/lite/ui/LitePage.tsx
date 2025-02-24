import { useEffect, useState } from 'react';
import { Address, formatUnits, parseUnits } from 'viem';
import { ToastContainer, Bounce, toast } from 'react-toastify';

import { Header } from '@/widgets/header';

import { APYChart } from './APYChart';
import useWallet from '@/entities/wallet/useWallet';
import { gmxContract } from '@/entities/gmx/gmx-contract';
import { aaveContract } from '@/entities/aave/aave-contract';
import { ContractAddresses } from '@/shared/constants/contracts/addresses';
import { checkAndApprove } from '@/shared/lib/approve';
import { GreenIndicator, RedIndicator } from '@/shared/ui/indecators';
import { hasEnoughBalance } from '@/shared/lib/hasEnoughBalance';
import { WithdrawWindow } from './WithdrawWindow';
import { DepositWindow } from './DepositWindow';
import { InfoLitePageDialog } from './InfoLitePageDialog';

export const PositionStatusIndicator = ({ shortStatus, longStatus }: { shortStatus: boolean; longStatus: boolean }) => {
  return (
    <div className="flex flex-row items-center border h-fit border-white p-2">
      <div className="mr-3 flex flex-row items-center">Short: {shortStatus ? <GreenIndicator /> : <RedIndicator />}</div>
      <div className="flex flex-row items-center">Long: {longStatus ? <GreenIndicator /> : <RedIndicator />}</div>
    </div>
  );
};

export const LitePage = () => {
  const { active: isConnected, account: address, dsProxyAddress } = useWallet();

  const [amount, setAmount] = useState('');
  const [longData, setLongData] = useState<any>('');
  const [shortData, setShortData] = useState<any>('');
  const [aby, setAby] = useState(10);
  const [longStatus, setLongStatus] = useState(false);
  const [shortStatus, setShortStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const readPositions = async (dsProxyAddress: Address) => {
    console.log('readPositions');
    const gmx = await gmxContract.readPositon(dsProxyAddress as Address);
    const aave = await aaveContract.readPositon(dsProxyAddress as Address);

    console.log('gmx', gmx);
    console.log('aave', formatUnits(aave.healthFactor, 18));

    const aaveHealthFactor = formatUnits(aave.healthFactor, 18);
    setLongStatus(0 < Number(aaveHealthFactor) && 10 > Number(aaveHealthFactor));
    setShortStatus(gmx?.length > 0);
  };

  useEffect(() => {
    if (!dsProxyAddress) return;
    readPositions(dsProxyAddress);
  }, [dsProxyAddress]);

  const handleConfirm = async () => {
    if (!address || !dsProxyAddress) return;

    const gmxAmount = parseUnits(String(shortData?.shortAmount), 6);
    const aaveAmount = parseUnits(String(longData?.longAmount), 6);

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

    await gmxContract.createShort({ account: address as any, amount: gmxAmount, dsProxyAddress: dsProxyAddress as Address, gmxData: shortData as any });
    await aaveContract.openLoooping({ account: address as any, amount: aaveAmount, dsProxyAddress: dsProxyAddress as Address });
    await readPositions(dsProxyAddress);
  };

  const onChange = async (e: any) => {
    setAmount(e.target.value);
  };

  const calculate = async () => {
    setIsLoading(true);
    const value = parseFloat(amount);
    try {
      const response = await fetch(`${import.meta.env.VITE_ORACLE}calculateStrategy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          depositAmount: value,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('response', data);
      setAby(data.totalRateAPY);
      setLongData(data.aave);
      setShortData(data.gmx);
      console.log('longData', longData);
    } catch (error) {
      const longValue = (value * 0.3).toString();
      const shortValue = (value * 0.7).toString();

      setLongData({ longAmount: longValue });
      setShortData({ shortAmount: shortValue });
      console.error('Error calculating APY:', error);
      toast.error('Failed to calculate APY', {
        position: 'top-left',
        theme: 'dark',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const withdraw = async () => {
    await gmxContract.withdrawShort({ address: address as any, dsProxyAddress: dsProxyAddress as Address });
    await aaveContract.closeLoooping({ account: address as any, dsProxyAddress: dsProxyAddress as Address });
    await readPositions(dsProxyAddress as Address);
  };

  if (!isConnected || !address) {
    return (
      <div className="container mx-auto">
        <Header />
        <div className="flex min-h-screen w-full items-center justify-center">
          <h2>Please connect your wallet</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <Header />
      <div className="w-full flex flex-row">
        <div className='flex flex-column items-top items-center w-full justify-center border-t-2 mt-2'>
          <div className='mr-5 font-["Orbitron"] text-[34px] font-bold tracking-wider bg-clip-text pt-2'>LITE PAGE</div>
        </div>
      </div>
      <div className='mt-2 flex flex-column items-top items-center w-full justify-center'>
        <div className='mr-2'>
          <PositionStatusIndicator shortStatus={shortStatus} longStatus={longStatus} />
        </div>
        <InfoLitePageDialog />
      </div>
      <div className='flex flex-row items-center'>
      </div>
      <div className="flex min-h-screen w-full flex-row mt-15 justify-between mt-20">
        <div className="flex w-fit flex-col mr-10">
          {shortStatus || longStatus ? (
            <WithdrawWindow withdraw={withdraw} />
          ) : (
            <DepositWindow amount={amount} onChange={onChange} calculate={calculate} handleConfirm={handleConfirm} isLoading={isLoading} shortData={shortData} longData={longData} />
          )}
        </div>
        <div>
          <div className="flex flex-1 flex-col items-center justify-center">
            <APYChart yearlyAPY={aby} />
          </div>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />
      </div>
    </div>
  );
};
