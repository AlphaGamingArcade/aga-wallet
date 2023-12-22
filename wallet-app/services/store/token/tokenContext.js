import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

const TokenContext = createContext(null);

export const TokenContextProvider = ({ children }) => {
  const { getItem: getLocalStorageToken } = useAsyncStorage('@AgaWallet_TOKEN');
  const [token, updateToken] = useState(null);

  const readUserTokenFromStorage = async () => {
    const storageToken = await getLocalStorageToken();
    const parsedUser = JSON.parse(storageToken);
    updateToken(parsedUser);
  };

  useEffect(() => {
    readUserTokenFromStorage();
  }, []);

  return <TokenContext.Provider value={{ token, updateToken }}>{children}</TokenContext.Provider>;
};

export const useToken = () => useContext(TokenContext);
