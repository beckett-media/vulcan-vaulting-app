import { ChainId } from '@aave/contract-helpers';
import { useEffect, useState } from 'react';
import { getProvider } from '../../utils/networksConfig';

const mainnetProvider = getProvider(ChainId.mainnet);

interface EnsResponse {
  name?: string;
  avatar?: string;
}

const useGetEns = (address: string): EnsResponse => {
  const [ensName, setEnsName] = useState<string | undefined>(undefined);
  const [ensAvatar, setEnsAvatar] = useState<string | undefined>(undefined);
  const getName = async (address: string) => {
    try {
      const name = await mainnetProvider.lookupAddress(address);
      setEnsName(name ? name : undefined);
    } catch (error) {
      console.error('ENS name lookup error', error);
    }
  };

  useEffect(() => {
    if (address) {
      getName(address);
    } else {
      setEnsName(undefined);
    }
  }, [address]);

  return { name: ensName };
};

export default useGetEns;
