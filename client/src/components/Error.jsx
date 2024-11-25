import React from 'react';
import 'flowbite';

export default function Error() {
  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h1>Access Denied</h1>
      <p>You do not have permission to access this page.</p>
      <a className="text-blue-500" href="/login">
        Login
      </a>
    </div>
  );
}
