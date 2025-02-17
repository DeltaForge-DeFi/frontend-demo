import { useEffect, useState } from 'react';
import { Address, formatUnits, parseUnits } from 'viem';
import { ToastContainer, Bounce } from 'react-toastify';

import { Header } from '@/widgets/header';
import { Button } from '@/shared/ui/Button';

import { APYChart } from './APYChart';
import { BadgeDelta } from '@/shared/ui/badge-delta';
import useWallet from '@/entities/wallet/useWallet';
import { gmxContract } from '@/entities/gmx/gmx-contract';
import { aaveContract } from '@/entities/aave/aave-contract';
import { ContractAddresses } from '@/shared/constants/contracts/addresses';
import { checkAndApprove } from '@/shared/lib/approve';


const RedIndicator = () => {
  return (
    <span className="ml-2 w-2 h-2 bg-red-500 rounded-full flex items-center justify-center"></span>
  )
}

const GreenIndicator = () => {
  return (
    <span className="ml-2 w-2 h-2 bg-green-500 rounded-full flex items-center justify-center"></span>
  )
}

export const LitePage = () => {
  const { active: isConnected, account: address, dsProxyAddress } = useWallet();

  const [amount, setAmount] = useState('');
  const [longAmount, setLongAmount] = useState('');
  const [shortAmount, setShortAmount] = useState('');
  const [aby, setAby] = useState(10);
  const [longStatus, setLongStatus] = useState(true);
  const [shortStatus, setShortStatus] = useState(false);


  useEffect(() => {
    if (!dsProxyAddress) return

    const readPositions = async () => {
      console.log('readPositions');
      const gmx = await gmxContract.readPositon(dsProxyAddress as Address);
      const aave = await aaveContract.readPositon(dsProxyAddress as Address);

      const totalCollateralBase =  formatUnits(aave.totalCollateralBase, 18) 

      console.log('gmx', gmx)
      console.log('aave', totalCollateralBase)

      setLongStatus(0 > Number(totalCollateralBase))
      setShortStatus(gmx?.length > 0)
    }

    readPositions()
  }, [dsProxyAddress])

  const handleConfirm = async () => {
    if (!address || !dsProxyAddress) return

    const gmxAmount = parseUnits(shortAmount, 6);
    const aaveAmount = parseUnits(longAmount, 6);

    await checkAndApprove(address, ContractAddresses.USDC, dsProxyAddress, gmxAmount + aaveAmount);

    await gmxContract.createShort({ account: address as any, amount: gmxAmount, dsProxyAddress: dsProxyAddress as Address });
    await aaveContract.openLoooping({ account: address as any, dsProxyAddress: dsProxyAddress as Address });
  };

  const onChange = async (e: any) => {
    setAmount(e.target.value);
  };

  const calculate = async () => {
    const value = parseFloat(amount);
    const longValue = (value * 0.3).toString();
    const shortValue = (value * 0.7).toString();

    setLongAmount(longValue);
    setShortAmount(shortValue);

    try {
      const response = await fetch('http://150.241.107.169:3009/calculateStrategy', {
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
    } catch (error) {
      console.error('Error calculating APY:', error);
    }
  };

  const withdraw = async () => {
      await gmxContract.withdrawShort({ address: address as any, dsProxyAddress: dsProxyAddress as Address });
      await aaveContract.closeLoooping({ account: address as any, dsProxyAddress: dsProxyAddress as Address });
  }

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
      <div className="flex min-h-screen w-full flex-col justify-between">
        <div className='flex justify-center items-center flex-col w-full '>
          <div className='flex flex-row items-center border border-white p-2'>
            <div className='flex flex-row items-center mr-3'>Short {shortStatus ?(<GreenIndicator/>) : (<RedIndicator/>)}</div>
            <div className='flex flex-row items-center'>Long: {longStatus ? (<GreenIndicator/>) : (<RedIndicator/>)}</div>
          </div>
        </div>
        <div className="flex-row w-full">
          {longStatus || shortStatus ? (
            <div className='flex justify-center mb-20'>
              <Button variant="outline" onClick={async () => await withdraw()}>
                Withdraw
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <div className="flex flex-col gap-5">
                <div>
                  <h2 className="mb-4 text-lg font-semibold text-white">Enter Deposit Amount</h2>
                  <div className='flex flex-row'>
                    <input
                      type="number"
                      value={amount}
                      onChange={onChange}
                      className="mb-4 w-full rounded border bg-gray-900 p-2 text-white"
                      placeholder="Amount in USDC"
                    />
                    <Button variant="outline" onClick={calculate} className="mr-4 ml-5">
                      Calculate
                    </Button>
                  </div>
                  {
                    <div className="mb-4">
                      <label className="mb-2 block text-white">
                        Long: {longAmount ? `${Number(longAmount).toFixed(4)} USDC` : '---'}
                      </label>
                      <label className="mb-2 block text-white">
                        Short: {shortAmount ? `${Number(shortAmount).toFixed(4)} USDC` : '---'}
                      </label>
                    </div>
                  }
                  <Button variant="outline" onClick={handleConfirm}>
                    Confirm
                  </Button>
                </div>
              </div >
            </div >
          )}
          <div>
            <div className="flex flex-1 flex-col items-center justify-center">
              <APYChart yearlyAPY={aby} />
              <div>
                <BadgeDelta variant="solid" deltaType="increase" iconStyle="line" value="9.3%" className="mr-3" />
                <BadgeDelta variant="solid" deltaType="decrease" iconStyle="line" value="1.9%" className="mr-3" />
                <BadgeDelta variant="solid" deltaType="neutral" iconStyle="line" value="0.6%" />
              </div>
            </div>
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
      </div >
    </div >
  );
};
