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
        return;
      }
      const decoded: any = jwtDecode(token);
      const userEmail = decoded.email;

      const candidateResponse = await axios.get("/api/candidate", {
        params: { email: userEmail },
      });

      const candidateId = candidateResponse.data.id;

      const answersArray = Object.entries(data).map(([questionId, value]) => ({
        questionId,
        value,
      }));
      const result = await axios.post("/api/answer", {
        answers: answersArray,
        candidateId,
      });
      toast.success(
        "you have successfully submitted your response, our HR will be reching out soon!"
      );
      router.push("/");
      setIsSubmitting(false);
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-4">Loading questions...</div>;

  if (!tier) return <div className="p-4">Please select a tier first</div>;

  return (
    <div className="p-4">
      <h1 className="uppercase font-bold text-2xl mb-6">
        ANSWER THESE QUESTIONS FOR {tier}
      </h1>
      <div className="space-y-4">
        {questions.length > 0 ? (
          questions.map((question) => (
            <div key={question.id} className="p-4 rounded-lg">
              <p className="mb-1 text-lg">{question.questionText} ?</p>
              <div className="flex gap-1 flex-col">
                {options.map((option) => (
                  <Button
                    className="w-fit p-1"
                    key={option.label}
                    onClick={() => handleAnswer(question.id, option.value)}
                    variant={
                      answers[question.id] === option.value
                        ? "default"
                        : "ghost"
                    }
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p>No questions available for {tier}</p>
        )}
      </div>
      {questions.length > 0 && (
        <Button
          disabled={isSubmitting}
          className="mt-6 w-full disabled:bg-black/60 disabled:text-white/60"
          onClick={() => handleSubmit(answers)}
        >
          {isSubmitting ? "submitting..." : " Submit Answers"}
        </Button>
      )}
    </div>
  );
};

export default Page;
