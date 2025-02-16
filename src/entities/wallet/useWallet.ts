import { useEffect, useState } from "react";
import { UseWalletClientReturnType, useAccount, useConnectorClient, useWalletClient } from "wagmi";
import { DsProxy } from "../ds-proxy/ds-proxy";

export type WalletClient = UseWalletClientReturnType["data"];

export default function useWallet() {
    const { address, isConnected, connector, chainId } = useAccount();
    const { data: connectorClient } = useConnectorClient();
    const { data: walletClient } = useWalletClient();

    const [dsProxyAddress, setDsProxyAddress] = useState<string>('');

    useEffect(() => {
        if (!isConnected || !address) return;

        const storedProxy = localStorage.getItem('ds_proxy');
        if (storedProxy) {
            setDsProxyAddress(storedProxy);
            return;
        }

        const readDsProxy = async () => {
            let proxyAddress: string | null = await DsProxy.read(address) as string | null;

            if (!proxyAddress) {
                //@ts-ignore
                proxyAddress = await DsProxy.build(address)
            }

            localStorage.setItem('ds_proxy', proxyAddress);
            setDsProxyAddress(proxyAddress);
        }


        readDsProxy().catch((e)=>{ 
            console.log('eee', e)
        })


        
    }, [isConnected, address]);


    return {
        account: address,
        active: isConnected,
        connector: connector!,
        chainId: chainId,
        connectorClient,
        walletClient,
        dsProxyAddress,
    };
}