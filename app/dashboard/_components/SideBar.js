"use client";
import { Button } from "@/components/ui/button";
import { Layout, Shield } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Progress } from "@/components/ui/progress";
import UploadPdf from "./UploadPdf";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

const MAX_UPLOAD_LIMIT = 5; // Default limit for non-upgraded users

const SideBar = () => {
  const { user } = useUser();

  // Fetch user details from the database
  const userData = useQuery(api.user.getUserData, {
    userEmail: user?.primaryEmailAddress?.emailAddress,
  });

  // Check if user has upgraded
  const isUpgraded = userData?.upgrade || false;

  // Fetch the user's uploaded files
  const fileList = useQuery(api.fileStorage.GetUserFiles, {
    userEmail: user?.primaryEmailAddress?.emailAddress,
  });

  const uploadedCount = fileList ? fileList.length : 0;
  const uploadLimit = isUpgraded ? Infinity : MAX_UPLOAD_LIMIT; // Unlimited uploads for upgraded users
  const progressValue =
    isUpgraded ? 100 : Math.min((uploadedCount / MAX_UPLOAD_LIMIT) * 100, 100);
  const isLimitReached = !isUpgraded && uploadedCount >= MAX_UPLOAD_LIMIT;

  return (
    <div className="shadow-md h-screen p-7 relative">
      <Link href={"/dashboard"}>
        {/* Logo Section */}
        <div className="flex items-center gap-1">
          <Image src={"/logo.svg"} alt="logo" width={50} height={50} />
          <p className="font-semibold text-lg">Chatly</p>
        </div>
      </Link>

      {/* Upload & Navigation */}
      <div className="mt-10">
        <UploadPdf isLimitReached={isLimitReached}>
          <Button className="w-full px-10" disabled={isLimitReached}>
            {isLimitReached ? "Limit Reached" : "+ Upload PDF"}
          </Button>
        </UploadPdf>

        <Link href={"/dashboard"}>
          <div className="flex gap-2 items-center p-3 mt-3 hover:bg-slate-100 rounded-lg cursor-pointer">
            <Layout />
            <h2>Workspace</h2>
          </div>
        </Link>
        <Link href={"/dashboard/upgrade"}>
          <div className="flex gap-2 items-center p-3 mt-1 hover:bg-slate-100 rounded-lg cursor-pointer">
            <Shield />
            <h2>Upgrade</h2>
          </div>
        </Link>
      </div>

      {/* Upload Progress */}
      {!isUpgraded && (
        <div className="absolute bottom-10 w-[80%] left-[10%]">
          <Progress value={progressValue} />
          <p className="text-sm mt-2 text-center">
            {uploadedCount} out of {MAX_UPLOAD_LIMIT} PDFs Uploaded
          </p>
          {isLimitReached && (
            <p className="text-sm text-red-500 text-center">
              Upload limit reached. Upgrade to upload more PDFs.
            </p>
          )}
          {!fileList && (
            <p className="text-sm text-gray-400 text-center mt-1">
              Loading files...
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default SideBar;
