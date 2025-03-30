"use client";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import React from "react";

const Provider = ({ children }) => {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  if (!convexUrl) {
    throw new Error(
      "NEXT_PUBLIC_CONVEX_URL is not defined in the environment variables."
    );
  }

  if (!paypalClientId) {
    throw new Error(
      "NEXT_PUBLIC_PAYPAL_CLIENT_ID is not defined in the environment variables."
    );
  }

  const convex = new ConvexReactClient(convexUrl);

  return (
    <ConvexProvider client={convex}>
      <PayPalScriptProvider options={{ "client-id": paypalClientId }}>
        {children}
      </PayPalScriptProvider>
    </ConvexProvider>
  );
};

export default Provider;
