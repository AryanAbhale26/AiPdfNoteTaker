"use client";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useMutation } from "convex/react";
import React from "react";
import { toast } from "sonner";

const UpgradePage = () => {
  const { user } = useUser();
  const upgradeUserPlan = useMutation(api.user.userUpgradePlan);

  const onPaymentSuccess = async (details) => {
    try {
      await upgradeUserPlan({
        userEmail: user?.primaryEmailAddress?.emailAddress,
      });
      toast.success("Plan upgraded successfully!");
    } catch (error) {
      toast.error("Failed to upgrade plan. Please try again.");
    }
  };

  return (
    <div>
      <h1 className="text-center text-4xl">Upgrade your plans</h1>
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
          {/* Pro Plan */}
          <div className="rounded-2xl border border-indigo-600 p-6 shadow-xs ring-1 ring-indigo-600 sm:px-8 lg:p-12">
            <div className="text-center">
              <h2 className="text-lg font-medium text-gray-900">Pro Plan</h2>
              <p className="mt-2">
                <strong className="text-3xl font-bold text-gray-900 sm:text-4xl">
                  $10
                </strong>
                <span className="text-sm font-medium text-gray-700">
                  /month
                </span>
              </p>
            </div>
            <ul className="mt-6 space-y-2">
              {[
                "Unlimited PDFs",
                "5GB Storage",
                "Email Support",
                "Help Center Access",
                "Phone Support",
                "Community Access",
              ].map((feature, index) => (
                <li key={index} className="flex items-center gap-1">
                  <svg
                    className="size-5 text-indigo-700"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
            <PayPalButtons
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [{ amount: { value: "10.00" } }],
                });
              }}
              onApprove={(data, actions) => {
                return actions.order?.capture().then(onPaymentSuccess);
              }}
            />
          </div>

          {/* Starter Plan */}
          <div className="rounded-2xl border border-gray-200 p-6 shadow-xs sm:px-8 lg:p-12">
            <div className="text-center">
              <h2 className="text-lg font-medium text-gray-900">
                Starter Plan
              </h2>
              <p className="mt-2">
                <strong className="text-3xl font-bold text-gray-900 sm:text-4xl">
                  $0
                </strong>
                <span className="text-sm font-medium text-gray-700">
                  /month
                </span>
              </p>
            </div>
            <ul className="mt-6 space-y-2">
              {[
                "5 PDFs Limited",
                "2GB Storage",
                "Email Support",
                "Help Center Access",
              ].map((feature, index) => (
                <li key={index} className="flex items-center gap-1">
                  <svg
                    className="size-5 text-indigo-700"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
            <a
              href="#"
              className="mt-8 block rounded-full border border-indigo-600 bg-white px-12 py-3 text-center text-sm font-medium text-indigo-600 hover:ring-1 hover:ring-indigo-600"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradePage;
