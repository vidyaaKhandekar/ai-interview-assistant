import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  useInterview,
  InterviewType,
  QuestionType,
} from "@/contexts/InterviewContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/sonner";
import {
  Clipboard,
  Copy,
  MicOff,
  Mic,
  MessageSquare,
  Video,
  VideoOff,
  PhoneCall,
  PhoneOff,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

const InterviewSession: React.FC = () => {
  const { interviews, setCurrentInterview } = useInterview();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState<InterviewType | null>(null);
  const [feedbackEnabled, setFeedbackEnabled] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<{
    communicationScore: number;
    confidence: number;
    clarity: number;
    technicalAccuracy: number;
    recentFeedback: string;
  }>({
    communicationScore: 0,
    confidence: 0,
    clarity: 0,
    technicalAccuracy: 0,
    recentFeedback: "",
  });
  const [questions, setQuestions] = useState<QuestionType[]>([
    {
      id: "1",
      question: "Can you explain your experience with React hooks?",
      category: "Technical",
      difficulty: "Medium",
    },
    {
      id: "2",
      question: "How do you manage state in large React applications?",
      category: "Technical",
      difficulty: "Hard",
    },
    {
      id: "3",
      question:
        "Describe a challenging project you worked on and how you overcame obstacles.",
      category: "Behavioral",
      difficulty: "Medium",
    },
    {
      id: "4",
      question: "What is your approach to testing React components?",
      category: "Technical",
      difficulty: "Medium",
    },
    {
      id: "5",
      question: "How do you handle performance optimization in React?",
      category: "Technical",
      difficulty: "Hard",
    },
  ]);
  const [callActive, setCallActive] = useState(false);
  const [micActive, setMicActive] = useState(true);
  const [videoActive, setVideoActive] = useState(true);

  // Add new state for popup window
  const [popupWindow, setPopupWindow] = useState<Window | null>(null);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      const foundInterview = interviews.find((i) => i.id === id);
      if (foundInterview) {
        setInterview(foundInterview);
        setCurrentInterview(foundInterview);
      } else {
        toast.error("Interview not found");
        navigate("/dashboard");
      }
    }
  }, [searchParams, interviews, navigate, setCurrentInterview]);

  useEffect(() => {
    // Simulate real-time AI analysis during active call
    if (callActive && feedbackEnabled) {
      const updateInterval = setInterval(() => {
        setAiAnalysis({
          communicationScore: Math.min(
            10,
            Math.max(0, aiAnalysis.communicationScore + (Math.random() - 0.4))
          ),
          confidence: Math.min(
            10,
            Math.max(0, aiAnalysis.confidence + (Math.random() - 0.5))
          ),
          clarity: Math.min(
            10,
            Math.max(0, aiAnalysis.clarity + (Math.random() - 0.5))
          ),
          technicalAccuracy: Math.min(
            10,
            Math.max(0, aiAnalysis.technicalAccuracy + (Math.random() - 0.5))
          ),
          recentFeedback: getFeedbackMessage(),
        });
      }, 5000);

      return () => clearInterval(updateInterval);
    }
  }, [callActive, feedbackEnabled, aiAnalysis]);

  const getFeedbackMessage = () => {
    const messages = [
      "Candidate is explaining concepts clearly and with good examples",
      "Good technical depth in the last answer about React hooks",
      "Speaking a bit too quickly, might want to slow down",
      "Good use of technical terminology",
      "The explanation of state management is comprehensive",
      "Candidate seems nervous when discussing testing approaches",
      "Strong answer on performance optimization",
      "Could benefit from more concrete examples",
      "Good communication style and clarity",
      "Excellent explanation of complex concepts in simple terms",
    ];

    return messages[Math.floor(Math.random() * messages.length)];
  };

  // Add popup window handling
  const openPopupWindow = () => {
    const width = 800;
    const height = 600;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    const popup = window.open(
      "https://0241-2409-40c2-1051-2e33-28e7-bab6-55d-4dea.ngrok-free.app/join?room_id=7e8b9c4c&display_name=av&mute_audio=0&mute_video=0",
      "InterviewCall",
      `width=${width},height=${height},left=${left},top=${top}`
    );

    if (popup) {
      setPopupWindow(popup);
      // Check if popup is closed
      const timer = setInterval(() => {
        if (popup.closed) {
          clearInterval(timer);
          setPopupWindow(null);
        }
      }, 1000);
    }
  };

  // Modified handleStartMeeting
  const handleStartMeeting = () => {
    setCallActive(true);
    toast.success("Interview session started");
    openPopupWindow();

    // Simulate AI beginning analysis after a short delay
    setTimeout(() => {
      setFeedbackEnabled(true);
      setAiAnalysis({
        communicationScore: 7,
        confidence: 6,
        clarity: 7,
        technicalAccuracy: 8,
        recentFeedback: "Candidate introduction is clear and concise",
      });
    }, 3000);
  };

  // Modified handleEndMeeting
  const handleEndMeeting = () => {
    setCallActive(false);
    if (popupWindow && !popupWindow.closed) {
      popupWindow.close();
    }
    toast.success("Interview session ended");
    navigate(`/feedback?id=${interview?.id}`);
  };

  const toggleMic = () => {
    setMicActive(!micActive);
    toast(micActive ? "Microphone muted" : "Microphone activated");
  };

  const toggleVideo = () => {
    setVideoActive(!videoActive);
    toast(videoActive ? "Camera turned off" : "Camera turned on");
  };

  const copyQuestion = (question: string) => {
    navigator.clipboard.writeText(question);
    toast.success("Question copied to clipboard");
  };

  const [reloadKey, setReloadKey] = useState(0);

  const handleReloadIframe = () => {
    setReloadKey((prev) => prev + 1); // Increment to force iframe remount
  };
  if (!interview) {
    return (
      <DashboardLayout title="Interview Session">
        <div className="flex items-center justify-center h-[70vh]">
          <div className="text-center">
            <p className="text-gray-500 mb-4">No interview selected</p>
            <Button onClick={() => navigate("/schedule-interview")}>
              Schedule an Interview
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Interview Session">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader className="border-b">
              <div className="flex justify-between items-center">
                <CardTitle>Video Interview</CardTitle>
                <div className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  {interview.candidateName}
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow p-0 overflow-hidden">
              {callActive ? (
                <div className="relative w-full h-[60vh] bg-gray-900">
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    {popupWindow && !popupWindow.closed ? (
                      <div className="text-center text-white">
                        <Video className="h-16 w-16 mx-auto mb-4" />
                        <p className="text-lg mb-2">
                          Video call is active in popup window
                        </p>
                        <p className="text-sm text-gray-400">
                          You can minimize this window and focus on the call
                        </p>
                      </div>
                    ) : (
                      <div className="text-center text-white">
                        <VideoOff className="h-16 w-16 mx-auto mb-4" />
                        <p className="text-lg mb-2">
                          Video call window was closed
                        </p>
                        <Button
                          onClick={openPopupWindow}
                          variant="outline"
                          className="mt-4"
                        >
                          Reopen Call Window
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 bg-gray-800 bg-opacity-80 p-4 flex justify-center space-x-4">
                    <Button
                      onClick={handleEndMeeting}
                      variant="destructive"
                      className="px-6"
                    >
                      <PhoneOff className="mr-2 h-4 w-4" />
                      End Call
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6">
                  <div className="rounded-full bg-blue-100 p-4 mb-4">
                    <PhoneCall className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">
                    Ready to start the interview?
                  </h3>
                  <p className="text-gray-500 mb-6 max-w-md">
                    Click the button below to start the interview session with{" "}
                    {interview.candidateName}.
                  </p>

                  <div className="space-y-4 w-full max-w-md">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        Interviewer Link:
                      </p>
                      <div className="flex items-center gap-2">
                        <Input
                          value={interview.interviewerLink}
                          readOnly
                          className="bg-gray-50 py-2 px-3 rounded border w-full"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              interview.interviewerLink || ""
                            );
                            toast.success("Link copied");
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        Candidate Link:
                      </p>
                      <div className="flex items-center gap-2">
                        <Input
                          value={interview.candidateLink}
                          readOnly
                          className="bg-gray-50 py-2 px-3 rounded border w-full"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              interview.candidateLink || ""
                            );
                            toast.success("Link copied");
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <Button
                      className="w-full mt-6"
                      size="lg"
                      onClick={handleStartMeeting}
                    >
                      Start Meeting
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Tabs defaultValue="questions" className="h-full flex flex-col">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="questions">Questions</TabsTrigger>
              <TabsTrigger value="analysis" disabled={!feedbackEnabled}>
                AI Analysis
              </TabsTrigger>
            </TabsList>

            <TabsContent value="questions" className="flex-grow">
              <Card className="h-full flex flex-col">
                <CardHeader className="border-b">
                  <CardTitle className="text-base">
                    Suggested Questions
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 overflow-y-auto flex-grow">
                  <div className="space-y-1 p-4">
                    {questions.map((question) => (
                      <div
                        key={question.id}
                        className="p-3 hover:bg-gray-50 rounded-md group relative"
                      >
                        <div className="flex items-start gap-2">
                          <div
                            className={`flex-shrink-0 w-2 h-2 mt-2 rounded-full ${
                              question.difficulty === "Easy"
                                ? "bg-green-500"
                                : question.difficulty === "Medium"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                          ></div>
                          <div className="flex-grow">
                            <p className="text-sm text-gray-800">
                              {question.question}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full ${
                                  question.category === "Technical"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {question.category}
                              </span>
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full ${
                                  question.difficulty === "Easy"
                                    ? "bg-green-100 text-green-800"
                                    : question.difficulty === "Medium"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {question.difficulty}
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => copyQuestion(question.question)}
                          >
                            <Clipboard className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analysis" className="flex-grow">
              <Card className="h-full flex flex-col">
                <CardHeader className="border-b pb-3">
                  <CardTitle className="text-base">
                    Real-time AI Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 overflow-auto flex-grow">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          Communication
                        </span>
                        <span className="text-sm font-medium text-gray-700">
                          {Math.round(aiAnalysis.communicationScore * 10) / 10}
                          /10
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{
                            width: `${aiAnalysis.communicationScore * 10}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          Confidence
                        </span>
                        <span className="text-sm font-medium text-gray-700">
                          {Math.round(aiAnalysis.confidence * 10) / 10}/10
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-green-600 h-2.5 rounded-full"
                          style={{ width: `${aiAnalysis.confidence * 10}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          Clarity
                        </span>
                        <span className="text-sm font-medium text-gray-700">
                          {Math.round(aiAnalysis.clarity * 10) / 10}/10
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-purple-600 h-2.5 rounded-full"
                          style={{ width: `${aiAnalysis.clarity * 10}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          Technical Accuracy
                        </span>
                        <span className="text-sm font-medium text-gray-700">
                          {Math.round(aiAnalysis.technicalAccuracy * 10) / 10}
                          /10
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-orange-600 h-2.5 rounded-full"
                          style={{
                            width: `${aiAnalysis.technicalAccuracy * 10}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        AI Feedback
                      </h4>
                      <div className="bg-gray-50 p-3 rounded-md text-sm">
                        {aiAnalysis.recentFeedback}
                      </div>
                    </div>

                    <div className="flex space-x-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1">
                        <ThumbsDown className="h-4 w-4 mr-1" /> Not Useful
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <ThumbsUp className="h-4 w-4 mr-1" /> Useful
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

// Helper component for the input field
const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (
  props
) => {
  return <input {...props} />;
};

export default InterviewSession;
