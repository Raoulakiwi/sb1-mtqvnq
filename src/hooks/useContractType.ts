import { useContractRead } from 'wagmi';
import { ERC165_ABI, INTERFACE_IDS } from '../constants';
import { isAddress, type Address } from 'viem';
import { ContractType } from '../types';

export const useContractType = (contractAddress: string) => {
  const { data: isERC721 } = useContractRead({
    address: contractAddress as Address,
    abi: ERC165_ABI,
    functionName: 'supportsInterface',
    args: [INTERFACE_IDS.ERC721],
    enabled: Boolean(contractAddress && isAddress(contractAddress)),
  });

  const { data: isERC1155 } = useContractRead({
    address: contractAddress as Address,
    abi: ERC165_ABI,
    functionName: 'supportsInterface',
    args: [INTERFACE_IDS.ERC1155],
    enabled: Boolean(contractAddress && isAddress(contractAddress)),
  });

  const getContractType = (): ContractType | null => {
    if (isERC721) return 'ERC721';
    if (isERC1155) return 'ERC1155';
    return null;
  };

  return {
    isERC721,
    isERC1155,
    contractType: getContractType()
  };
};