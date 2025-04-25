
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useInterview, InterviewType } from '@/contexts/InterviewContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { toast } from '@/components/ui/sonner';
import { 
  Calendar, 
  FileDown, 
  Star, 
  CheckCircle, 
  XCircle,
  BarChart,
  MessageSquare,
  FileText,
  Loader2
} from 'lucide-react';

const InterviewReports: React.FC = () => {
  const { interviews } = useInterview();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [interview, setInterview] = useState<InterviewType | null>(null);
  const [loadingPdf, setLoadingPdf] = useState(false);

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      const foundInterview = interviews.find(i => i.id === id);
      if (foundInterview && foundInterview.status === 'completed') {
        setInterview(foundInterview);
      } else if (foundInterview) {
        toast.error('Interview has not been completed yet');
        navigate('/interview-history');
      } else {
        toast.error('Interview not found');
        navigate('/interview-history');
      }
    }
  }, [searchParams, interviews, navigate]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  const handleDownloadReport = () => {
    if (!interview) return;
    
    setLoadingPdf(true);
    // Simulate PDF generation
    setTimeout(() => {
      toast.success('Report downloaded successfully');
      setLoadingPdf(false);
    }, 2000);
  };

  if (!interview) {
    return (
      <DashboardLayout title="Interview Reports">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 p-4">
            <h2 className="text-xl font-bold mb-4">Recent Reports</h2>
            {interviews.filter(i => i.status === 'completed').slice(0, 5).map((i) => (
              <div 
                key={i.id} 
                className="p-3 border rounded-md mb-3 hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/interview-reports?id=${i.id}`)}
              >
                <div className="font-medium">{i.candidateName}</div>
                <div className="text-sm text-gray-500">{formatDate(i.date)}</div>
              </div>
            ))}
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => navigate('/interview-history')}
            >
              View All Interviews
            </Button>
          </div>
          <div className="md:col-span-2 flex items-center justify-center p-8">
            <div className="text-center">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">No Report Selected</h3>
              <p className="text-gray-500 mb-6">
                Select an interview from the list to view its detailed report.
              </p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Interview Report">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{interview.candidateName}</h2>
          <div className="text-gray-500">Interview conducted on {formatDate(interview.date)}</div>
        </div>
        <Button
          onClick={handleDownloadReport}
          disabled={loadingPdf}
        >
          {loadingPdf ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating PDF...
            </>
          ) : (
            <>
              <FileDown className="mr-2 h-4 w-4" />
              Download Report
            </>
          )}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-700">Date</span>
                </div>
                <span className="text-sm font-medium">{formatDate(interview.date)}</span>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-700">Overall Rating</span>
                </div>
                <div className="flex">
                  {Array(5).fill(0).map((_, i) => (
                    <div 
                      key={i}
                      className={`w-5 h-5 rounded-full flex items-center justify-center mr-1 ${
                        i < Math.round((interview.feedback?.technicalRating || 0) + (interview.feedback?.communicationRating || 0)) / 2
                          ? 'bg-interview-primary text-white'
                          : 'bg-gray-200'
                      }`}
                    >
                      {i < Math.round((interview.feedback?.technicalRating || 0) + (interview.feedback?.communicationRating || 0)) / 2 && (
                        <CheckCircle className="h-3 w-3" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Technical Rating</span>
                  <span className="font-medium">{interview.feedback?.technicalRating}/5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-interview-primary h-2 rounded-full"
                    style={{ width: `${(interview.feedback?.technicalRating || 0) * 20}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Communication Rating</span>
                  <span className="font-medium">{interview.feedback?.communicationRating}/5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-interview-secondary h-2 rounded-full"
                    style={{ width: `${(interview.feedback?.communicationRating || 0) * 20}%` }}
                  ></div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <div className="font-medium mb-2">Recommendation</div>
                <div className={`px-3 py-2 rounded-md ${
                  (interview.feedback?.technicalRating || 0) + (interview.feedback?.communicationRating || 0) > 7
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                  <div className="flex items-center">
                    {(interview.feedback?.technicalRating || 0) + (interview.feedback?.communicationRating || 0) > 7 ? (
                      <>
                        <CheckCircle className="h-5 w-5 mr-2" />
                        <span className="font-medium">Recommended for hire</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-5 w-5 mr-2" />
                        <span className="font-medium">Not recommended at this time</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="col-span-1 lg:col-span-2">
          <Tabs defaultValue="report">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="report">Report</TabsTrigger>
              <TabsTrigger value="ai-analysis">AI Analysis</TabsTrigger>
              <TabsTrigger value="feedback">Interviewer Feedback</TabsTrigger>
            </TabsList>
            
            <TabsContent value="report">
              <Card>
                <CardHeader>
                  <CardTitle>Interview Report</CardTitle>
                  <CardDescription>Comprehensive assessment of the candidate</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Executive Summary</h3>
                      <p className="text-gray-700">
                        {interview.report?.summary || "No summary available."}
                      </p>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-medium mb-3 flex items-center text-green-700">
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Strengths
                        </h3>
                        <ul className="space-y-2">
                          {(interview.report?.strengths || []).map((strength, i) => (
                            <li key={i} className="flex items-start">
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mt-2 mr-2"></span>
                              <span className="text-gray-700">{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-3 flex items-center text-red-700">
                          <XCircle className="h-5 w-5 mr-2" />
                          Areas for Improvement
                        </h3>
                        <ul className="space-y-2">
                          {(interview.report?.weaknesses || []).map((weakness, i) => (
                            <li key={i} className="flex items-start">
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 mt-2 mr-2"></span>
                              <span className="text-gray-700">{weakness}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="ai-analysis">
              <Card>
                <CardHeader>
                  <CardTitle>AI Analysis</CardTitle>
                  <CardDescription>AI-powered assessment of the interview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <BarChart className="h-5 w-5 text-blue-700 mr-2" />
                        <h3 className="text-lg font-medium text-blue-700">Interview Analytics</h3>
                      </div>
                      <p className="text-gray-700">
                        {interview.report?.aiAnalysis || "AI analysis not available."}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-sm text-gray-500 mb-1">Communication Style</div>
                          <div className="text-lg font-medium">Articulate</div>
                          <div className="text-xs text-gray-500 mt-1">85% clarity score</div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-sm text-gray-500 mb-1">Technical Concepts</div>
                          <div className="text-lg font-medium">Proficient</div>
                          <div className="text-xs text-gray-500 mt-1">78% accuracy score</div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-sm text-gray-500 mb-1">Speaking Pace</div>
                          <div className="text-lg font-medium">Moderate</div>
                          <div className="text-xs text-gray-500 mt-1">142 wpm avg.</div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-sm text-gray-500 mb-1">Confidence Level</div>
                          <div className="text-lg font-medium">High</div>
                          <div className="text-xs text-gray-500 mt-1">92% confidence score</div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3 flex items-center">
                        <MessageSquare className="h-5 w-5 mr-2 text-gray-500" />
                        Key Points from Conversation
                      </h3>
                      <ul className="space-y-3">
                        <li className="bg-gray-50 p-3 rounded-md">
                          <div className="font-medium mb-1">React Hooks</div>
                          <p className="text-sm text-gray-700">The candidate demonstrated a strong understanding of React hooks and their implementation.</p>
                        </li>
                        <li className="bg-gray-50 p-3 rounded-md">
                          <div className="font-medium mb-1">State Management</div>
                          <p className="text-sm text-gray-700">Discussed Redux and Context API with appropriate use cases for each.</p>
                        </li>
                        <li className="bg-gray-50 p-3 rounded-md">
                          <div className="font-medium mb-1">Testing Approaches</div>
                          <p className="text-sm text-gray-700">Described unit and integration testing methodologies using Jest and React Testing Library.</p>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="feedback">
              <Card>
                <CardHeader>
                  <CardTitle>Interviewer Feedback</CardTitle>
                  <CardDescription>Detailed feedback provided by the interviewer</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="p-4 flex items-center space-x-4">
                          <div className="h-12 w-12 rounded-full bg-interview-primary flex items-center justify-center text-white font-bold text-lg">
                            {interview.feedback?.technicalRating || 0}
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Technical Rating</div>
                            <div className="font-medium">
                              {interview.feedback?.technicalRating === 5 ? 'Excellent' :
                               interview.feedback?.technicalRating === 4 ? 'Very Good' :
                               interview.feedback?.technicalRating === 3 ? 'Good' :
                               interview.feedback?.technicalRating === 2 ? 'Fair' : 'Poor'}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-4 flex items-center space-x-4">
                          <div className="h-12 w-12 rounded-full bg-interview-secondary flex items-center justify-center text-white font-bold text-lg">
                            {interview.feedback?.communicationRating || 0}
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Communication Rating</div>
                            <div className="font-medium">
                              {interview.feedback?.communicationRating === 5 ? 'Excellent' :
                               interview.feedback?.communicationRating === 4 ? 'Very Good' :
                               interview.feedback?.communicationRating === 3 ? 'Good' :
                               interview.feedback?.communicationRating === 2 ? 'Fair' : 'Poor'}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Interviewer Notes</h3>
                      <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
                        <p className="whitespace-pre-line text-gray-700">
                          {interview.feedback?.notes || 'No notes provided.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/interview-history')}
                    className="ml-auto"
                  >
                    Back to History
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InterviewReports;
