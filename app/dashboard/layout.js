import React from "react";
import SideBar from "./_components/SideBar";
import Header from "./_components/Header";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex ">
      <div className="hidden md:block md:w-64 h-screen fixed ">
        <SideBar />
      </div>

      {/* Toggle Sidebar for Mobile */}
      <div className="w-full md:ml-64">
        <Header />
        <div className="p-10">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
