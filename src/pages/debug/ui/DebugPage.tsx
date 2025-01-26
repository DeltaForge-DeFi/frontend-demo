import { useAccount } from 'wagmi';
import { Header } from '@/widgets/header';
import { Button } from '@/shared/ui/Button';


import { useEffect, useState } from 'react';
import { openLooping } from '../../lite/ui/openLooping';
import { closeLooping } from '../../lite/ui/closeLooping';



export const DebugPage = () => {
  const { isConnected, address } = useAccount();
  const [dsProxy, setDsProxy] = useState('');

  console.log(dsProxy);

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
            <Button variant="outline" onClick={async () => await openLooping()}>
              open
            </Button>
            <Button className="disabled:opacity-75" variant="outline" onClick={async () => await closeLooping()}>
              close
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
