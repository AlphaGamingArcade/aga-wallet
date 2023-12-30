import React, { createContext, useContext, useMemo, useReducer, useEffect, useState } from 'react';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';

export const NewUserContext = createContext(null);

export const NewUserContextProvider = (props) => {
  const {
    setItem: setLocalStorageNewUser,
    getItem: getLocalStorageNewUser,
    removeItem: removeLocalStorageNewUser,
  } = useAsyncStorage('@AgaWallet_NEW_USER');

  const [isAppNewUserReady, setIsAppNewUserReady] = useState(false);
  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_NEW_USER':
          return {
            ...prevState,
            isNew: action.isNew,
          };
        case 'REMOVE_NEW_USER':
          return {
            ...prevState,
            isNew: null,
          };
        default:
          return prevState;
      }
    },
    {
      isNew: null,
    }
  );

  useEffect(() => {
    const bootstrapAsync = async () => {
      let isNew;
      try {
        setIsAppNewUserReady(false);
        const stringifiedUser = await getLocalStorageNewUser();
        isNew = JSON.parse(stringifiedUser);
      } catch (e) {
        // Restoring token failed
      } finally {
        setIsAppNewUserReady(true);
      }
      dispatch({ type: 'RESTORE_NEW_USER', isNew });
    };

    bootstrapAsync();
  }, []);

  const newUserContext = useMemo(
    () => ({
      updateIsNewUser: async (isNew) => {
        const stringifiedNewUser = JSON.stringify(isNew);
        await setLocalStorageNewUser(stringifiedNewUser);
        dispatch({ type: 'RESTORE_NEW_USER', isNew });
      },
      removeIsNewUser: async () => {
        await removeLocalStorageNewUser();
        dispatch({ type: 'REMOVE_NEW_USER' });
      },
    }),
    [setLocalStorageNewUser, removeLocalStorageNewUser]
  );

  return (
    <NewUserContext.Provider
      value={{
        state,
        isAppNewUserReady,
        updateNewUser: newUserContext.updateIsNewUser,
        removeNewUser: newUserContext.removeIsNewUser,
      }}
    >
      {props.children}
    </NewUserContext.Provider>
  );
};

export const useNewUser = () => useContext(NewUserContext);
