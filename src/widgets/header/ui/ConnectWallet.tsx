import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect } from 'react';
import { useAccount, useAccountEffect, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { useReadContract } from 'wagmi';
import dsProxyFactory from '../../../shared/abi/ds-proxy-factory.json'; //TODO: need make import throught @ and think about consider convsivration for name file 
import { isZeroAddress } from '@/shared/lib/isZeroAddress';


export const ConnectWallet = () => {
  //TODO: maybe this logic can move another global file upper than header component

  const { address } = useAccount();

  const { data: dsPrxoyAddress, isPending, refetch } = useReadContract({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    address: dsProxyFactory.adress, 
    abi: dsProxyFactory.abi,
    functionName: 'getProxyByOwner',
    args: [address],
  });

  const { data: hash, writeContract } = useWriteContract();

  useAccountEffect({
    onConnect(data) {
      refetch();
      console.log('Connected!', data)
    },
  })

  useEffect(() => {
    const isDsProxyAdd = dsPrxoyAddress && !isZeroAddress(dsPrxoyAddress)
      
    console.log(isDsProxyAdd);
    

    if (!isPending && !isDsProxyAdd && !isConfirming) {
      writeContract({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        address: dsProxyFactory.adress, 
        abi: dsProxyFactory.abi,
        functionName: 'build',
      })
    }

    if (!isDsProxyAdd && isConfirmed) {
      refetch();
    }

    if (isDsProxyAdd) {
      console.log('useEeffect dsPrxoyAddress', dsPrxoyAddress);
      localStorage.setItem('ds_proxy', dsPrxoyAddress as string)
      // const dsProxy = localStorage.getItem('getProxyByOwner'); // use query-tanstack. Think need localstorage and can  query-tanstack state use localstorage?
    }
  }, [isPending, dsPrxoyAddress]);


  const { isLoading: isConfirming, isSuccess: isConfirmed } =
  useWaitForTransactionReceipt({
    hash,
  });


  return (
    <>
      <ConnectButton showBalance={false} />
    </>
  );
};
