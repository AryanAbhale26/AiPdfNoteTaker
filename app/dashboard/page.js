"use client";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Dashboard = () => {
  const { user } = useUser();
  const fileList = useQuery(api.fileStorage.GetUserFiles, {
    userEmail: user?.primaryEmailAddress?.emailAddress,
  });

  return (
    <div>
      <h2 className="font-medium text-3xl mb-5">WorkSpace</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {fileList?.length > 0 ?
          fileList.map((file, i) => (
            <Link href={"/workspace/" + file.fileId} key={i}>
              <div className="flex flex-col items-center justify-center p-5 shadow-md rounded-md border hover:scale-105 transition-transform">
                <Image
                  src="https://cdn-icons-png.flaticon.com/512/337/337946.png"
                  alt="PDF Icon"
                  width={70}
                  height={70}
                />
                <h2 className="mt-3 font-medium text-xl hover:cursor-pointer hover:scale-105 transition-transform">
                  {file.fileName}
                </h2>
              </div>
            </Link>
          ))
        : Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="bg-slate-200 rounded-md h-[100px] animate-pulse"
            ></div>
          ))
        }
      </div>
    </div>
  );
};

export default Dashboard;
