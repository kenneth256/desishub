"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "@/lib/useStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { TierLabel } from "@prisma/client";

type Question = {
  question: string;
  tierLabel: string;
};

const tiersArray = [
  "BEGINNER",
  "CRUD DEVELOPER",
  "FULLSTACK",
  "MULTIFRAMEWORK",
  "ADVANCED",
] as const;

const Page = () => {
  const { tier, setTier } = useStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<Question>();

  const handleCreateQs = async (data: Question) => {
    try {
      if (!tier) {
        setError("tierLabel", {
          type: "manual",
          message: "Please select a tier",
        });
        return;
      }

      const datas = {
        question: data.question,
        tier: tier as TierLabel,
      };

      const result = await axios.post("/api/qscreate", datas);

      reset();
      setTier("");
    } catch (error) {
      console.error("Error creating question:", error);

      setError("root", {
        type: "manual",
        message: "Failed to create question. Please try again.",
      });
    }
  };

  return (
    <div className="w-full">
      <div className="mx-auto">
        <div className="max-w-6xl flex flex-col py-4 mx-auto">
          <h1 className="text-3xl font-bold mb-3">Create new question</h1>
          <form onSubmit={handleSubmit(handleCreateQs)}>
            <div className="flex flex-col gap-2 mb-3">
              <Label htmlFor="question">Question</Label>
              <Input
                type="text"
                {...register("question", { required: "Question is required" })}
                id="question"
                placeholder="Enter question here..."
              />
              {errors.question && (
                <p className="text-sm text-red-500">
                  {errors.question.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2 mb-3">
              <Label htmlFor="tier">Tier</Label>
              <Select value={tier} onValueChange={(value) => setTier(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a tier group" />
                </SelectTrigger>
                <SelectContent>
                  {tiersArray.map((tierOption) => (
                    <SelectItem value={tierOption} key={tierOption}>
                      {tierOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.tierLabel && (
                <p className="text-sm text-red-500">
                  {errors.tierLabel.message}
                </p>
              )}
            </div>

            {errors.root && (
              <p className="text-sm text-red-500 mb-3">{errors.root.message}</p>
            )}

            <Button
              disabled={isSubmitting}
              type="submit"
              className="disabled:text-white/50 mt-3 w-full disabled:bg-black/75"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
