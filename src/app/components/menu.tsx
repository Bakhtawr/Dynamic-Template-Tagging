"use client";

import { useState } from "react";
import Link from "next/link";

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className=" text-white p-4 ">
      {/* Desktop Navigation */}
      <ul className="hidden md:flex gap-6">
        <li className="ml-4 bg-gray-700 px-6 py-3 rounded-md">
          <Link href="/">
            <span className="cursor-pointer hover:text-gray-300">Home</span>
          </Link>
        </li>
        <li className="ml-4 bg-gray-700 px-6 py-3 rounded-md">
          <Link href="/test">
            <span className="cursor-pointer hover:text-gray-300">Test</span>
          </Link>
        </li>
      </ul>

      {/* Mobile Menu Toggle Button */}
      <button 
        className="md:hidden bg-gray-700 px-4 py-2 rounded-md" 
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰ Menu
      </button>

      {/* Mobile Navigation */}
      {isOpen && (
        <ul className="md:hidden flex flex-col gap-4 mt-4">
          <li className="bg-gray-700 px-4 py-2 rounded-md">
            <Link href="/">
              <span className="cursor-pointer hover:text-gray-300">Home</span>
            </Link>
          </li>
          <li className="bg-gray-700 px-4 py-2 rounded-md">
            <Link href="/test">
              <span className="cursor-pointer hover:text-gray-300">Test</span>
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Menu;
