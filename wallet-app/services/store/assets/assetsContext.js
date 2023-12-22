import { createContext, useContext, useState } from 'react';

const AssetContext = createContext(null);

export const AssetContextProvider = ({ children }) => {
  const [assets, updateAssets] = useState([]);
  return <AssetContext.Provider value={{ assets, updateAssets }}>{children}</AssetContext.Provider>;
};

export const useAssets = () => useContext(AssetContext);
