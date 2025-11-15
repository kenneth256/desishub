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

const Page = () => {
  const [candidates, setCandidates] = useState([]);

  function calculatePercent(answers: any) {
    if (!answers || answers.length === 0) return 0;
    const totalPassed = answers.filter(
      (answer: any) => answer.selectedAnswer === true
    ).length;
    const totalAnswers = answers.length;

    return Math.round((totalPassed / totalAnswers) * 100);
  }

  useEffect(() => {
    const getCandidates = async () => {
      const results = await axios.get("/api/allCandidate");
      setCandidates(results.data);
    };
    getCandidates();
  }, []);

  return (
    <div className="w-full min-h-screen bg-muted/20 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Candidates & Results
          </h1>
          <p className="text-muted-foreground mt-2">
            A summary of each candidate’s performance and details.
          </p>
        </div>

        <div className="bg-background border rounded-xl shadow-md p-6">
          {candidates.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No candidates found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-base font-semibold">
                    Candidate
                  </TableHead>
                  <TableHead className="text-base font-semibold">
                    Contact
                  </TableHead>
                  <TableHead className="text-base font-semibold">
                    Email
                  </TableHead>
                  <TableHead className="text-base font-semibold">
                    Tier
                  </TableHead>
                  <TableHead className="text-base font-semibold">
                    Score
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {candidates.map((candidate) => (
                  <TableRow
                    key={candidate.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="font-medium">
                      {candidate.fullName}
                    </TableCell>
                    <TableCell>{candidate.phone}</TableCell>
                    <TableCell>{candidate.email}</TableCell>
                    <TableCell className="capitalize">
                      {candidate.tier}
                    </TableCell>
                    <TableCell>
                      {candidate.answers?.length
                        ? `${calculatePercent(candidate.answers)}%`
                        : "0%"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
