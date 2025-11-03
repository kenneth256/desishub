"use client";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import React from "react";
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
import { TierLabel } from "@prisma/client";

type FormData = {
  name: string;
  email: string;
  phone: string;
  tier: string;
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

  const tiers = [
    { value: 0, label: "BEGINNER", name: "Beginner" },
    { value: 1, label: "CRUD_DEVELOPER", name: "CRUD Developer" },
    { value: 2, label: "FULLSTACK", name: "Fullstack" },
    { value: 3, label: "MULTIFRAMEWORK", name: "Multi-Framework" },
    { value: 4, label: "ADVANCED", name: "Advanced" },
  ];
  const router = useRouter();
  const submitInfo = async (data: FormData) => {
    try {
      const result = await axios.post("/api/candidate", data);
      const userData = { ...data, TierLabel };
      localStorage.setItem("user", JSON.stringify(userData));
      reset();
      router.push(`/answer/${tier}`);
    } catch (error) {
      alert("Failed to save info");
    }

    reset();
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center flex-col px-4">
      <h1 className="text-3xl font-bold text-center mb-6">
        Welcome to Desis Hub, answer the questions below to continue
      </h1>

      <div className="w-full max-w-5xl p-6 rounded-2xl shadow-md">
        <h2 className="text-lg mb-4">
          Fill in your personal details to continue
        </h2>

        <form onSubmit={handleSubmit(submitInfo)}>
          <div className="gap-2 flex flex-col w-full mb-3">
            <Label htmlFor="name">What is your full name?</Label>
            <Input
              id="name"
              type="text"
              placeholder="Full name"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <span className="text-sm text-red-500">
                {errors.name.message}
              </span>
            )}
          </div>

          <div className="gap-2 flex flex-col w-full mb-3">
            <Label htmlFor="email">What is your email?</Label>
            <Input
              id="email"
              type="email"
              placeholder="Email address"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <span className="text-sm text-red-500">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="gap-2 flex flex-col w-full mb-3">
            <Label htmlFor="phone">What is your mobile number?</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Phone number"
              {...register("phone", { required: "Phone number is required" })}
            />
            {errors.phone && (
              <span className="text-sm text-red-500">
                {errors.phone.message}
              </span>
            )}
          </div>
          <div className="gap-2 flex flex-col w-full mb-3">
            <Select
              value={tier}
              onValueChange={(value) => {
                setTier(value);
                setValue("tier", value);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a tier group" />
              </SelectTrigger>
              <SelectContent className="w-full">
                {tiers.map((tier, index) => (
                  <SelectItem
                    className="uppercase"
                    value={tier.label}
                    key={index}
                  >
                    {tier.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="mt-4 w-full" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Session"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Page;
