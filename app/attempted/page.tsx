"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import axios from "axios";

export default function AlreadyAttemptedPage() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.post("/api/logout");

      Cookies.remove("token", { path: "/" });
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
      window.location.href = "/login";
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-white px-4">
      <div className="w-full max-w-xl text-center bg-white rounded-2xl p-8 ">
        {/* Icon */}
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-black rounded-full blur-xl opacity-20"></div>
          <div className="relative bg-white rounded-full p-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold mt-6 text-black">
          Assessment Already Completed
        </h1>

        {/* Message */}
        <div className="mt-6 space-y-3">
          <p className="text-blue-700 text-lg">
            You have already submitted your responses for this assessment.
          </p>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mt-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-gray-600 mt-0.5 shrink-0" />
              <p className="text-sm text-gray-600 text-left">
                Our HR team is currently reviewing your submission. You will be
                contacted soon regarding the next steps.
              </p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-8 space-y-3">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full border-2 border-black text-black hover:bg-gray-100 font-semibold py-6 rounded-xl text-lg"
          >
            Logout
          </Button>
        </div>

        {/* Additional Info */}
        <p className="text-sm text-gray-500 mt-6">
          Need help? Contact us at{" "}
          <a
            href="mailto:hr@company.com"
            className="underline font-medium text-black"
          >
            hr@company.com
          </a>
        </p>
      </div>
    </div>
  );
}
