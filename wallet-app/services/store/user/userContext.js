import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

const UserContext = createContext(null);

export const UserContextProvider = ({ children }) => {
  const { getItem: getLocalStorageUser } = useAsyncStorage('@AgaWallet_USER');
  const [user, updateUser] = useState(null);

  const readUserFromStorage = async () => {
    const storageUser = await getLocalStorageUser();
    const parsedUser = JSON.parse(storageUser);
    updateUser(parsedUser);
  };

  useEffect(() => {
    readUserFromStorage();
    return () => {};
  }, []);

  return <UserContext.Provider value={{ user, updateUser }}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
