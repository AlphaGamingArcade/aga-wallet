import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

const WalletsContext = createContext(null);

export const WalletsContextProvider = ({ children }) => {
  const { getItem: getLocalStorageWallets } = useAsyncStorage('@AgaWallet_WALLETS');
  const [selectedWallet, updateSelectedWallet] = useState(null);
  const [wallets, updateWallets] = useState([]);

  const readWalletsFromStorage = async () => {
    const storageWallets = await getLocalStorageWallets();
    const parsedWallets = JSON.parse(storageWallets);
    updateWallets(parsedWallets);
    if (parsedWallets?.length > 0) {
      updateSelectedWallet(parsedWallets[0]);
    }
  };

  useEffect(() => {
    readWalletsFromStorage();
    return () => {};
  }, []);

  return (
    <WalletsContext.Provider
      value={{ wallets, updateWallets, selectedWallet, updateSelectedWallet }}
    >
      {children}
    </WalletsContext.Provider>
  );
};

export const useWallets = () => useContext(WalletsContext);
