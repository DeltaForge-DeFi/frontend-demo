import { useEffect, useState } from 'react';
import { Address, formatUnits } from 'viem';
import { ToastContainer, toast, Bounce } from 'react-toastify';

import { Header } from '@/widgets/header';
import { Button } from '@/shared/ui/Button';

import { APYChart } from './APYChart';
import { BadgeDelta } from '@/shared/ui/badge-delta';
import useWallet from '@/entities/wallet/useWallet';
import { gmxContract } from '@/entities/gmx/gmx-contract';
import { aaveContract } from '@/entities/aave/aave-contract';


// async function shortDeposit(address: `0x${string}`, amount: any, dsProxyAddress: any) {
//   console.log('Depositing ETH to DSProxy...');
//   const depositCallData = encodeAbiParameters(
//     [
//       { name: 'user', type: 'address' },
//       { name: 'market', type: 'address' },
//       { name: 'sizeDeltaUsd', type: 'uint256' },
//       { name: 'collateralAmount', type: 'uint256' },
//       { name: 'exchangeRouter', type: 'address' },
//       { name: 'reader', type: 'address' },
//       { name: 'USDC', type: 'address' },
//       { name: 'orderVaultAddress', type: 'address' },
//       { name: 'dataStoreAddress', type: 'address' },
//       { name: 'routerAddress', type: 'address' },
//     ],
//     [
//       address,
//       MARKET,
//       parseUnits('3', 30),
//       amount,
//       EXCHANGE_ROUTER_ADDRESS,
//       READER_ADDRESS,
//       USDC_ADDRESS,
//       ORDER_VAULT_ADDRESS,
//       DATA_STORE_ADDRESS,
//       ROUTER_ADDRESS,
//     ],
//   );

//   const encodedData = encodeFunctionData({
//     abi: GMX_SHORT_ABI,
//     functionName: 'createShort',
//     args: [depositCallData],
//   });

//   await dsProxyExecute({
//     address: address as `0x${string}`,
//     dsProxyAddress: dsProxyAddress as `0x${string}`,
//     executeContract: GMX_SHORT_CONTRACT,
//     executeData: encodedData,
//     value: parseEther('0.0005'),
//   }).catch((error) => {
//     console.error('Ошибка ds proxy execute:', error);
//     process.exit(1);
//   });

//   toast('GMX Short opened', {
//     position: 'top-left',
//     autoClose: 5000,
//     hideProgressBar: false,
//     closeOnClick: false,
//     pauseOnHover: true,
//     draggable: true,
//     progress: undefined,
//     theme: 'light',
//   });
// }

// async function aaveLooping(address: `0x${string}`) {}


// async function deposit(address: `0x${string}`, loopingAmount: string, shortAmount: string) {
//   const dsProxy = localStorage.getItem('ds_proxy') as `0x${string}`;
//   const shortAmountEth = parseEther(shortAmount);

//   console.log('Depositing ETH to DSProxy...');

//   // // Transfer ETH to WETH contract
//   // const hash = await walletClient.sendTransaction({
//   //   account: address as `0x${string}`,
//   //   to: weth.address as `0x${string}`,
//   //   value: shortAmountEth,
//   // });

//   // await publicClient.waitForTransactionReceipt({ hash });

//   // Approve WETH for the dsProxy
//   // const approveHash = await walletClient.writeContract({
//   //   address: weth.address as `0x${string}`,
//   //   abi: weth.abi,
//   //   functionName: 'approve',
//   //   args: [dsProxy, shortAmountEth],
//   //   account: address as `0x${string}`,
//   // });

//   // await publicClient.waitForTransactionReceipt({ hash: approveHash });

//   try {
//     await shortDeposit(address, shortAmountEth, dsProxy);
//     console.log('ШОРТ открылся');
//   } catch (error) {
//     toast.error("GMX doesn't opened", {
//       position: 'top-left',
//       autoClose: 5000,
//       hideProgressBar: false,
//       closeOnClick: false,
//       pauseOnHover: true,
//       draggable: true,
//       progress: undefined,
//       theme: 'light',
//     });
//     console.log('ШОРТ не открылся');
//   }

//   try {
//     // await openLooping(loopingAmount);
//   } catch (error) {
//     toast.error("Long doesn't opened", {
//       position: 'top-left',
//       autoClose: 5000,
//       hideProgressBar: false,
//       closeOnClick: false,
//       pauseOnHover: true,
//       draggable: true,
//       progress: undefined,
//       theme: 'light',
//     });
//   }
// }

// const convertUSDCtoWETH = (usdcAmount: string, ethPrice: bigint) => {
//   // Convert the input strings to numbers
//   const usdcAmountNum = Number(usdcAmount);
//   const ethPriceNum = Number(formatUnits(ethPrice, 8)); // Assuming formatUnits returns a string

//   console.log('ethPriceNum', ethPriceNum);
//   console.log('usdcAmountNum', usdcAmountNum);
//   // Calculate the WETH amount
//   const wethAmount = (usdcAmountNum / ethPriceNum).toFixed(4); // Use toFixed(4) for WETH precision

//   return wethAmount;
// };

// async function withdraw(address: `0x${string}`) {
//   const withdrawCallData = encodeAbiParameters(
//     [
//       { name: 'user', type: 'address' },
//       { name: 'exchangeRouter', type: 'address' },
//       { name: 'reader', type: 'address' },
//       { name: 'USDC', type: 'address' },
//       { name: 'orderVaultAddress', type: 'address' },
//       { name: 'dataStoreAddress', type: 'address' },
//       { name: 'routerAddress', type: 'address' },
//     ],
//     [address, EXCHANGE_ROUTER_ADDRESS, READER_ADDRESS, USDC_ADDRESS, ORDER_VAULT_ADDRESS, DATA_STORE_ADDRESS, ROUTER_ADDRESS],
//   );

//   const encodedData = encodeFunctionData({
//     abi: shortJson.abi,
//     functionName: 'withdrawShort',
//     args: [withdrawCallData],
//   });

//   const dsProxy = localStorage.getItem('ds_proxy');
//   console.log('Executing withdraw through DSProxy...');

//   const hash = await walletClient.writeContract({
//     address: dsProxy as `0x${string}`,
//     abi: dsProxyJson.abi,
//     functionName: 'execute',
//     args: [shortJson.adress, encodedData],
//     value: parseEther('0.0005'),
//     account: address as `0x${string}`,
//   });

//   await publicClient.waitForTransactionReceipt({ hash });
//   console.log('Withdrawal short complete');
//   await closeLooping();
// }

export const LitePage = () => {
  const { active: isConnected, account: address, dsProxyAddress } = useWallet();

  const [amount, setAmount] = useState('');
  const [longAmount, setLongAmount] = useState('');
  const [shortAmount, setShortAmount] = useState('');
  const [aby, setAby] = useState(10);
  const [longStatus, setLongStatus] = useState(false);
  const [shortStatus, setShortStatus] = useState(false);


  useEffect(() => {
    if (!dsProxyAddress) return

    const readPositions = async () => {
      console.log('readPositions');
      const gmx = await gmxContract.readPositon(dsProxyAddress as Address);
      const aave = await aaveContract.readPositon(dsProxyAddress as Address);

      const aaveHealthFactor =  formatUnits(aave.healthFactor, 18) 

      console.log('gmx', gmx)
      console.log('aave', aaveHealthFactor)

      setLongStatus(0 < Number(aaveHealthFactor) && 10 > Number(aaveHealthFactor))
      setShortStatus(false)
    }

    readPositions()
  }, [dsProxyAddress])

  const handleConfirm = async () => {
    if (!address || !dsProxyAddress) return

    await gmxContract.createShort({ account: address as any, dsProxyAddress: dsProxyAddress as Address });
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
      // await gmxContract.withdrawShort({ address: address as any, dsProxyAddress: dsProxyAddress as Address });
      await aaveContract.openLoooping({ account: address as any, dsProxyAddress: dsProxyAddress as Address });
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
        <div className='flex justify-center items-left flex-col'>
          <div>[Debug] Status:</div>
          <div>Short: {shortStatus ? 'active' : '-'}</div>
          <div>Long: {longStatus ? 'active' : '-'}</div>
        </div>
        <div className="flex-row w-full">
          {longStatus || shortStatus ? (
            <div>
              <Button variant="outline" onClick={async () => await withdraw(address)}>
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
