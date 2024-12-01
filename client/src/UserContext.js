import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const userName = sessionStorage.getItem('userName');
  const className = sessionStorage.getItem('className');
  const teacherId = sessionStorage.getItem('teacherId');
  const userId = sessionStorage.getItem('_id');
  const [user, setUser] = useState({
    _id: userId,
    teacherId: teacherId,
    userName: userName,
    className: className,
  });

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};
