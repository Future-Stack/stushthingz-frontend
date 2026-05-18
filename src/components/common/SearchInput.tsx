import React, { InputHTMLAttributes } from "react";
import { Search } from "lucide-react";

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ className = "", ...props }) => {
  return (
    <div className={`relative ${className}`}>
      <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        {...props}
        className="w-full bg-[#F3F3F5] border border-gray-200 rounded-xl py-2 pl-11 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-50"
      />
    </div>
  );
};

export default SearchInput;
