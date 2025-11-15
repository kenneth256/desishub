"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore } from "@/lib/useStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Layers,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

type FormData = {
  name: string;
  email: string;
  phone: string;
  tier: string;
  passWord: string;
};

const Page = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>();

  const { setTier, tier } = useStore();
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const tiers = [
    {
      value: 0,
      label: "BEGINNER",
      name: "Beginner",
      description: "Just starting your coding journey",
    },
    {
      value: 1,
      label: "CRUD_DEVELOPER",
      name: "CRUD Developer",
      description: "Comfortable with basic operations",
    },
    {
      value: 2,
      label: "FULLSTACK",
      name: "Fullstack",
      description: "Frontend + Backend experience",
    },
    {
      value: 3,
      label: "MULTIFRAMEWORK",
      name: "Multi-Framework",
      description: "Multiple frameworks & technologies",
    },
    {
      value: 4,
      label: "ADVANCED",
      name: "Advanced",
      description: "Expert-level proficiency",
    },
  ];

  const router = useRouter();

  const submitInfo = async (data: FormData) => {
    try {
      const userExists = await axios.get("/api/candidate", {
        params: { email: data.email },
      });
      if (userExists.data) {
        toast.error("You already attempted this exercise!");
        return;
      }
    } catch (error: any) {
      if (error.response?.status !== 404) {
        console.error("Error:", error);
        toast.error("Error checking user");
        return;
      }
    }

    try {
      const result = await axios.post("/api/candidate", data);
      toast.success("Registration successful! 🎉");
      reset();
      router.push(`/answer/${tier}`);
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.response?.data?.error || "Failed to save info");
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-4">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Welcome to Desis Hub
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Start your coding assessment journey
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`h-2 rounded-full transition-all duration-300 ${
                step <= currentStep
                  ? "w-12 bg-gradient-to-r from-blue-500 to-purple-600"
                  : "w-8 bg-slate-200 dark:bg-slate-700"
              }`}
            />
          ))}
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 border border-slate-200 dark:border-slate-700 backdrop-blur-lg">
          <form onSubmit={handleSubmit(submitInfo)} className="space-y-6">
            {/* Personal Information Section */}
            <div className="space-y-5">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-700">
                <User className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold">Personal Information</h2>
              </div>

              {/* Full Name */}
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <User className="w-4 h-4 text-slate-500" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className="h-11"
                  {...register("name", { required: "Name is required" })}
                  onFocus={() => setCurrentStep(1)}
                />
                {errors.name && (
                  <span className="text-sm text-red-500 flex items-center gap-1">
                    {errors.name.message}
                  </span>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <Mail className="w-4 h-4 text-slate-500" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  className="h-11"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  onFocus={() => setCurrentStep(1)}
                />
                {errors.email && (
                  <span className="text-sm text-red-500 flex items-center gap-1">
                    {errors.email.message}
                  </span>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 text-slate-500" />
                  Mobile Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+256 700 000 000"
                  className="h-11"
                  {...register("phone", {
                    required: "Phone number is required",
                  })}
                  onFocus={() => setCurrentStep(2)}
                />
                {errors.phone && (
                  <span className="text-sm text-red-500 flex items-center gap-1">
                    {errors.phone.message}
                  </span>
                )}
              </div>
            </div>

            {/* Security Section */}
            <div className="space-y-5 pt-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-700">
                <Lock className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-semibold">Security</h2>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <Lock className="w-4 h-4 text-slate-500" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="h-11 pr-10"
                    {...register("passWord", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    onFocus={() => setCurrentStep(2)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.passWord && (
                  <span className="text-sm text-red-500 flex items-center gap-1">
                    {errors.passWord.message}
                  </span>
                )}
              </div>
            </div>

            {/* Skill Level Section */}
            <div className="space-y-5 pt-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-700">
                <Layers className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-semibold">Skill Level</h2>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="tier"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <Layers className="w-4 h-4 text-slate-500" />
                  Select Your Tier
                </Label>
                <input
                  type="hidden"
                  {...register("tier", { required: true })}
                />
                <Select
                  value={tier}
                  onValueChange={(value) => {
                    setTier(value);
                    setValue("tier", value, { shouldValidate: true });
                    setCurrentStep(3);
                  }}
                >
                  <SelectTrigger className="w-full h-11">
                    <SelectValue placeholder="Choose your skill level" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    {tiers.map((tier, index) => (
                      <SelectItem
                        value={tier.label}
                        key={index}
                        className="cursor-pointer py-3"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">{tier.name}</span>
                          <span className="text-xs text-slate-500">
                            {tier.description}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.tier && (
                  <span className="text-sm text-red-500">
                    Please select a tier
                  </span>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Your Account...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Start Assessment
                  <ArrowRight className="w-5 h-5" />
                </span>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-slate-800 text-slate-500">
                Already have an account?
              </span>
            </div>
          </div>

          {/* Login Link */}
          <Link href="/login">
            <Button variant="outline" type="button" className="w-full h-11">
              Sign In Instead
            </Button>
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
          By registering, you agree to our{" "}
          <Link
            href="/terms"
            className="text-blue-600 hover:underline font-medium"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="text-blue-600 hover:underline font-medium"
          >
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Page;
