import { isAddress } from "viem";

export const isZeroAddress = (address: any) => {
    return isAddress(address) && address === '0x0000000000000000000000000000000000000000';
  };