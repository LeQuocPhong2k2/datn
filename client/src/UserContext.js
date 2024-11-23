import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const userName = localStorage.getItem('userName');
  const className = localStorage.getItem('className');
  const teacherId = localStorage.getItem('teacherId');
  const [user, setUser] = useState({
    teacherId: teacherId,
    userName: userName,
    className: className,
  });

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};
