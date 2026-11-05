import React from "react";

export function MainButton({
  onClick,
  children,
  disabled,
}: {
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="bg-[#3b5bdb] hover:bg-[#324ca8] disabled:opacity-50 text-white font-bold px-[26px] py-[14px] rounded-[12px] text-[17px] transition shadow-md cursor-pointer flex items-center justify-center gap-2"
    >
      {children}
    </button>
  );
}