import { createContext, useContext, useEffect, useState } from 'react';
import coin from '../../../assets/coin.png';

const NetworkAssetContext = createContext(null);

const assets = [
  {
    name: 'AGA COIN 1',
    amount: 10000000,
    network: 'AGA',
    icon: coin,
    amountConversion: 1000,
  },
  {
    name: 'AGA COIN 2',
    amount: 10000000,
    network: 'AGA',
    icon: coin,
    amountConversion: 1000,
  },
  {
    name: 'AGA COIN 3',
    amount: 10000000,
    network: 'AGA',
    icon: coin,
    amountConversion: 1000,
  },
];

export const NetworkAssetContextProvider = ({ children }) => {
  const [networkAssets, updateNetworkAssets] = useState([]);

  useEffect(() => {
    updateNetworkAssets(assets);
  }, []);

  return (
    <NetworkAssetContext.Provider value={{ networkAssets, updateNetworkAssets }}>
      {children}
    </NetworkAssetContext.Provider>
  );
};

export const useNetworkAssets = () => useContext(NetworkAssetContext);
