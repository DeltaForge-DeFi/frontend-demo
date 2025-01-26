import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { encodeAbiParameters, parseEther, encodeFunctionData, parseUnits, formatUnits, Address } from 'viem';

import { publicClient, walletClient } from '@/shared/config/wagmi.config';

import { Header } from '@/widgets/header';
import { Button } from '@/shared/ui/Button';

import weth from '@/shared/abi/weth.json';
import dsProxyJson from '@/shared/abi/ds-proxy.json';
import shortJson from '@/shared/abi/short.json';
import gmxReaderJson from '@/shared/abi/gmx-reader.json';

import DebugWindow from './DebugWindown';
import { openLooping } from '@/pages/lite/ui/openLooping';
import { APYChart } from './APYChart';
import { CHAINLINK_ETH_USD_FEED, CHAINLINK_FEED_ABI, closeLooping } from '@/pages/lite/ui/closeLooping';

const EXCHANGE_ROUTER_ADDRESS = '0x900173A66dbD345006C51fA35fA3aB760FcD843b';
const ROUTER_ADDRESS = '0x7452c558d45f8afC8c83dAe62C3f8A5BE19c71f6';
const READER_ADDRESS = gmxReaderJson.address as `0x${string}`;
const ORDER_VAULT_ADDRESS = '0x31eF83a530Fde1B38EE9A18093A333D8Bbbc40D5';
const DATA_STORE_ADDRESS = '0xFD70de6b91282D8017aA4E741e9Ae325CAb992d8';
const USDC_ADDRESS = '0xaf88d065e77c8cC2239327C5EDb3A432268e5831';
const WETH_ADDRESS = '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1';
const MARKET = '0x70d95587d40A2caf56bd97485aB3Eec10Bee6336';
const UNISWAP_SWAP_ADDRESS = '0xD8F8c0f418d34aA9B30d29D7Eaf975E4241aa2C2';

async function shortDeposit(address: `0x${string}`, amount: any, dsProxyAddress: any) {
  console.log('Depositing ETH to DSProxy...');
  const depositCallData = encodeAbiParameters(
    [
      { name: 'user', type: 'address' },
      { name: 'market', type: 'address' },
      { name: 'sizeDeltaUsd', type: 'uint256' },
      { name: 'wethAmount', type: 'uint256' },
      { name: 'exchangeRouter', type: 'address' },
      { name: 'reader', type: 'address' },
      { name: 'USDC', type: 'address' },
      { name: 'WETH', type: 'address' },
      { name: 'uniswapSwap', type: 'address' },
      { name: 'orderVaultAddress', type: 'address' },
      { name: 'dataStoreAddress', type: 'address' },
      { name: 'routerAddress', type: 'address' },
    ],
    [
      address,
      MARKET,
      parseUnits('3', 30),
      amount,
      EXCHANGE_ROUTER_ADDRESS,
      READER_ADDRESS,
      USDC_ADDRESS,
      WETH_ADDRESS,
      UNISWAP_SWAP_ADDRESS,
      ORDER_VAULT_ADDRESS,
      DATA_STORE_ADDRESS,
      ROUTER_ADDRESS,
    ],
  );

  console.log(depositCallData);

  const encodedData = encodeFunctionData({
    abi: shortJson.abi,
    functionName: 'createShort',
    args: [depositCallData],
  });

  const hash = await walletClient.writeContract({
    address: dsProxyAddress as `0x${string}`,
    abi: dsProxyJson.abi,
    functionName: 'execute',
    args: [shortJson.adress, encodedData],
    account: address as `0x${string}`,
    value: parseEther('0.0005'),
    gas: 2000000n, // Added gas limit of 1 million units
  });

  await publicClient.waitForTransactionReceipt({ hash });
}

// async function aave(address: `0x${string}`) {
//   const dsProxy = localStorage.getItem('ds_proxy') as `0x${string}`;
//   const amount = parseEther('0.0001');

//   console.log('Depositing ETH to11111111');
//   // STEP 1
//   const depositCallData = encodeAbiParameters(
//     [
//       { name: 'amount', type: 'uint256' },
//       { name: 'from', type: 'address' },
//       { name: 'assetId', type: 'uint16' },
//       { name: 'enableAsColl', type: 'bool' },
//       { name: 'useDefaultMarket', type: 'bool' },
//       { name: 'useOnBehalf', type: 'bool' },
//       { name: 'market', type: 'address' },
//       { name: 'onBehalf', type: 'address' },
//     ],
//     [
//       amount,
//       address,
//       4, //WETH
//       false,
//       true,
//       false,
//       '0x0000000000000000000000000000000000000000',
//       '0x0000000000000000000000000000000000000000',
//     ],
//   );

//   console.log('Depositing ETH to 222222');

//   // STEP 2
//   const encodedData = encodeFunctionData({
//     abi: [
//       {
//         inputs: [{ type: 'bytes', name: 'data' }],
//         name: 'executeActionDirect',
//         outputs: [],
//         stateMutability: 'payable',
//         type: 'function',
//       },
//     ],
//     functionName: 'executeActionDirect',
//     args: [depositCallData],
//   });

//   console.log('Depositing ETH to 333');

//   // STEP 3
//   const hash = await walletClient.writeContract({
//     address: dsProxy as `0x${string}`,
//     abi: dsProxyJson.abi,
//     functionName: 'execute',
//     args: ['0x755d8133E1688b071Ec4ac73220eF7f70BC6992F', encodedData],
//     value: parseEther('0.0005'),
//     account: address as `0x${string}`,
//   });

//   console.log('Depositing ETH to 4444');

//   await publicClient.waitForTransactionReceipt({ hash });
// }

async function deposit(address: `0x${string}`, loopingAmount: string, shortAmount: string) {
  const dsProxy = localStorage.getItem('ds_proxy') as `0x${string}`;
  const shortAmountEth = parseEther(shortAmount);

  console.log('Depositing ETH to DSProxy...');

  // Transfer ETH to WETH contract
  const hash = await walletClient.sendTransaction({
    account: address as `0x${string}`,
    to: weth.address as `0x${string}`,
    value: shortAmountEth,
  });

  await publicClient.waitForTransactionReceipt({ hash });

  // Approve WETH for the dsProxy
  const approveHash = await walletClient.writeContract({
    address: weth.address as `0x${string}`,
    abi: weth.abi,
    functionName: 'approve',
    args: [dsProxy, shortAmountEth],
    account: address as `0x${string}`,
  });

  await publicClient.waitForTransactionReceipt({ hash: approveHash });

  try {
    await shortDeposit(address, shortAmountEth, dsProxy);
    console.log('ШОРТ открылся');
  } catch (error) {
    console.log('ШОРТ открылсяя');
  }
  await openLooping(loopingAmount);
}

async function withdraw(address: `0x${string}`) {
  const withdrawCallData = encodeAbiParameters(
    [
      { name: 'user', type: 'address' },
      { name: 'exchangeRouter', type: 'address' },
      { name: 'reader', type: 'address' },
      { name: 'USDC', type: 'address' },
      { name: 'orderVaultAddress', type: 'address' },
      { name: 'dataStoreAddress', type: 'address' },
      { name: 'routerAddress', type: 'address' },
    ],
    [address, EXCHANGE_ROUTER_ADDRESS, READER_ADDRESS, USDC_ADDRESS, ORDER_VAULT_ADDRESS, DATA_STORE_ADDRESS, ROUTER_ADDRESS],
  );

  const encodedData = encodeFunctionData({
    abi: shortJson.abi,
    functionName: 'withdrawShort',
    args: [withdrawCallData],
  });

  const dsProxy = localStorage.getItem('ds_proxy');
  console.log('Executing withdraw through DSProxy...');

  const hash = await walletClient.writeContract({
    address: dsProxy as `0x${string}`,
    abi: dsProxyJson.abi,
    functionName: 'execute',
    args: [shortJson.adress, encodedData],
    value: parseEther('0.0005'),
    account: address as `0x${string}`,
  });

  await publicClient.waitForTransactionReceipt({ hash });
  console.log('Withdrawal short complete');
  await closeLooping();
}

const readShortPosition = async (address: `0x${string}`) => {
  const readResult = await publicClient.readContract({
    address: READER_ADDRESS as `0x${string}`,
    abi: gmxReaderJson.abi,
    functionName: 'getAccountPositions',
    args: [DATA_STORE_ADDRESS, address, 0n, 100n],
  });

  //@ts-ignore
  const result = '';

  console.log(
    'Reading short position...',
    //@ts-ignore
    JSON.stringify(readResult[0], (_, value) => (typeof value === 'bigint' ? value.toString() : value), 2),
  );

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return readResult ?? readResult[0];
};

export const LitePage = () => {
  const { isConnected, address } = useAccount();
  const [dsPrxoy, setDsProxy] = useState('0x32fa5955d68F99856661D806192fB3185Ed61F05');

  useEffect(() => {
    const dsProxy = localStorage.getItem('ds_proxy') as `0x${string}`;
    setDsProxy(dsProxy || '');
  }, []);

  const [amount, setAmount] = useState('');
  const [longAmount, setLongAmount] = useState('');
  const [shortAmount, setShortAmount] = useState('');
  const [aby, setAby] = useState(10);

  // const handleOpenModal = () => setIsModalOpen(true);
  // const handleCloseModal = () => setIsModalOpen(false);

  const [ethPrice, setEthPrice] = useState<bigint>(0n);

  useEffect(() => {
    const fetchPrice = async () => {
      const [_, price] = (await publicClient.readContract({
        address: CHAINLINK_ETH_USD_FEED,
        abi: CHAINLINK_FEED_ABI,
        functionName: 'latestRoundData',
      })) as any;
      setEthPrice(price);
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleConfirm = async () => {
    await deposit(address as Address, longAmount, shortAmount);
    // handleCloseModal();
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
      const response = await fetch('http://localhost:3001/stub', {
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

  if (!isConnected || !address) {
    return (
      <div>
        <Header />
        <div className="flex min-h-screen w-full items-center justify-center">
          <h2>Please connect your wallet</h2>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="flex min-h-screen w-full flex-col justify-between">
        <div className="flex min-h-screen w-full flex-1">
          <div className="flex flex-1 items-center justify-center">
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="mb-4 text-lg font-semibold text-white">Enter Deposit Amount</h2>
                <input
                  type="number"
                  value={amount}
                  onChange={onChange}
                  className="mb-4 w-full rounded border bg-gray-900 p-2 text-white"
                  placeholder="Amount in ETH"
                />
                {
                  <div className="mb-4">
                    <label className="mb-2 block text-white">
                      Long:{' '}
                      {longAmount
                        ? `${Number(longAmount).toFixed(4)} ETH ~ $${(Number(longAmount) * Number(formatUnits(ethPrice, 8))).toFixed(2)}`
                        : '---'}
                    </label>
                    <label className="mb-2 block text-white">
                      Short:{' '}
                      {shortAmount
                        ? `${Number(shortAmount).toFixed(4)} ETH ~ $${(Number(shortAmount) * Number(formatUnits(ethPrice, 8))).toFixed(2)}`
                        : '---'}
                    </label>
                  </div>
                }
                <Button variant="outline" onClick={calculate} className="mr-4">
                  Calculate
                </Button>
                <Button variant="outline" onClick={handleConfirm}>
                  Confirm
                </Button>
              </div>
              <Button variant="outline" onClick={async () => await withdraw(address)}>
                Withdraw
              </Button>
            </div>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <APYChart yearlyAPY={aby} />
          </div>
        </div>
        <div className="m-5">
          {/* @ts-ignore */}
          <DebugWindow dsProxy={dsPrxoy} readShortPosition={readShortPosition} />
        </div>
      </div>
    </>
  );
};
