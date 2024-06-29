"use client";
import { FC, useEffect, useState } from "react";
import { format } from "date-fns";

interface NavbarProps {}

const Navbar: FC<NavbarProps> = ({}) => {
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formattedTime = format(now, "dd/MM/yyyy - h:mm a");
      setCurrentTime(formattedTime);
    };

    // Update time immediately on component mount
    updateTime();

    // Set an interval to update the time every minute
    const intervalId = setInterval(updateTime, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="w-full flex justify-between items-center ">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
      </div>
      <div>
        <span className="text-lg">{currentTime}</span>
      </div>
    </div>
  );
};

export default Navbar;
