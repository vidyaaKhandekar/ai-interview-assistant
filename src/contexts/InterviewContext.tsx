
import React, { createContext, useContext, useState } from 'react';
import { toast } from '@/components/ui/sonner';

export type QuestionType = {
  id: string;
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
  status: 'scheduled' | 'completed' | 'cancelled';
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
  };
};

type InterviewContextType = {
  interviews: InterviewType[];
  currentInterview: InterviewType | null;
  loading: boolean;
  generateQuestions: (resume: File | null, jobDescription: string) => Promise<QuestionType[]>;
  scheduleInterview: (interviewData: Omit<InterviewType, 'id' | 'status' | 'interviewerLink' | 'candidateLink'>) => Promise<InterviewType>;
  setCurrentInterview: (interview: InterviewType | null) => void;
  submitFeedback: (interviewId: string, feedback: InterviewType['feedback']) => Promise<InterviewType>;
  getInterviewById: (id: string) => InterviewType | undefined;
};

const InterviewContext = createContext<InterviewContextType | undefined>(undefined);

// Sample mock data
const mockInterviews: InterviewType[] = [
  {
    id: '1',
    candidateName: 'John Doe',
    candidateEmail: 'john@example.com',
    candidatePhone: '555-123-4567',
    date: '2025-05-01T10:00:00',
    status: 'scheduled',
    jobDescription: 'Senior React Developer position requiring 5+ years of experience.',
    interviewerLink: 'https://meet.example.com/interview-123-interviewer',
    candidateLink: 'https://meet.example.com/interview-123-candidate',
  },
  {
    id: '2',
    candidateName: 'Jane Smith',
    candidateEmail: 'jane@example.com',
    candidatePhone: '555-987-6543',
    date: '2025-04-28T14:00:00',
    status: 'completed',
    jobDescription: 'Junior Frontend Developer with React and TypeScript experience.',
    feedback: {
      communicationRating: 4,
      technicalRating: 5,
      notes: 'Excellent candidate with strong technical skills.'
    },
    report: {
      strengths: ['Strong React knowledge', 'Excellent communication', 'Problem-solving skills'],
      weaknesses: ['Limited TypeScript experience'],
      summary: 'Jane is a strong candidate with excellent React skills and communication abilities.',
      aiAnalysis: 'The candidate demonstrated clear communication and strong technical knowledge throughout the interview.'
    }
  },
];

export const InterviewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [interviews, setInterviews] = useState<InterviewType[]>(mockInterviews);
  const [currentInterview, setCurrentInterview] = useState<InterviewType | null>(null);
  const [loading, setLoading] = useState(false);

  const generateQuestions = async (resume: File | null, jobDescription: string): Promise<QuestionType[]> => {
    setLoading(true);
    try {
      // Mock API call - would be replaced with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock questions - would be replaced with actual API response
      const questions: QuestionType[] = [
        {
          id: '1',
          question: 'Can you explain your experience with React hooks?',
          category: 'Technical',
          difficulty: 'Medium'
        },
        {
          id: '2',
          question: 'How do you manage state in large React applications?',
          category: 'Technical',
          difficulty: 'Hard'
        },
        {
          id: '3',
          question: 'Describe a challenging project you worked on and how you overcame obstacles.',
          category: 'Behavioral',
          difficulty: 'Medium'
        },
        {
          id: '4',
          question: 'What is your approach to testing React components?',
          category: 'Technical',
          difficulty: 'Medium'
        },
        {
          id: '5',
          question: 'How do you handle performance optimization in React?',
          category: 'Technical',
          difficulty: 'Hard'
        },
      ];
      
      toast.success("Questions generated successfully");
      return questions;
    } catch (error) {
      toast.error("Failed to generate questions");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const scheduleInterview = async (interviewData: Omit<InterviewType, 'id' | 'status' | 'interviewerLink' | 'candidateLink'>): Promise<InterviewType> => {
    setLoading(true);
    try {
      // Mock API call - would be replaced with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create new interview with mock data
      const newInterview: InterviewType = {
        ...interviewData,
        id: Math.random().toString(36).substr(2, 9),
        status: 'scheduled',
        interviewerLink: `https://meet.example.com/interview-${Date.now()}-interviewer`,
        candidateLink: `https://meet.example.com/interview-${Date.now()}-candidate`
      };
      
      setInterviews([...interviews, newInterview]);
      toast.success("Interview scheduled successfully");
      return newInterview;
    } catch (error) {
      toast.error("Failed to schedule interview");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const submitFeedback = async (interviewId: string, feedback: InterviewType['feedback']): Promise<InterviewType> => {
    setLoading(true);
    try {
      // Mock API call - would be replaced with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update interview with feedback and generate mock report
      const updatedInterviews = interviews.map(interview => {
        if (interview.id === interviewId) {
          return {
            ...interview,
            status: 'completed' as const,
            feedback,
            report: {
              strengths: [
                'Strong problem-solving skills',
                'Excellent communication',
                'Deep technical knowledge'
              ],
              weaknesses: [
                'Could improve system design explanations',
                'Limited experience with cloud architecture'
              ],
              summary: 'Overall, the candidate demonstrated strong technical abilities and excellent communication skills.',
              aiAnalysis: 'Based on the conversation analysis, the candidate shows confidence in their responses and provides detailed technical explanations. Their communication style is clear and concise.'
            }
          };
        }
        return interview;
      });
      
      setInterviews(updatedInterviews);
      const updatedInterview = updatedInterviews.find(i => i.id === interviewId);
      
      if (updatedInterview) {
        setCurrentInterview(updatedInterview);
        toast.success("Feedback submitted successfully");
        return updatedInterview;
      }
      
      throw new Error('Interview not found');
    } catch (error) {
      toast.error("Failed to submit feedback");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getInterviewById = (id: string) => {
    return interviews.find(interview => interview.id === id);
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
        getInterviewById
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
};

export const useInterview = () => {
  const context = useContext(InterviewContext);
  if (context === undefined) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  return context;
};
