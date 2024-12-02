import 'flowbite';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import Menu from './Menu';

export default function Message() {
  /**
   * State variables
   */
  const [isPageLoading, setIsPageLoading] = useState(true);

  /**
   * State variables
   */
  /**
   * handle page loading
   */
  useEffect(() => {
    toast.remove();
    handlePageLoading();
  }, []);
  /**
   * handle page loading
   */
  const handlePageLoading = () => {
    setIsPageLoading(true);
    setTimeout(() => {
      setIsPageLoading(false);
    }, 500);
  };

  return (
    <Menu active="message">
      <div>
        <h1>message</h1>
      </div>
    </Menu>
  );
}
