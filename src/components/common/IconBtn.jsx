import React from 'react';

const IconBtn = ({ text, onclick, disabled, children }) => {
  return (
    <button
      onClick={onclick}
      disabled={disabled}
      className="flex items-center gap-x-2 bg-yellow-50 hover:bg-yellow-100 text-black text-sm px-4 py-2 rounded-md transition"
    >
      {text}
      {children}
    </button>
  );
};

export default IconBtn;
