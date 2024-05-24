"use client";
import React, { useCallback, useEffect, useState } from "react";
import DesktopNav from "./components/navbar/DesktopNav";
import MobileNav from "./components/navbar/MobileNav";

const NavBar = () => {
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const updateWindowValue = useCallback(() => {
    setWindowWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    window.addEventListener("resize", updateWindowValue);

    return () => {
      window.removeEventListener("resize", updateWindowValue);
    };
  }, []);

  return (
    <nav className="top-0 left-0 right-0 bg-opacity-90 bg-gradient-to-t from-primary-50 to-[#D1F0FA] text-[#1D3E56] border">
      {windowWidth > 768 ? <DesktopNav /> : <MobileNav />}
    </nav>
  );
};
export default NavBar;
