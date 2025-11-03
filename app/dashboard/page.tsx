"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import React, { useEffect, useState } from "react";

const page = () => {
  const [candidates, setCandidates] = useState([]);

  function calculatePercent(answers: any) {
    if (!answers || answers.length === 0) return 0;
    const totalPassed = answers.filter(
      (answer: any) => answer.selectedAnswer === true
    ).length;
    const totalAnswers = answers.length;

    const percent = (totalPassed / totalAnswers) * 100;
    return Math.round(percent);
  }

  useEffect(() => {
    const getCandidates = async () => {
      const results = await axios.get("/api/allCandidate");
      setCandidates(results.data);
    };
    getCandidates();
  }, []);

  console.log(candidates);
  return (
    <div className="w-full min-h-screen">
      <h1 className="text-3xl font-bold mb-4 mt-7 flex justify-center">
        Candidates and there result
      </h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Candidate</TableHead>
            <TableHead>contact</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Tier</TableHead>
            <TableHead>Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidates.map((candidate) => (
            <TableRow key={candidate.id}>
              <TableCell>{candidate.fullName}</TableCell>
              <TableCell>{candidate.phone}</TableCell>
              <TableCell>{candidate.email}</TableCell>
              <TableCell>{candidate.tier}</TableCell>
              <TableCell>
                {candidate.answers && candidate.answers.length > 0
                  ? `${calculatePercent(candidate.answers)}%`
                  : 0}{" "}
                %
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default page;
