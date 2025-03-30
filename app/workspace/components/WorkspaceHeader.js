import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import React from "react";

const WorkspaceHeader = ({ fileName }) => {
  console.log(fileName);

  return (
    <div className="p-4 flex justify-between shadow-md items-center">
      <div className="flex justify-items-start items-center gap-1">
        <Image src={"/logo.svg"} alt="logo " width={50} height={50} />
        <p>Chatly</p>
      </div>

      <h2>{fileName?.trim() ? fileName : "Untitled"}</h2>
      <div className="flex gap-4 justify-center items-center">
        <Button>Save</Button>
        <UserButton />
      </div>
    </div>
  );
};

export default WorkspaceHeader;
