"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Mail, Phone, TrendingUp } from "lucide-react";
import axios from "axios";
import React, { useEffect, useState } from "react";

interface Answer {
  selectedAnswer: boolean;
}

interface Candidate {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  tier: string;
  answers?: Answer[];
}

const Page = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const calculatePercent = (answers?: Answer[]): number => {
    if (!answers || answers.length === 0) return 0;
    const totalPassed = answers.filter(
      (answer) => answer.selectedAnswer === true
    ).length;
    return Math.round((totalPassed / answers.length) * 100);
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    if (score >= 40) return "outline";
    return "destructive";
  };

  const getTierColor = (tier: string) => {
    const colors: Record<string, string> = {
      gold: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      silver: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
      bronze:
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    };
    return (
      colors[tier.toLowerCase()] ||
      "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    );
  };

  useEffect(() => {
    const getCandidates = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await axios.get<Candidate[]>("/api/allCandidate");
        setCandidates(data);
      } catch (err) {
        setError("Failed to load candidates. Please try again.");
        console.error("Error fetching candidates:", err);
      } finally {
        setLoading(false);
      }
    };

    getCandidates();
  }, []);

  return (
    <div className="w-full min-h-screen bg-linear-to-br from-muted/30 to-muted/10 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8 text-center space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Candidates & Results
          </h1>
          <p className="text-muted-foreground text-lg">
            Performance summary and candidate details
          </p>
        </div>

        <div className="bg-background border rounded-xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading candidates...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16 space-y-3">
              <p className="text-destructive font-medium">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-sm text-primary hover:underline"
              >
                Retry
              </button>
            </div>
          ) : candidates.length === 0 ? (
            <div className="text-center py-16 space-y-2">
              <p className="text-muted-foreground text-lg">
                No candidates found
              </p>
              <p className="text-sm text-muted-foreground/70">
                Candidates will appear here once they complete the assessment
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent bg-muted/50">
                    <TableHead className="text-base font-semibold">
                      Candidate
                    </TableHead>
                    <TableHead className="text-base font-semibold">
                      Contact
                    </TableHead>
                    <TableHead className="text-base font-semibold">
                      Tier
                    </TableHead>
                    <TableHead className="text-base font-semibold text-right">
                      Score
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {candidates.map((candidate) => {
                    const score = calculatePercent(candidate.answers);
                    return (
                      <TableRow
                        key={candidate.id}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium text-base">
                              {candidate.fullName}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              {candidate.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            {candidate.phone}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`capitalize ${getTierColor(candidate.tier)}`}
                          >
                            {candidate.tier}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Badge
                              variant={getScoreBadgeVariant(score)}
                              className="font-semibold px-3 py-1"
                            >
                              {score}%
                            </Badge>
                            {score >= 70 && (
                              <TrendingUp className="h-4 w-4 text-green-600" />
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {!loading && !error && candidates.length > 0 && (
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Showing {candidates.length} candidate
            {candidates.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
