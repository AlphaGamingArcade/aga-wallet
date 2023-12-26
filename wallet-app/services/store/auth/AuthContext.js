import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthContextProvider = ({ children }) => {
  const {
    getItem: getLocalStorageToken,
    setItem: setLocalStorageToken,
    removeItem: removeLocalStorageToken,
  } = useAsyncStorage('@AgaWallet_TOKEN');
  const [isAppAuthReady, setIsAppAuthReady] = useState(false);

  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;
      try {
        setIsAppAuthReady(false);
        userToken = await getLocalStorageToken();
      } catch (e) {
        // Restoring token failed
      } finally {
        setIsAppAuthReady(true);
      }
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async ({ token }) => {
        await setLocalStorageToken(token);
        dispatch({ type: 'SIGN_IN', token });
      },
      signOut: async () => {
        await removeLocalStorageToken();
        dispatch({ type: 'SIGN_OUT' });
      },
      signUp: async ({ token }) => {
        await setLocalStorageToken(token);
        dispatch({ type: 'SIGN_IN', token: token });
      },
    }),
    []
  );

  return (
    <AuthContext.Provider
      value={{
        isAppAuthReady,
        state,
        dispatch,
        signIn: authContext.signIn,
        signOut: authContext.signOut,
        signUp: authContext.signUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
