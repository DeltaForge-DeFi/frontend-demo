import { encodeAbiParameters, encodeFunctionData, parseEther } from 'viem';
import { DAI, DS_PROXY, dsProxyExecute, TOKEN_ABI, WETH } from './openLooping';

async function main() {
  console.log('START MAIN');
  const initialAmount = parseEther('0.0001');

  console.log('APPROVE WETH FOR DS PROXY');
  const requestApproveWETH = await walletClient.prepareTransactionRequest({
    to: WETH,
    value: 0n,
    gas: 2000000n,
    data: encodeFunctionData({
      abi: TOKEN_ABI,
      functionName: 'approve',
      args: [DS_PROXY, parseEther('0.0015')],
    }),
  });
  const signedTxApproveWETH = await walletClient.signTransaction(requestApproveWETH);
  await publicClient.sendRawTransaction({
    serializedTransaction: signedTxApproveWETH,
  });

  console.log('APPROVE DAI FOR DS PROXY');
  const daiAmount = parseEther('0.1'); // 3 цикла по 0.01 DAI
  const requestApproveDAIForDsProxy = await walletClient.prepareTransactionRequest({
    to: DAI,
    value: 0n,
    gas: 2000000n,
    data: encodeFunctionData({
      abi: TOKEN_ABI,
      functionName: 'approve',
      args: [DS_PROXY, daiAmount],
    }),
  });
  const signedTxForDsProxy = await walletClient.signTransaction(requestApproveDAIForDsProxy);
  await publicClient.sendRawTransaction({
    serializedTransaction: signedTxForDsProxy,
  });

  console.log('execute contract');
  const callData = encodeAbiParameters(
    [
      { name: 'initialSupplyAmount', type: 'uint256' },
      { name: 'borrowPercent', type: 'uint256' },
      { name: 'cycles', type: 'uint8' },
    ],
    [
      initialAmount,
      BigInt(20), //60% от депозита
      2,
    ],
  );

  const executeData = encodeFunctionData({
    abi: AAVE_OPEN_LOOPING_ABI,
    functionName: 'executeActionDirect',
    args: [callData],
  });

  await dsProxyExecute(AAVE_OPEN_LOOPING_CONTRACT, executeData).catch((e) => {
    throw e;
  });

  console.log('END MAIN');
}

(async () => {
  main();
})();

export const AAVE_OPEN_LOOPING_CONTRACT = '0x6793FED04eD24452E2754e88911E796821296aCc';

export const AAVE_OPEN_LOOPING_ABI = [
  {
    inputs: [],
    name: 'NonContractCall',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ReturnIndexValueError',
    type: 'error',
  },
  {
    inputs: [],
    name: 'SenderNotAdmin',
    type: 'error',
  },
  {
    inputs: [],
    name: 'SenderNotOwner',
    type: 'error',
  },
  {
    inputs: [],
    name: 'SubIndexValueError',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'string',
        name: 'logName',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'ActionEvent',
    type: 'event',
  },
  {
    inputs: [],
    name: 'AAVE_REFERRAL_CODE',
    outputs: [
      {
        internalType: 'uint16',
        name: '',
        type: 'uint16',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'NO_PARAM_MAPPING',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'RETURN_MAX_INDEX_VALUE',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'RETURN_MIN_INDEX_VALUE',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'SUB_MAX_INDEX_VALUE',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'SUB_MIN_INDEX_VALUE',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'actionType',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [],
    name: 'adminData',
    outputs: [
      {
        internalType: 'contract AdminData',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: '_callData',
        type: 'bytes',
      },
      {
        internalType: 'bytes32[]',
        name: '_subdata',
        type: 'bytes32[]',
      },
      {
        internalType: 'uint8[]',
        name: '_paramMapping',
        type: 'uint8[]',
      },
      {
        internalType: 'bytes32[]',
        name: '_returnValues',
        type: 'bytes32[]',
      },
    ],
    name: 'executeAction',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: '_callData',
        type: 'bytes',
      },
    ],
    name: 'executeActionDirect',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_proxy',
        type: 'address',
      },
    ],
    name: 'isDSProxy',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'kill',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'logger',
    outputs: [
      {
        internalType: 'contract DefisaverLogger',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'registry',
    outputs: [
      {
        internalType: 'contract DFSRegistry',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_token',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_receiver',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
    ],
    name: 'withdrawStuckFunds',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
