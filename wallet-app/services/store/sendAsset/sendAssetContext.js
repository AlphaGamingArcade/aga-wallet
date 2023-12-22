import { createContext, useContext, useState } from 'react';

const SendAssetContext = createContext(null);

export const SendAssetContextProvider = ({ children }) => {
  const [transaction, updateTransaction] = useState({
    asset: null,
    to: null,
    from: null,
    amount: null,
  });

  return (
    <SendAssetContext.Provider value={{ transaction, updateTransaction }}>
      {children}
    </SendAssetContext.Provider>
  );
};

export const useSendAssetContext = () => useContext(SendAssetContext);
