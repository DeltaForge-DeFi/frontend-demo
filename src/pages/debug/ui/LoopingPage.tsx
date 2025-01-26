import { useAccount } from 'wagmi';
import { publicClient, walletClient } from '@/shared/config/wagmi.config';
import { encodeAbiParameters, parseEther, encodeFunctionData } from 'viem';
import { Header } from '@/widgets/header';
import { Button } from '@/shared/ui/Button';
import weth from '@/shared/abi/weth.json';
import dsProxyJson from '@/shared/abi/ds-proxy.json';
import aaveDeposit from '../../../shared/abi/aave-deposit.json'
import aaveBorrow from '@/shared/abi/aave-borrow.json'
import daiAbiJson from '@/shared/abi/dai-abi.json'
import wethAbiJson from '@/shared/abi/weth-abi.json'
import uniswapRouterAbi from '@/shared/abi/uniswap-router-abi.json'
import { useEffect, useState } from 'react';

const AAVE_BORROW_CONTRACT = '0x89D9fcb5abe53fb0751a564C45cd23B3011058F7'
const AAVE_SUPPLY_CONTRACT = '0x755d8133E1688b071Ec4ac73220eF7f70BC6992F'
const UNISWAP_ROUTER_ADDRESS = "0xE592427A0AEce92De3Edee1F18E0157C05861564";
const WETH = '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1';
const DAI = '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1';


    //@ts-ignore
async function approveDai(address: `0x${string}`, dsProxyAddress: `0x${string}`) {
  const daiAbi = daiAbiJson.abi;
  const ownerAddress = address;

  const currentAllowance = await publicClient.readContract({
    address: DAI,
    abi: daiAbi,
    functionName: 'allowance',
    args: [ownerAddress, dsProxyAddress],
  });
  console.log(`Текущий allowance: ${currentAllowance}`);

  // @ts-ignore
  const { request } = await walletClient.writeContract({
    address: DAI,
    abi: daiAbi,
    functionName: 'approve',
    args: ["0xE592427A0AEce92De3Edee1F18E0157C05861564", parseEther('10')],
    account: ownerAddress,
  });
  
  console.log('Транзакция отправлена:', request);
}

async function approveWeth(address: `0x${string}`) {
  const wethAbi = wethAbiJson.abi
  const dsProxyAddress = '0x9fCE7636153ea1085de245d6F6123248519813E1';
  const requiredAllowance = parseEther('0.015');
  const currentAllowance = await publicClient.readContract({
    address: WETH,
    abi: wethAbi,
    functionName: 'allowance',
    args: [address, dsProxyAddress],
  });

      //@ts-ignore
  console.log('Текущий allowance:', currentAllowance.toString());
      //@ts-ignore
  const { request } = await walletClient.simulateContract({
    address: WETH,
    abi: wethAbi,
    functionName: 'approve',
    args: [dsProxyAddress, requiredAllowance],
    account: address,
  });
  const hash = await walletClient.writeContract(request);
  console.log('Транзакция отправлена, hash:', hash);
}

async function depositDsProxy(address: `0x${string}`) {
  const dsProxy = localStorage.getItem('ds_proxy') as `0x${string}`;
  const amount = parseEther('0.00015');

  console.log('Depositing ETH to DSProxy...');
  // Transfer ETH to WETH contract
  const hash = await walletClient.sendTransaction({
    account: address as `0x${string}`,
    to: weth.address as `0x${string}`,
    value: amount,
  });
  await publicClient.waitForTransactionReceipt({ hash });
  // Approve WETH for the dsProxy
  const approveHash = await walletClient.writeContract({
    address: weth.address as `0x${string}`,
    abi: weth.abi,
    functionName: 'approve',
    args: [dsProxy, amount],
    account: address as `0x${string}`,
  });
  await publicClient.waitForTransactionReceipt({ hash: approveHash });
  approveWeth(address as `0x${string}`); // после того как закинул weth на dsProxy делаем сразу апрув
}

async function deposit(address: `0x${string}`) {
  const dsProxy = localStorage.getItem('ds_proxy') as `0x${string}`;

  const depositCallData = encodeAbiParameters(
    [
      { name: 'amount', type: 'uint256' },
      { name: 'from', type: 'address' },
      { name: 'assetId', type: 'uint16' },
      { name: 'enableAsColl', type: 'bool' },
      { name: 'useDefaultMarket', type: 'bool' },
      { name: 'useOnBehalf', type: 'bool' },
      { name: 'market', type: 'address' },
      { name: 'onBehalf', type: 'address' },
    ],
    [
      parseEther('0.0001'),
      address,
      4, //WETH
      false,
      true,
      false,
      '0x0000000000000000000000000000000000000000',
      '0x0000000000000000000000000000000000000000',
    ],
  );
  console.log(depositCallData);

  const encodedData = encodeFunctionData({
    abi: aaveDeposit.abi,
    functionName: 'executeActionDirect',
    args: [depositCallData],
  });
  const hash = await walletClient.writeContract({
    address: dsProxy as `0x${string}`, // почему тут dsProxy? Потому что через dsProxy deposit на aave
    abi: dsProxyJson.abi,
    functionName: 'execute',
    args: [AAVE_SUPPLY_CONTRACT, encodedData],
    value: parseEther('0.0001'), // эти 2 параметра откуда взялись? с функции execute
    account: address as `0x${string}`,
  });
  await publicClient.waitForTransactionReceipt({ hash });
  console.log(hash);
}

async function borrowDai(address: `0x${string}`) {
  const dsProxy = localStorage.getItem('ds_proxy') as `0x${string}`;
  const etherAmount = parseEther('0.0001');
  const borrowAmount = (etherAmount * BigInt(75)) / BigInt(100);

  const borrowCallData = encodeAbiParameters(
    [
      { name: 'amount', type: 'uint256' },
      { name: 'to', type: 'address' },
      { name: 'rateMode', type: 'uint8' },
      { name: 'assetId', type: 'uint16' },
      { name: 'useDefaultMarket', type: 'bool' },
      { name: 'useOnBehalf', type: 'bool' },
      { name: 'market', type: 'address' },
      { name: 'onBehalf', type: 'address' },
    ],
    [
      borrowAmount,
      address,
      2, // в rateMode c executeLoop захардкодил
      0,
      true,
      false,
      '0x0000000000000000000000000000000000000000',
      '0x0000000000000000000000000000000000000000',
    ],
  );

  console.log(borrowCallData);

  const encodedData = encodeFunctionData({
    abi: aaveBorrow.abi,
    functionName: 'executeActionDirect',
    args: [borrowCallData],
  });

  const hash = await walletClient.writeContract({
    address: dsProxy as `0x${string}`,
    abi: dsProxyJson.abi,
    functionName: 'execute',
    args: [AAVE_BORROW_CONTRACT, encodedData],
    value: borrowAmount,
    account: address as `0x${string}`,
  });

  await publicClient.waitForTransactionReceipt({ hash });
  console.log(hash);
}

async function swapDaiToEth(address: `0x${string}`) {
      //@ts-ignore
  const dsProxy = localStorage.getItem('ds_proxy') as `0x${string}`; // при свапе с дс-прокси не взаимодействуем (он не нужен получается)
  const borrowAmount =  parseEther('0.0001');

  const swapCallData = encodeAbiParameters(
    [
      {
        type: 'tuple',
        components: [
          { name: 'tokenIn', type: 'address' },
          { name: 'tokenOut', type: 'address' },
          { name: 'fee', type: 'uint24' },
          { name: 'recipient', type: 'address' },
          { name: 'deadline', type: 'uint256' },
          { name: 'amountIn', type: 'uint256' },
          { name: 'amountOutMinimum', type: 'uint256' },
          { name: 'sqrtPriceLimitX96', type: 'uint160' }
        ]
      }
    ],
    [{
      tokenIn: DAI,
      tokenOut: WETH,
      fee: 500,
      recipient: address,
      deadline: BigInt(Math.floor(Date.now() / 1000) + 1800),
      amountIn: borrowAmount,
      amountOutMinimum: 0n,
      sqrtPriceLimitX96: 0n
    }]
  );

  const UNISWAP_ROUTER_ABI = uniswapRouterAbi.abi

  const hash = await walletClient.writeContract({
    address: UNISWAP_ROUTER_ADDRESS as `0x${string}`,
    abi: UNISWAP_ROUTER_ABI,
    functionName: 'exactInputSingle',
    args: [swapCallData],
    account: address as `0x${string}`,
    gas: 3000000n,
    value: borrowAmount,
  });

  await publicClient.waitForTransactionReceipt({ hash });

  console.log(hash);
}

    //@ts-ignore
const readLoopingPosition = async (address: `0x${string}`) => {
      //@ts-ignore
  const dsProxy = localStorage.getItem('ds_proxy') as `0x${string}`;
  // понять какие данные прокидываются для чтения данных лупинга, и выводить в консоль хотя бы, для начала
};

export const LoopingPage = () => {
  const { isConnected, address } = useAccount();
      //@ts-ignore
  const [dsProxy, setDsProxy] = useState('');
  useEffect(() => {
    const dsProxy = localStorage.getItem('ds_proxy') as `0x${string}`;
    setDsProxy(dsProxy || '');
  }, []);
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
        <div className="flex min-h-screen w-full flex-1 items-center justify-center">
          <div className="flex gap-5">
            <Button variant="outline" onClick={async () => await depositDsProxy(address)}>
              depositDsProxy
            </Button>
            <Button variant="outline" onClick={async () => await deposit(address)}>
              deposit
            </Button>
            <Button variant="outline" onClick={async () => await borrowDai(address)}>
              borrowDai
            </Button>
            <Button variant="outline" onClick={async () => await swapDaiToEth(address)}>
              swapDaiToEth
            </Button>
            {/*  @ts-ignore */}
            <Button className="disabled:opacity-75" variant="outline" onClick={async () => await withdraw(address)} disabled>
              withdraw
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
