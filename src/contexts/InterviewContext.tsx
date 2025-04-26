import React, { createContext, useContext, useState } from "react";
import { toast } from "@/components/ui/sonner";
import axios from "axios";
import { log } from "node:console";
export type QuestionType = {
  id?: string;
  question: string;
  category: string;
  difficulty: string;
};

export type InterviewType = {
  id: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  date: string;
  status: "scheduled" | "completed" | "cancelled";
  jobDescription: string;
  resumeUrl?: string;
  interviewerLink?: string;
  candidateLink?: string;
  questions?: QuestionType[];
  feedback?: {
    communicationRating: number;
    technicalRating: number;
    notes: string;
  };
  report?: {
    strengths: string[];
    weaknesses: string[];
    summary: string;
    aiAnalysis: string;
    otherAspect: {
      Communication: {
        title: string;
        level: string;
        score: string;
      };
      Technical: {
        title: string;
        level: string;
        score: string;
      };
      SpeakingPace: {
        title: string;
        level: string;
        score: string;
      };
      Confidence: {
        title: string;
        level: string;
        score: string;
      };
    };
  };
};

type InterviewContextType = {
  interviews: InterviewType[];
  currentInterview: InterviewType | null;
  loading: boolean;
  generateQuestions: (
    resume: File | null,
    jobDescription: string
  ) => Promise<QuestionType[]>;
  scheduleInterview: (
    interviewData: Omit<
      InterviewType,
      "id" | "status" | "interviewerLink" | "candidateLink"
    >
  ) => Promise<InterviewType>;
  setCurrentInterview: (interview: InterviewType | null) => void;
  submitFeedback: (
    interviewId: string,
    feedback: InterviewType["feedback"]
  ) => Promise<InterviewType>;
  getInterviewById: (id: string) => InterviewType | undefined;
};

const InterviewContext = createContext<InterviewContextType | undefined>(
  undefined
);

// Sample mock data
const mockInterviews: InterviewType[] = [
  {
    id: "1",
    candidateName: "John Doe",
    candidateEmail: "john@example.com",
    candidatePhone: "555-123-4567",
    date: "2025-05-01T10:00:00",
    status: "scheduled",
    jobDescription:
      "Senior React Developer position requiring 5+ years of experience.",
    interviewerLink: "https://meet.example.com/interview-123-interviewer",
    candidateLink: "https://meet.example.com/interview-123-candidate",
  },
  {
    id: "2",
    candidateName: "Jane Smith",
    candidateEmail: "jane@example.com",
    candidatePhone: "555-987-6543",
    date: "2025-04-28T14:00:00",
    status: "completed",
    jobDescription:
      "Junior Frontend Developer with React and TypeScript experience.",
    feedback: {
      communicationRating: 4,
      technicalRating: 5,
      notes: "Excellent candidate with strong technical skills.",
    },
    generated_report: {
      strengths: [
        "Strong React knowledge",
        "Excellent communication",
        "Problem-solving skills",
      ],
      weaknesses: ["Limited TypeScript experience"],
      summary:
        "Jane is a strong good candidate with excellent React skills and communication abilities.",
      aiAnalysis:
        "The candidate demonstrated clear communication and strong technical knowledge throughout the interview.",
    },
  },
];

export const InterviewProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [interviews, setInterviews] = useState<InterviewType[]>(mockInterviews);
  const [currentInterview, setCurrentInterview] =
    useState<InterviewType | null>(null);
  const [loading, setLoading] = useState(false);

  const generateQuestions = async (
    jobTitle: string,
    jobDescription: string,
    workExperience: string,
    requiredSkills: string
  ): Promise<QuestionType[]> => {
    setLoading(true);
    try {
      // Concatenate the strings with headings, including jobTitle
      const combinedDescription = `
        Job Title: ${jobTitle}
        Job Description: ${jobDescription}
        Work Experience: ${workExperience}
        Required Skills: ${requiredSkills}
      `;

      // API call with the combined string
      const response = await axios.post(
        "https://0241-2409-40c2-1051-2e33-28e7-bab6-55d-4dea.ngrok-free.app/api/generate_questions",
        {
          job_description: combinedDescription, // Use the concatenated string with headings
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const questions = response.data.questions;

      toast.success("Questions generated successfully");
      return questions;
    } catch (error) {
      toast.error("Failed to generate questions");
      console.error("Error generating questions:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const scheduleInterview = async (
    interviewData: Omit<
      InterviewType,
      "id" | "status" | "interviewerLink" | "candidateLink"
    >
  ): Promise<InterviewType> => {
    setLoading(true);
    const interviewerName = localStorage.getItem("interview-user");
    const interviewerEmail = localStorage.getItem("interview-email");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/generate_join_link`,
        {
          interviewer: interviewerName,
          interviewer_email: interviewerEmail,
          interviewee: interviewData.candidateName,
          candidate_email: interviewData.candidateEmail,
          scheduled_date: interviewData.date,
          scheduled_time: interviewData.date,
          job_description: interviewData.jobDescription,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Cookie:
              "session=eyJlbWFpbCI6InRlc3R1c2VyMUBleGFtcGxlLmNvbSIsIm5hbWUiOiJUZXN0IFVzZXIiLCJyb2xlIjoiYWRtaW4ifQ.aAuNtg.-oXSB-IfGatnvqL3ikZG5m9Qjak",
          },
        }
      );

      const {
        interviewer_link,
        interviewee_link,
        room_id,
        generated_questions,
      } = response.data;

      const newInterview: InterviewType = {
        ...interviewData,
        id: room_id,
        status: "scheduled",
        interviewerLink: interviewer_link,
        candidateLink: interviewee_link,
        questions: generated_questions || [],
      };

      setInterviews([...interviews, newInterview]);
      toast.success("Interview scheduled successfully");
      return newInterview;
    } catch (error: any) {
      console.error("API Error:", error);
      toast.error("Failed to schedule interview");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const submitFeedback = async (
    interviewId: string,
    feedback: InterviewType["feedback"]
  ): Promise<InterviewType> => {
    setLoading(true);
    try {
      // Replace mock API call with real API call

      // Update interview with feedback and actual report
      const updatedInterviews = interviews.map((interview) => {
        if (interview.id === interviewId) {
          return {
            ...interview,
            status: "completed" as const,
            feedback,
          };
        }
        return interview;
      });

      setInterviews(updatedInterviews);

      const updatedInterview = updatedInterviews.find(
        (i) => i.id === interviewId
      );

      if (updatedInterview) {
        setCurrentInterview(updatedInterview);
        toast.success("Feedback submitted successfully");
        return updatedInterview;
      }

      throw new Error("Interview not found");
    } catch (error) {
      toast.error("Failed to submit feedback");
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const generateReport = async (
    interviewId: string
  ): Promise<InterviewType> => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://0241-2409-40c2-1051-2e33-28e7-bab6-55d-4dea.ngrok-free.app/generate_report",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie:
              "session=.eJxljsEKwjAQRH9FcpZClXrw5EfoOSzNiIFuEjabVhD_3VVQCt523jA783BjE0FSLzmzj8Ed3dAP18Ou37utA1OcDCmqtgrpT7gTlwndmNn8mBQyRyy-KonC4ioNKwPwKpTqKLGofVqHIH9eIoZdZ-vbXKzQkOTpjShwTCYVXDy1ELMvpLfPuB_5Tu8Wmt3zBZVhTL8.aAxtZQ.Dh2jUj0UhlXiy2bdQ6cz4LBjynE",
          },
          credentials: "include",
          body: JSON.stringify({
            room_id: interviewId, // use interviewId passed into function
          }),
        }
      );

      if (!response.ok) {
        throw new Error("API call failed");
      }

      const reports = await response.json();
      console.log("report", reports?.report);
      const updatedInterviews = interviews.map((interview) => {
        if (interview.id === interviewId) {
          return {
            ...interview,
            status: "completed" as const,
            report: reports,
          };
        }
        return interview;
      });

      setInterviews(updatedInterviews);

      const updatedInterview = updatedInterviews.find(
        (i) => i.id === interviewId
      );

      if (updatedInterview) {
        setCurrentInterview(updatedInterview);
        toast.success("Feedback submitted successfully");
        return updatedInterview;
      }

      throw new Error("Interview not found");
    } catch (error) {
      toast.error("Failed to submit feedback");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getInterviewById = (id: string) => {
    return interviews.find((interview) => interview.id === id);
  };

  return (
    <InterviewContext.Provider
      value={{
        interviews,
        currentInterview,
        loading,
        generateQuestions,
        scheduleInterview,
        setCurrentInterview,
        submitFeedback,
        getInterviewById,
        generateReport,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
};

export const useInterview = () => {
  const context = useContext(InterviewContext);
  if (context === undefined) {
    throw new Error("useInterview must be used within an InterviewProvider");
  }
  return context;
};
