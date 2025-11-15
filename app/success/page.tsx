"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter();

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 px-4">
      <div className="w-full max-w-md text-center bg-white dark:bg-slate-800 rounded-2xl shadow-md p-8 border border-slate-200 dark:border-slate-700">
        <CheckCircle className="mx-auto h-20 w-20 text-green-600 dark:text-green-400" />

        <h1 className="text-3xl font-bold mt-4">Submission Successful!</h1>

        <p className="text-slate-600 dark:text-slate-300 mt-3">
          Thank you for completing the assessment. Our HR team will reach out to
          you soon.
        </p>

        <div className="mt-8 space-y-3">
          <Button className="w-full" onClick={() => router.push("/")}>
            Go to Home
          </Button>

          <Link href="/login">
            <Button variant="outline" className="w-full">
              Logout
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
