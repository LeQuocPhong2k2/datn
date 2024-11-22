import React from 'react';
import 'flowbite';
import { useEffect, useState, useRef } from 'react';
import { Toaster, toast } from 'react-hot-toast';

import Menu from './Menu';

export default function Message() {
  /**
   * State variables
   */
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [receiver, setReceiver] = useState(null);
  const [receiverType, setReceiverType] = useState(null);
  const [receiverId, setReceiverId] = useState(null);
  const [receiverName, setReceiverName] = useState(null);
  const [receiverImage, setReceiverImage] = useState(null);
  const [senderId, setSenderId] = useState(null);
  const [senderName, setSenderName] = useState(null);
  const [senderImage, setSenderImage] = useState(null);
  const [messageId, setMessageId] = useState(null);
  const [messageType, setMessageType] = useState(null);
  const [messageDate, setMessageDate] = useState(null);
  const [messageTime, setMessageTime] = useState(null);
  const [messageStatus, setMessageStatus] = useState(null);
  const [messageRead, setMessageRead] = useState(null);
  const [messageDeleted, setMessageDeleted] = useState(null);
  const [messageSender, setMessageSender] = useState(null);
  const [messageReceiver, setMessageReceiver] = useState(null);
  const [messageContent, setMessageContent] = useState(null);
  const [messageImage, setMessageImage] = useState(null);
  const [messageFile, setMessageFile] = useState(null);
  const [messageVideo, setMessageVideo] = useState(null);
  const [messageAudio, setMessageAudio] = useState(null);
  const [toggleMenu, setToggleMenu] = useState(true);
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
