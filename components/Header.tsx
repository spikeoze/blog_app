import React from "react";
import Link from "next/link";
import Image from "next/image";

function Header() {
  return (
    <header className="flex justify-between p-5 max-w-7xl mx-auto">
      <div className="flex items-center space-x-5">
        <Link href="/">
          <img
            className=" w-36 sm:w-44 object-contain cursor-pointer  "
            src="https://links.papareact.com/yvf"
            alt="logo"
          />
        </Link>

        <div className="hidden md:inline-flex items-center space-x-5">
          <h3>About</h3>
          <h3>Contact</h3>
          <h3 className="text-white bg-green-600 px-4 py-1 rounded-full">
            Follow
          </h3>
        </div>
      </div>

      <div className="flex items-center space-x-5 text-xs sm:text-lg">
        <h3 className="text-green-700" >Sign in</h3>
        <h3 className="border border-green-600 px-3 py-1 rounded-full">
          Get Started
        </h3>
      </div>
    </header>
  );
}

export default Header;
