"use client";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/useStore";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

interface Question {
  id: string;
  questionText: string;
  tier: string;
  tierLabel: string;
}

const Page = () => {
  const router = useRouter();
  const [questions, setQuestion] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const params = useParams();
  const tier = params.id as string;

  const options = [
    { label: "True", value: true },
    { label: "False", value: false },
  ];

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/qscreate", {
          params: { tier },
        });
        setQuestion(response.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };

    if (tier) {
      fetchQuestions();
    } else {
      setLoading(false);
    }
  }, [tier]);

  useEffect(() => {
    const checkUserAnswered = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) return;

        const decoded: any = jwtDecode(token);
        const userEmail = decoded.email;

        const response = await axios.get("/api/candidate", {
          params: { email: userEmail },
        });

        const candidate = response.data;

        if (candidate.answers.length > 0) {
          router.push("/attempted");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    checkUserAnswered();
  }, []);
  const handleAnswer = (questionId: string, answer: boolean) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);

    try {
     
      const token = Cookies.get("token");

      if (!token) {
        toast.error("User not logged in!");
        router.push("/login");
        setIsSubmitting(false);
        return;
      }

     
      let decoded: any;
      try {
        decoded = jwtDecode(token);
      } catch (error) {
        console.error("Token decode error:", error);
        toast.error("Invalid session. Please login again.");
        router.push("/login");
        setIsSubmitting(false);
        return;
      }

      const candidateId = decoded.id; 
      const userEmail = decoded.email;

      console.log("Candidate ID:", candidateId);
      console.log("User email:", userEmail);
      const answersArray = Object.entries(data).map(([questionId, value]) => ({
        questionId,
        value,
      }));

      console.log("Submitting answers:", answersArray);

      // Submit answers - don't send candidateId, it's read from token on server
      const result = await axios.post("/api/answer", {
        answers: answersArray,
      });

      console.log("Submission result:", result.data);

      toast.success(
        "You have successfully submitted your response! Our HR will be reaching out soon!"
      );

      router.push("/success");
    } catch (error: any) {
      console.error("❌ Submission error:", error);

      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        router.push("/login");
      } else {
        toast.error(error.response?.data?.error || "Failed to submit answers");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = questions.length;
  const progress =
    totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-black font-medium">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (!tier) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-black font-medium text-lg">
            Please select a tier first
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-linear-to-b from-blue-400 to-blue-300 border-b">
        <div className="max-w-4xl mx-auto px-2 sm:px-2 lg:px-2 py-2">
          <div className="flex">
            <h1 className="text-m sm:text-4xl font-bold text-white uppercase tracking-tight">
              {tier} Assessment
            </h1>
            <p className="text-white mt-1 text-sm sm:text-base">
              Answer all questions honestly. Your responses help us understand
              your qualifications.
            </p>
          </div>

          {totalQuestions > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-white">Progress</span>
                <span className="text-white">
                  {answeredCount} / {totalQuestions} completed
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-white h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="p-2">
          {questions.length > 0 ? (
            questions.map((question, index) => (
              <div
                key={question.id}
                className="bg-white hover:shadow-2xl py-2 px-4 transition-all duration-200"
              >
                <div className="flex items-start gap-4 sm:gap-6">
                  <div className="shrink-0">
                    <div className="rounded-full h-6 w-6 border border-black/70 flex items-center justify-center">
                      <span className="text-black/70 font-bold text-lg sm:text-xl">
                        {index + 1}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-1">
                    <p className="font-medium text-black leading-relaxed">
                      {question.questionText}?
                    </p>

                    <div className="flex flex-col gap-2">
                      {options.map((option) => (
                        <Button
                          key={option.label}
                          onClick={() =>
                            handleAnswer(question.id, option.value)
                          }
                          variant={
                            answers[question.id] === option.value
                              ? "default"
                              : "outline"
                          }
                          className={`w-fit text-base font-semibold rounded-xl transition-all duration-200 ${
                            answers[question.id] === option.value
                              ? "bg-black text-white hover:bg-gray-800 border border-black shadow-lg"
                              : "bg-white text-black border border-gray-300 hover:border-black hover:bg-gray-50"
                          }`}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <div className="bg-gray-100  p-12">
                <p className="text-black text-xl font-medium">
                  No questions available for {tier}
                </p>
                <p className="text-gray-600 mt-2">
                  Please check back later or contact support.
                </p>
              </div>
            </div>
          )}
        </div>

        {questions.length > 0 && (
          <div className="mt-8">
            <Button
              disabled={answeredCount < totalQuestions || isSubmitting}
              className="w-full h-6  py-4 text-lg font-bold rounded-xl bg-blue-500 hover:bg-blue-300 disabled:bg-gray-400 disabled:text-gray-200 transition-all duration-200 shadow-xl hover:shadow-2xl disabled:shadow-none"
              onClick={() => handleSubmit(answers)}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-3">
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </span>
              ) : answeredCount < totalQuestions ? (
                `Answer all questions (${totalQuestions - answeredCount} remaining)`
              ) : (
                "Submit Assessment"
              )}
            </Button>

            {answeredCount === totalQuestions && !isSubmitting && (
              <p className="text-center text-sm text-gray-600 mt-4">
                ✓ All questions answered. Ready to submit!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
