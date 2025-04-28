import { useEffect, useState } from "react";
import { UseWalletClientReturnType, useAccount, useConnectorClient, useSwitchChain, useWalletClient } from "wagmi";
import { DsProxy } from "../ds-proxy/ds-proxy";
import { Address, isAddress } from "viem";
import { isZeroAddress } from "@/shared/lib/isZeroAddress";
import { arbitrum } from "viem/chains";

export type WalletClient = UseWalletClientReturnType["data"];

export default function useWallet() {
    const { address, isConnected, connector, chainId } = useAccount();
    const { data: connectorClient } = useConnectorClient();
    const { data: walletClient } = useWalletClient();
    const { switchChain } = useSwitchChain();

    const [dsProxyAddress, setDsProxyAddress] = useState<Address | null>(null);

    useEffect(() => {
        if (!isConnected || !address) {
            setDsProxyAddress(null);
            return;
        }

        if (chainId !== arbitrum.id) {
            switchChain({ chainId: arbitrum.id });
            return;
        }

        const storedProxy = localStorage.getItem(`ds_proxy_${address}`);
        if (storedProxy && isAddress(storedProxy)) {
            setDsProxyAddress(storedProxy as Address);
            return;
        }

        const readDsProxy = async () => {
            let proxyAddress: string | null = await DsProxy.read(address) as string | null;

            if (!proxyAddress || isZeroAddress(proxyAddress)) {
                await DsProxy.build(address)
                proxyAddress = await DsProxy.read(address) as string;
            }

            localStorage.setItem(`ds_proxy_${address}`, proxyAddress);
            setDsProxyAddress(proxyAddress as Address);
        }

        readDsProxy().catch((e)=>{ 
            console.log('readDS proxy error', e)
        })
    }, [isConnected, address, chainId, switchChain]);


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