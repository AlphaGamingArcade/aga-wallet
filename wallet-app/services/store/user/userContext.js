import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

const UserContext = createContext(null);

export const UserContextProvider = ({ children }) => {
  const {
    getItem: getLocalStorageUser,
    setItem: setLocalStorageUser,
    removeItem: removeLocalStorageUser,
  } = useAsyncStorage('@AgaWallet_USER');
  const [isAppUserReady, setIsAppUserReady] = useState(false);
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_USER':
          return {
            ...prevState,
            user: action.user,
          };
        case 'REGISTER_USER':
          return {
            ...prevState,
            user: action.user,
          };
        case 'CLEAR_USER':
          return {
            ...prevState,
            user: null,
          };
      }
    },
    { user: null }
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let user;
      try {
        setIsAppUserReady(false);
        const stringifiedUser = await getLocalStorageUser();
        user = JSON.parse(stringifiedUser);
      } catch (e) {
        // Restoring token failed
      } finally {
        setIsAppUserReady(true);
      }
      dispatch({ type: 'RESTORE_USER', user });
    };

    bootstrapAsync();
  }, []);

  const userContext = React.useMemo(
    () => ({
      registerUser: async ({ user }) => {
        const stringifiedUser = JSON.stringify(user);
        await setLocalStorageUser(stringifiedUser);
        dispatch({ type: 'REGISTER_USER', user });
      },
      updateUser: async ({ user }) => {
        const stringifiedUser = JSON.stringify(user);
        await setLocalStorageUser(stringifiedUser);
        dispatch({ type: 'RESTORE_USER', user: user });
      },
      clearUser: async () => {
        await removeLocalStorageUser();
        dispatch({ type: 'CLEAR_USER', user: null });
      },
    }),
    []
  );

  return (
    <UserContext.Provider
      value={{
        state,
        isAppUserReady,
        registerUser: userContext.registerUser,
        updateUser: userContext.updateUser,
        clearUser: userContext.clearUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
