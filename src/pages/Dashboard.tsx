
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useInterview } from '@/contexts/InterviewContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, FileText, History, HelpCircle, Video } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { interviews } = useInterview();

  const scheduledInterviews = interviews.filter(
    (interview) => interview.status === 'scheduled'
  );
  
  const completedInterviews = interviews.filter(
    (interview) => interview.status === 'completed'
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  return (
    <DashboardLayout title="Dashboard">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome back, {user?.name}
        </h2>
        <p className="text-gray-600">
          Manage your interviews and assessments from this dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Upcoming Interviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-interview-primary">
              {scheduledInterviews.length}
            </div>
            <p className="text-sm text-gray-500 mt-1">scheduled interviews</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-interview-secondary">
              {completedInterviews.length}
            </div>
            <p className="text-sm text-gray-500 mt-1">completed interviews</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-interview-accent">
              {interviews.length}
            </div>
            <p className="text-sm text-gray-500 mt-1">total interviews</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Avg. Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {completedInterviews.length ? 
                (completedInterviews.reduce((sum, interview) => 
                  sum + ((interview.feedback?.technicalRating || 0) + (interview.feedback?.communicationRating || 0)) / 2, 0) / completedInterviews.length).toFixed(1) 
                : 'N/A'}
            </div>
            <p className="text-sm text-gray-500 mt-1">avg. candidate score</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you can perform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link to="/generate-questions">
                <Button variant="outline" className="w-full justify-start h-auto py-3">
                  <HelpCircle className="mr-2 h-5 w-5 text-interview-primary" />
                  <div className="text-left">
                    <div className="font-medium">Generate Questions</div>
                    <div className="text-xs text-gray-500">Create interview questions</div>
                  </div>
                </Button>
              </Link>
              <Link to="/schedule-interview">
                <Button variant="outline" className="w-full justify-start h-auto py-3">
                  <Calendar className="mr-2 h-5 w-5 text-interview-secondary" />
                  <div className="text-left">
                    <div className="font-medium">Schedule Interview</div>
                    <div className="text-xs text-gray-500">Set up a new interview</div>
                  </div>
                </Button>
              </Link>
              <Link to="/interview-session">
                <Button variant="outline" className="w-full justify-start h-auto py-3">
                  <Video className="mr-2 h-5 w-5 text-interview-accent" />
                  <div className="text-left">
                    <div className="font-medium">Join Interview</div>
                    <div className="text-xs text-gray-500">Start an interview session</div>
                  </div>
                </Button>
              </Link>
              <Link to="/interview-history">
                <Button variant="outline" className="w-full justify-start h-auto py-3">
                  <History className="mr-2 h-5 w-5 text-gray-600" />
                  <div className="text-left">
                    <div className="font-medium">View History</div>
                    <div className="text-xs text-gray-500">Review past interviews</div>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Interviews</CardTitle>
            <CardDescription>Your scheduled interviews</CardDescription>
          </CardHeader>
          <CardContent>
            {scheduledInterviews.length > 0 ? (
              <div className="space-y-4">
                {scheduledInterviews.slice(0, 3).map((interview) => (
                  <div key={interview.id} className="flex items-start gap-3 border-b border-gray-100 pb-3">
                    <div className="bg-blue-100 p-2 rounded-md">
                      <Calendar className="h-5 w-5 text-interview-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{interview.candidateName}</h4>
                      <p className="text-sm text-gray-500">{formatDate(interview.date)}</p>
                    </div>
                    <Link to={`/interview-session?id=${interview.id}`}>
                      <Button size="sm" variant="outline">
                        Join
                      </Button>
                    </Link>
                  </div>
                ))}
                {scheduledInterviews.length > 3 && (
                  <div className="text-center mt-4">
                    <Link to="/interview-history">
                      <Button variant="link" className="text-interview-primary">View all interviews</Button>
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500 mb-4">No upcoming interviews</p>
                <Link to="/schedule-interview">
                  <Button>Schedule Interview</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>Latest interview assessments</CardDescription>
        </CardHeader>
        <CardContent>
          {completedInterviews.length > 0 ? (
            <div className="space-y-4">
              {completedInterviews.slice(0, 5).map((interview) => (
                <div key={interview.id} className="flex items-center gap-4 border-b border-gray-100 pb-4">
                  <div className="bg-gray-100 p-2 rounded-md">
                    <FileText className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{interview.candidateName}</h4>
                    <p className="text-sm text-gray-500">Completed on {formatDate(interview.date)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm">
                      <span className="font-medium">Tech:</span>{' '}
                      <span className={`${interview.feedback?.technicalRating && interview.feedback.technicalRating >= 4 ? 'text-green-600' : 'text-orange-500'}`}>
                        {interview.feedback?.technicalRating || 'N/A'}/5
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Comm:</span>{' '}
                      <span className={`${interview.feedback?.communicationRating && interview.feedback.communicationRating >= 4 ? 'text-green-600' : 'text-orange-500'}`}>
                        {interview.feedback?.communicationRating || 'N/A'}/5
                      </span>
                    </div>
                    <Link to={`/interview-reports?id=${interview.id}`}>
                      <Button size="sm" variant="outline">
                        View Report
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500">No completed interviews yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Dashboard;
