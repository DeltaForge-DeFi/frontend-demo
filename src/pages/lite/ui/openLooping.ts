import {
  parseEther,
  zeroAddress,
  encodeAbiParameters,
  Address,
  encodeFunctionData,
  formatEther,
} from 'viem';
import { publicClient, walletClient } from '@/shared/config/wagmi.config';

const userAddress = '0x25c3fb5C057E5886Db05EA5852A9C64c713ab09E';

export async function openLooping(amount: string) {
  const initialAmount = parseEther(amount);
  const borrowRatio = 60000; // Занимаем 60% от депозита
  //@ts-ignore
  const cycles = 3;
  const rateMode = 2;

  // ETH balance before operations
  const wethBalance = await publicClient.getBalance({
    address: userAddress,
  });
  console.log('Initial WETH balance:', formatEther(wethBalance), 'ETH');

  await tokenInfo(WETH, 'WETH');
  await tokenInfo(DAI, 'DAI');

  console.log('Шаг 1: Депозит в WETH');
  const [executeContract, executeData] = supply({
    amount: initialAmount,
    from: userAddress,
    assetId: 4, // WETH
    enableAsColl: false,
    useDefaultMarket: true,
    useOnBehalf: false,
    onBehalf: userAddress,
    market: zeroAddress,
  });

  await dsProxyExecute(executeContract, executeData).catch((error) => {
    console.error('Ошибка supply ds proxy execute:', error);
    process.exit(1);
  });

  console.log('Начинаем цикл');
  for (let index = 0; index < 2; index++) {
    console.log(`Cycle ${index}`);
    const borrowAmount = (initialAmount * BigInt(borrowRatio)) / BigInt(100); //Понять зачем делим
    console.log('Borrow Amount', formatEther(borrowAmount), 'DAI');

    console.log('Шаг 2: Заём DAI');
    const [executeContractBorrow, executeDataBorrow] = await aaveBorrow({
      amount: borrowAmount,
      to: userAddress,
      rateMode: rateMode,
      assetId: 0, // DAI
      useDefaultMarket: true,
      useOnBehalf: false,
      market: zeroAddress,
      onBehalf: zeroAddress,
    }).catch((error) => {
      console.error('Ошибка borrow:', error);
      process.exit(1);
    });

    await dsProxyExecute(executeContractBorrow, executeDataBorrow).catch((error) => {
      console.error('Ошибка borrow ds proxy execute:', error);
      process.exit(1);
    });

    console.log('Шаг 3: Свап DAI в WETH');
    await uniswap({
      tokenIn: DAI,
      tokenOut: WETH,
      fee: 500,
      recipient: userAddress,
      deadline: BigInt(Math.floor(Date.now() / 1000) + 1800),
      amountIn: borrowAmount,
      amountOutMinimum: 0n,
      sqrtPriceLimitX96: 0n,
    }).catch((error) => {
      console.error('Ошибка uniswap:', error);
      process.exit(1);
    });

    console.log('Шаг 4: Депозит полученного WETH');
    const [executeContractSupply2, executeDataSupply2] = supply({
      amount: parseEther('0.0001'), //fix add dynamic
      from: userAddress,
      assetId: 4, // WETH
      enableAsColl: true, //понять что за параметр
      useDefaultMarket: true,
      useOnBehalf: false,
      onBehalf: userAddress,
      market: zeroAddress,
    });

    await dsProxyExecute(executeContractSupply2, executeDataSupply2).catch((error) => {
      console.error('Ошибка supply ds proxy execute:', error);
      process.exit(1);
    });
  }
}

/**
 * Executes token supply to Aave through DSProxy
 * @param client - Wallet client instance
 * @param params - Supply parameters including:
 *   - amount: Amount to supply
 *   - from: Source address
 *   - assetId: Asset identifier
 *   - enableAsColl: Enable as collateral
 *   - useDefaultMarket: Use default market flag
 *   - useOnBehalf: Use onBehalf flag
 *   - market: Market address
 *   - onBehalf: Beneficiary address
 */
const supply = (params: {
  amount: bigint;
  from: Address;
  assetId: number;
  enableAsColl: boolean;
  useDefaultMarket: boolean;
  useOnBehalf: boolean;
  market: Address;
  onBehalf: Address;
}) => {
  // Кодируем параметры supply
  const callData = encodeAbiParameters(
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
    [params.amount, params.from, params.assetId, params.enableAsColl, params.useDefaultMarket, params.useOnBehalf, params.market, params.onBehalf],
  );

  // Кодируем вызов executeActionDirect с закодированными параметрами
  const executeData = encodeFunctionData({
    abi: AAVE_SUPPLY_ABI,
    functionName: 'executeActionDirect',
    args: [callData],
  });

  return [AAVE_SUPPLY_CONTRACT, executeData];
};

// Занимаем DAI
const aaveBorrow = async (params: {
  amount: bigint;
  to: Address;
  rateMode: number;
  assetId: number;
  useDefaultMarket: boolean;
  useOnBehalf: boolean;
  market: Address;
  onBehalf: Address;
}) => {
  // Кодируем параметры для вызова executeActionDirect
  const callData = encodeAbiParameters(
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
    [params.amount, params.to, params.rateMode, params.assetId, params.useDefaultMarket, params.useOnBehalf, params.market, params.onBehalf],
  );

  // Кодируем вызов executeActionDirect с закодированными параметрами
  const executeData = encodeFunctionData({
    abi: AAVE_BORROW_ABI,
    functionName: 'executeActionDirect',
    args: [callData],
  });

  return [AAVE_BORROW_ADDRESS, executeData];
};

// Свап DAI в WETH
export const uniswap = async (params: {
  tokenIn: Address;
  tokenOut: Address;
  fee: number;
  recipient: Address;
  amountIn: bigint;
  amountOutMinimum: bigint;
  sqrtPriceLimitX96: bigint;
  deadline: bigint;
}) => {
  await walletClient.writeContract({
    address: UNISWAP_ROUTER_ADDRESS,
    abi: UNISWAP_ROUTER_ABI,
    functionName: 'exactInputSingle',
    args: [
      {
        tokenIn: params.tokenIn,
        tokenOut: params.tokenOut,
        fee: params.fee,
        recipient: params.recipient,
        deadline: params.deadline,
        amountIn: params.amountIn,
        amountOutMinimum: params.amountOutMinimum,
        sqrtPriceLimitX96: params.sqrtPriceLimitX96,
      },
    ],
    account: userAddress,
    value: 0n,
  });
};

const tokenInfo = async (TOKEN: Address, TOKEN_NAME: string) => {
  const balance = (await publicClient.readContract({
    address: TOKEN,
    abi: TOKEN_ABI,
    functionName: 'balanceOf',
    args: [userAddress],
  })) as unknown as bigint;

  console.log('balance', `${formatEther(balance)} ${TOKEN_NAME}`);

  const allowance = (await publicClient.readContract({
    address: TOKEN,
    abi: TOKEN_ABI,
    functionName: 'allowance',
    args: [userAddress, DS_PROXY],
  })) as unknown as bigint;

  console.log('allowance for ds proxy', `${formatEther(allowance)} ${TOKEN_NAME}`);
};

export const dsProxyExecute = async (executeContract: Address, executeData: Address) => {
  // Создаем запрос на выполнение транзакции

  await walletClient.writeContract({
    address: DS_PROXY as `0x${string}`,
    abi: DS_PROXY_ABI,
    functionName: 'execute',
    args: [executeContract, executeData],
    account: userAddress,
  }); 
};

export const WETH = '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1';
export const DAI = '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1';

export const TOKEN_ABI = [
  {
    constant: false,
    inputs: [
      { name: 'guy', type: 'address' },
      { name: 'wad', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ name: '', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      { name: '', type: 'address' },
      { name: '', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
];

export const DS_PROXY = '0x32fa5955d68F99856661D806192fB3185Ed61F05' as Address;
const DS_PROXY_ABI = [
  {
    inputs: [
      { type: 'address', name: 'target' },
      { type: 'bytes', name: 'data' },
    ],
    name: 'execute',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

const AAVE_SUPPLY_CONTRACT = '0x755d8133E1688b071Ec4ac73220eF7f70BC6992F' as Address;
const AAVE_SUPPLY_ABI = [
  {
    inputs: [{ type: 'bytes', name: 'data' }],
    name: 'executeActionDirect',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
];

const AAVE_BORROW_ADDRESS = '0x89D9fcb5abe53fb0751a564C45cd23B3011058F7' as Address;
const AAVE_BORROW_ABI = [
  {
    inputs: [{ internalType: 'bytes', name: '_callData', type: 'bytes' }],
    name: 'executeActionDirect',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
];

export const UNISWAP_ROUTER_ADDRESS = '0xE592427A0AEce92De3Edee1F18E0157C05861564' as Address;
const UNISWAP_ROUTER_ABI = [
  {
    inputs: [
      {
        components: [
          { name: 'tokenIn', type: 'address' },
          { name: 'tokenOut', type: 'address' },
          { name: 'fee', type: 'uint24' },
          { name: 'recipient', type: 'address' },
          { name: 'deadline', type: 'uint256' },
          { name: 'amountIn', type: 'uint256' },
          { name: 'amountOutMinimum', type: 'uint256' },
          { name: 'sqrtPriceLimitX96', type: 'uint160' },
        ],
        name: 'params',
        type: 'tuple',
      },
    ],
    name: 'exactInputSingle',
    outputs: [{ name: 'amountOut', type: 'uint256' }],
    stateMutability: 'payable',
    type: 'function',
  },
];
