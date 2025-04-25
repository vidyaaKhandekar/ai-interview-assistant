
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useInterview, InterviewType } from '@/contexts/InterviewContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/sonner';
import { 
  Calendar,
  Search,
  MoreHorizontal,
  FileText,
  Video,
  FileDown,
  Filter,
  PlusCircle
} from 'lucide-react';

const InterviewHistory: React.FC = () => {
  const { interviews } = useInterview();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'scheduled' | 'completed'>('all');

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

  const filteredInterviews = interviews.filter(interview => {
    const matchesSearch = interview.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         interview.candidateEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && interview.status === statusFilter;
  });

  const handleViewReport = (interview: InterviewType) => {
    if (interview.status === 'completed') {
      navigate(`/interview-reports?id=${interview.id}`);
    } else {
      toast.error('Report not available for scheduled interviews');
    }
  };

  const handleJoinInterview = (interview: InterviewType) => {
    if (interview.status === 'scheduled') {
      navigate(`/interview-session?id=${interview.id}`);
    } else {
      toast.error('Cannot join a completed interview');
    }
  };

  return (
    <DashboardLayout title="Interview History">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Interview History</h1>
          <p className="text-gray-600">View and manage all your interviews</p>
        </div>
        <Link to="/schedule-interview">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Schedule New Interview
          </Button>
        </Link>
      </div>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="min-w-[160px]">
                  <Filter className="mr-2 h-4 w-4" />
                  {statusFilter === 'all' ? 'All Status' : 
                   statusFilter === 'scheduled' ? 'Scheduled' : 'Completed'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                  All Status
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('scheduled')}>
                  Scheduled
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('completed')}>
                  Completed
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Interviews</CardTitle>
          <CardDescription>
            Showing {filteredInterviews.length} of {interviews.length} interviews
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredInterviews.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInterviews.map((interview) => (
                    <TableRow key={interview.id}>
                      <TableCell>
                        <div className="font-medium">{interview.candidateName}</div>
                        <div className="text-sm text-gray-500">{interview.candidateEmail}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{formatDate(interview.date)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${interview.status === 'scheduled' 
                            ? 'bg-blue-100 text-blue-800' 
                            : interview.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {interview.status === 'completed' && interview.feedback ? (
                          <div className="flex items-center">
                            <div className={`h-6 w-6 rounded-full bg-interview-primary text-white flex items-center justify-center text-xs font-medium mr-1`}>
                              {interview.feedback.technicalRating}
                            </div>
                            <div className={`h-6 w-6 rounded-full bg-interview-secondary text-white flex items-center justify-center text-xs font-medium`}>
                              {interview.feedback.communicationRating}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-500">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleViewReport(interview)}
                              disabled={interview.status !== 'completed'}
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              View Report
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleJoinInterview(interview)}
                              disabled={interview.status !== 'scheduled'}
                            >
                              <Video className="mr-2 h-4 w-4" />
                              Join Interview
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                // Simulate download
                                toast.success('Interview details exported');
                              }}
                            >
                              <FileDown className="mr-2 h-4 w-4" />
                              Export
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="inline-flex items-center justify-center rounded-full bg-gray-100 p-3 mb-4">
                <Calendar className="h-6 w-6 text-gray-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">No interviews found</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {searchTerm || statusFilter !== 'all' 
                  ? 'No interviews match your search criteria. Try adjusting your filters.' 
                  : 'You have not conducted any interviews yet. Schedule an interview to get started.'}
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Link to="/schedule-interview">
                  <Button>Schedule an Interview</Button>
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default InterviewHistory;
