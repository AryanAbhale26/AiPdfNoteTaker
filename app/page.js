"use client";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import React, { useEffect } from "react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";

const Page = () => {
  const { user } = useUser();
  const createUser = useMutation(api.user.createUser);

  const CheckUser = async () => {
    try {
      if (!user?.primaryEmailAddress?.emailAddress) {
        console.error("User email not available");
        return;
      }
      await createUser({
        email: user.primaryEmailAddress.emailAddress,
        imageUrl: user.imageUrl,
        userName: user.fullName,
      });
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  useEffect(() => {
    if (user) {
      CheckUser();
    }
  }, [user]);

  return (
    <div className="bg-gray-900 text-white transition-colors duration-300 min-h-screen">
      {/* Interactive Animated Background */}
      <div className="relative flex justify-center items-center h-screen overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="bg-gradient-to-r from-gray-800 via-gray-900 to-black absolute inset-0 animate-gradient"
        />

        {/* Blurry Animated Circles */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ y: [0, -30, 0], x: [0, 30, 0], scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="absolute w-72 h-72 bg-purple-800 opacity-30 rounded-full blur-3xl top-10 left-20"
          />
          <motion.div
            animate={{
              y: [-20, 10, -20],
              x: [-10, 20, -10],
              scale: [1, 1.3, 1],
            }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
            className="absolute w-96 h-96 bg-pink-800 opacity-30 rounded-full blur-3xl bottom-10 right-10"
          />
          <motion.div
            animate={{
              y: [10, -10, 10],
              x: [-20, 20, -20],
              scale: [1, 1.1, 1],
            }}
            transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
            className="absolute w-80 h-80 bg-blue-800 opacity-30 rounded-full blur-3xl top-20 right-40"
          />
        </div>

        {/* Main Content */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="z-10 text-center"
        >
          <h1 className="text-5xl font-bold mb-4">Welcome to Chatly ✨</h1>
          <p className="text-lg text-gray-300 max-w-xl mx-auto">
            Your AI-powered PDF note-taking app. Upload PDFs, ask AI questions,
            or use it like MS-Word. Save notes & boost productivity
            effortlessly!
          </p>
          <div className="mt-6">
            <Button
              className="px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition-transform"
              onClick={() => (window.location.href = "/dashboard")}
            >
              Get Started 🚀
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Page;
