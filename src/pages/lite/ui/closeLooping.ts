import { Address, formatEther, formatUnits, encodeAbiParameters, zeroAddress, encodeFunctionData, parseEther } from 'viem';

import { DAI, DS_PROXY, dsProxyExecute, TOKEN_ABI, uniswap, UNISWAP_ROUTER_ADDRESS, WETH } from './openLooping';
import { publicClient, walletClient } from '@/shared/config/wagmi.config';

const userAddress = '0x25c3fb5C057E5886Db05EA5852A9C64c713ab09E';

export const closeLooping = async () => {
  //@ts-ignore
  const cycles = 1;
  const rateMode = 2;
  const minHealthFactor = 1.05;

  // GET pool
  const pool = (await publicClient.readContract({
    address: AAVE_DATA_PROVIDER_ADDRESS,
    abi: AAVE_DATA_PROVIDER_ABI,
    functionName: 'getPool',
  })) as unknown as Address;

  const POOL_ADDRESS = pool as Address;

  console.log('POOL_ADDRESS', POOL_ADDRESS);

  for (let index = 0; index < 1; index++) {
    console.log(`Cycle ${index}`);

    const [totalCollateralBase, totalDebtBase, availableBorrowsBase, currentLiquidationThreshold, ltv, healthFactor] =
      (await publicClient.readContract({
        address: POOL_ADDRESS,
        abi: AAVE_POOL_ABI,
        functionName: 'getUserAccountData',
        args: [DS_PROXY],
      })) as any;

    console.log('availableBorrowsBase', availableBorrowsBase, 'ltv', ltv);

    console.log('Текущий коллатерал:', formatUnits(totalCollateralBase, 18));
    console.log('Текущий долг:', formatUnits(totalDebtBase, 18));
    console.log('Текущий Health Factor:', formatUnits(healthFactor, 18));

    if (totalDebtBase === BigInt(0)) {
      console.log('Долг полностью погашен');
      break;
    }

    const { withdrawAmount, swapAmount } = await calculateSafeWithdrawAmount({
      totalCollateral: totalCollateralBase,
      totalDebt: totalDebtBase,
      liquidationThreshold: currentLiquidationThreshold,
      minHealthFactor,
    });

    if (withdrawAmount <= BigInt(0)) {
      console.log('Невозможно безопасно вывести коллатерал');
      break;
    }

    console.log('Выводим WETH:', formatEther(withdrawAmount));

    const [executeContractWithdraw, executeDataWithdraw] = await withdraw({
      amount: withdrawAmount,
      assetId: 4,
      useDefaultMarket: true,
      to: userAddress,
      market: zeroAddress,
    }).catch((error) => {
      console.error('Ошибка при подготовке withdraw:', error);
      throw error;
    });

    // добавить ождание транзакции

    dsProxyExecute(executeContractWithdraw, executeDataWithdraw).catch((error) => {
      console.error('Ошибка при выполнении withdraw через DSProxy:', error);
      throw error;
    });

    console.log('Свапаем WETH в DAI через Uniswap');

    ////////
    await walletClient.writeContract({
      address: WETH,
      abi: TOKEN_ABI,
      functionName: 'approve',
      args: [UNISWAP_ROUTER_ADDRESS, swapAmount],
      account: userAddress,
      value: 0n,
    });
    ///////////////////

    await uniswap({
      tokenIn: WETH,
      tokenOut: DAI,
      fee: 500,
      recipient: userAddress,
      deadline: BigInt(Math.floor(Date.now() / 1000) + 1800),
      amountIn: swapAmount, //change
      amountOutMinimum: 0n,
      sqrtPriceLimitX96: 0n,
    });

    // добавить ождание транзакции
    const daiAmount = totalDebtBase;
    console.log(`6. Погашаем долг в DAI ${formatEther(daiAmount)}`);

    const [executeContractPayback, executeDataPayback] = await aavePayback({
      amount: parseEther('0.5'),
      from: userAddress,
      rateMode: rateMode,
      assetId: 0,
      useDefaultMarket: true,
      useOnBehalf: false,
      market: zeroAddress,
      onBehalf: zeroAddress,
    });

    dsProxyExecute(executeContractPayback, executeDataPayback).catch((error) => {
      console.error('Ошибка при выполнении payback через DSProxy:', error);
      throw error;
    });

    console.log(`Погашено DAI: ${formatEther(daiAmount)}`);
  }
};

const withdraw = async (params: { assetId: number; useDefaultMarket: boolean; amount: bigint; to: Address; market: Address }) => {
  // Кодируем параметры для вызова executeActionDirect
  const encodedParams = encodeAbiParameters(
    [
      { name: 'assetId', type: 'uint16' },
      { name: 'useDefaultMarket', type: 'bool' },
      { name: 'amount', type: 'uint256' },
      { name: 'to', type: 'address' },
      { name: 'market', type: 'address' },
    ],
    [params.assetId, params.useDefaultMarket, params.amount, params.to, params.market],
  );

  // Кодируем вызов executeActionDirect
  const executeData = encodeFunctionData({
    abi: AAVE_WITHDRAW_ABI,
    functionName: 'executeActionDirect',
    args: [encodedParams],
  });

  return [AAVE_WITHDRAW_ADDRESS, executeData];
};

const aavePayback = async (params: {
  amount: bigint;
  from: Address;
  rateMode: number;
  assetId: number;
  useDefaultMarket: boolean;
  useOnBehalf: boolean;
  market: Address;
  onBehalf: Address;
}) => {
  const encodedParams = encodeAbiParameters(
    [
      {
        name: 'params',
        type: 'tuple',
        components: [
          { name: 'amount', type: 'uint256' },
          { name: 'from', type: 'address' },
          { name: 'rateMode', type: 'uint8' },
          { name: 'assetId', type: 'uint16' },
          { name: 'useDefaultMarket', type: 'bool' },
          { name: 'useOnBehalf', type: 'bool' },
          { name: 'market', type: 'address' },
          { name: 'onBehalf', type: 'address' },
        ],
      },
    ],
    [
      {
        amount: params.amount,
        from: params.from,
        rateMode: params.rateMode,
        assetId: params.assetId,
        useDefaultMarket: params.useDefaultMarket,
        useOnBehalf: params.useOnBehalf,
        market: params.market,
        onBehalf: params.onBehalf,
      },
    ],
  );

  const executeData = encodeFunctionData({
    abi: AAVE_PAYBACK_ABI,
    functionName: 'executeActionDirect',
    args: [encodedParams],
  });

  return [AAVE_PAYBACK_GATEWAY, executeData];
};

const calculateSafeWithdrawAmount = async (params: {
  totalCollateral: bigint; // в USD с 8 decimals
  totalDebt: bigint; // в USD с 8 decimals
  liquidationThreshold: bigint;
  minHealthFactor: number;
}): Promise<{ withdrawAmount: bigint; swapAmount: bigint }> => {
  const [_, ethPrice] = (await publicClient.readContract({
    address: CHAINLINK_ETH_USD_FEED,
    abi: CHAINLINK_FEED_ABI,
    functionName: 'latestRoundData',
  })) as any;

  console.log(formatUnits(ethPrice, 8)); // цена ETH в USD с 8 decimals

  // 1. Рассчитываем максимально возможный вывод в USD
  const requiredCollateralUsd = (params.totalDebt * BigInt(Math.floor(params.minHealthFactor * 100)) * BigInt(100)) / params.liquidationThreshold;
  const maxWithdrawUsd = params.totalCollateral > requiredCollateralUsd ? params.totalCollateral - requiredCollateralUsd : BigInt(0);

  // 2. Определяем сколько нужно свапнуть в USD
  const swapAmountUsd = maxWithdrawUsd < params.totalDebt ? maxWithdrawUsd : params.totalDebt;

  // 3. Конвертируем суммы в ETH для вывода и свапа
  const withdrawAmountEth = (maxWithdrawUsd * BigInt(1e18)) / BigInt(ethPrice);
  const swapAmountEth = (swapAmountUsd * BigInt(1e18)) / BigInt(ethPrice);

  console.log('Текущий коллатерал (USD):', formatUnits(params.totalCollateral, 8));
  console.log('Текущий долг (USD):', formatUnits(params.totalDebt, 8));
  console.log('Цена ETH (USD):', formatUnits(ethPrice, 8));
  console.log('Можно вывести (USD):', formatUnits(maxWithdrawUsd, 8));
  console.log('Нужно свапнуть (USD):', formatUnits(swapAmountUsd, 8));
  console.log('Выводим ETH:', formatEther(withdrawAmountEth));
  console.log('Свапаем ETH:', formatEther(swapAmountEth));

  return {
    withdrawAmount: withdrawAmountEth,
    swapAmount: swapAmountEth,
  };
};

export const AAVE_DATA_PROVIDER_ADDRESS = '0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb' as Address;
export const AAVE_DATA_PROVIDER_ABI = [
  {
    type: 'function',
    name: 'getPool',
    constant: false,
    anonymous: false,
    stateMutability: 'view',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        storage_location: 'default',
        offset: 0,
        index: '0x0000000000000000000000000000000000000000000000000000000000000000',
        indexed: false,
        simple_type: { type: 'address' },
      },
    ],
  },
];

// Я не понимаю откуда достали этот ABI
export const AAVE_POOL_ABI = [
  {
    type: 'function',
    name: 'getUserAccountData',
    inputs: [
      {
        name: 'user',
        type: 'address',
      },
    ],
    outputs: [
      {
        name: 'totalCollateralBase',
        type: 'uint256',
      },
      {
        name: 'totalDebtBase',
        type: 'uint256',
      },
      {
        name: 'availableBorrowsBase',
        type: 'uint256',
      },
      {
        name: 'currentLiquidationThreshold',
        type: 'uint256',
      },
      {
        name: 'ltv',
        type: 'uint256',
      },
      {
        name: 'healthFactor',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
];

const AAVE_WITHDRAW_ADDRESS = '0x570BfB7A185EFa93d54b06348a9eB69F6bd94ec3' as Address;
const AAVE_WITHDRAW_ABI = [
  {
    inputs: [{ internalType: 'bytes', name: '_callData', type: 'bytes' }],
    name: 'executeActionDirect',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
];

const AAVE_PAYBACK_GATEWAY = '0xa87756d654e2fdd980C385e0D6f28b534cAf662e' as Address;
const AAVE_PAYBACK_ABI = [
  {
    inputs: [{ internalType: 'bytes', name: '_callData', type: 'bytes' }],
    name: 'executeActionDirect',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
];

export const CHAINLINK_ETH_USD_FEED = '0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612';
export const CHAINLINK_FEED_ABI = [
  {
    type: 'function',
    name: 'latestRoundData',
    constant: false,
    anonymous: false,
    stateMutability: 'view',
    inputs: [],
    outputs: [
      {
        name: 'roundId',
        type: 'uint80',
        storage_location: 'default',
        offset: 0,
        index: '0x0000000000000000000000000000000000000000000000000000000000000000',
        indexed: false,
        simple_type: { type: 'uint' },
      },
      {
        name: 'answer',
        type: 'int256',
        storage_location: 'default',
        offset: 0,
        index: '0x0000000000000000000000000000000000000000000000000000000000000000',
        indexed: false,
        simple_type: { type: 'int' },
      },
      {
        name: 'startedAt',
        type: 'uint256',
        storage_location: 'default',
        offset: 0,
        index: '0x0000000000000000000000000000000000000000000000000000000000000000',
        indexed: false,
        simple_type: { type: 'uint' },
      },
      {
        name: 'updatedAt',
        type: 'uint256',
        storage_location: 'default',
        offset: 0,
        index: '0x0000000000000000000000000000000000000000000000000000000000000000',
        indexed: false,
        simple_type: { type: 'uint' },
      },
      {
        name: 'answeredInRound',
        type: 'uint80',
        storage_location: 'default',
        offset: 0,
        index: '0x0000000000000000000000000000000000000000000000000000000000000000',
        indexed: false,
        simple_type: { type: 'uint' },
      },
    ],
  },
];
