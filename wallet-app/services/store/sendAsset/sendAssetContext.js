import React, { createContext, useContext } from 'react';

const SendAssetContext = createContext(null);

export const SendAssetContextProvider = ({ children }) => {
  const [transaction, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'UPDATE_TRANSACTION_ASSET':
          return {
            ...prevState,
            asset: action.transaction.asset,
          };
        case 'UPDATE_TRANSACTION_RECEIVER':
          return {
            ...prevState,
            receiver: action.transaction.receiver,
          };
        case 'UPDATE_TRANSACTION_SENDER':
          return {
            ...prevState,
            sender: action.transaction.sender,
          };
        case 'UPDATE_TRANSACTION_AMOUNT':
          return {
            ...prevState,
            amount: action.transaction.amount,
          };
        case 'CLEAR_TRANSACTION':
          return {
            ...prevState,
            asset: null,
            receiver: null,
            sender: null,
            amount: null,
          };
      }
    },
    {
      asset: null,
      receiver: null,
      sender: null,
      amount: null,
    }
  );

  const sendAssetContext = React.useMemo(
    () => ({
      updateAsset: (asset) => {
        dispatch({ type: 'UPDATE_TRANSACTION_ASSET', transaction: { asset } });
      },
      updateReceiver: (address) => {
        dispatch({ type: 'UPDATE_TRANSACTION_RECEIVER', transaction: { receiver: address } });
      },
      updateSender: (address) => {
        dispatch({ type: 'UPDATE_TRANSACTION_SENDER', transaction: { sender: address } });
      },
      updateAmount: (amount) => {
        dispatch({ type: 'UPDATE_TRANSACTION_AMOUNT', transaction: { amount: amount } });
      },
      clearTransaction: () => {
        dispatch({ type: 'CLEAR_TRANSACTION' });
      },
    }),
    []
  );

  return (
    <SendAssetContext.Provider
      value={{
        transaction,
        updateAsset: sendAssetContext.updateAsset,
        updateReceiver: sendAssetContext.updateReceiver,
        updateSender: sendAssetContext.updateSender,
        updateAmount: sendAssetContext.updateAmount,
        clearTransaction: sendAssetContext.clearTransaction,
      }}
    >
      {children}
    </SendAssetContext.Provider>
  );
};

export const useSendAssetContext = () => useContext(SendAssetContext);
