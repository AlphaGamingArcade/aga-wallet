import { createContext, useState } from 'react';
import { genericGetRequest } from '../../api/genericGetRequest';
const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotificationss] = useState([]);

  const fetchDatas = async (type) => {
    try {
      const response = await genericGetRequest(`users/notification?type=${type}`);
      const data = await response.data;
      setNotificationss(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, fetchDatas }}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
