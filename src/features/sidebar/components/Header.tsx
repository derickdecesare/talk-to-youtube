import React from "react";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <h2 className="p-4 border-b border-zinc-700 font-bold text-2xl">{title}</h2>
  );
};

export default Header;
