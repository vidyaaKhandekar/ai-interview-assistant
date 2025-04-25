
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useInterview, InterviewType } from '@/contexts/InterviewContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
import { Loader2 } from 'lucide-react';

const feedbackSchema = z.object({
  communicationRating: z.number().min(1).max(5),
  technicalRating: z.number().min(1).max(5),
  notes: z.string().min(10, { message: 'Please provide at least 10 characters of feedback' }),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

const Feedback: React.FC = () => {
  const { interviews, submitFeedback, loading } = useInterview();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [interview, setInterview] = useState<InterviewType | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      communicationRating: 3,
      technicalRating: 3,
      notes: '',
    },
  });

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      const foundInterview = interviews.find(i => i.id === id);
      if (foundInterview) {
        setInterview(foundInterview);
      } else {
        toast.error('Interview not found');
        navigate('/dashboard');
      }
    } else {
      navigate('/dashboard');
    }
  }, [searchParams, interviews, navigate]);

  const onSubmit = async (data: FeedbackFormValues) => {
    if (!interview) return;
    
    setSubmitting(true);
    try {
      await submitFeedback(interview.id, {
        communicationRating: data.communicationRating,
        technicalRating: data.technicalRating,
        notes: data.notes,
      });
      
      toast.success('Feedback submitted successfully');
      navigate(`/interview-reports?id=${interview.id}`);
    } catch (error) {
      toast.error('Failed to submit feedback');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!interview) {
    return (
      <DashboardLayout title="Interview Feedback">
        <div className="flex items-center justify-center h-[70vh]">
          <Loader2 className="h-8 w-8 animate-spin text-interview-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Interview Feedback">
      <Card>
        <CardHeader>
          <CardTitle>Provide Interview Feedback</CardTitle>
          <CardDescription>
            Rate and provide feedback for the interview with {interview.candidateName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="communicationRating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Communication Skills</FormLabel>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Poor</span>
                            <span className="text-sm text-gray-500">Excellent</span>
                          </div>
                          <div className="flex justify-between items-center">
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <button
                                key={rating}
                                type="button"
                                onClick={() => field.onChange(rating)}
                                className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-medium focus:outline-none transition-colors ${
                                  field.value === rating
                                    ? 'bg-interview-primary text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                {rating}
                              </button>
                            ))}
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="technicalRating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Technical Knowledge</FormLabel>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Poor</span>
                            <span className="text-sm text-gray-500">Excellent</span>
                          </div>
                          <div className="flex justify-between items-center">
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <button
                                key={rating}
                                type="button"
                                onClick={() => field.onChange(rating)}
                                className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-medium focus:outline-none transition-colors ${
                                  field.value === rating
                                    ? 'bg-interview-secondary text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                {rating}
                              </button>
                            ))}
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes & Feedback</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Provide detailed feedback about the candidate's performance, strengths, weaknesses, and overall fit for the role..."
                          className="min-h-[200px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <CardFooter className="flex justify-between px-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={submitting || loading}
                  className="min-w-[120px]"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Feedback'
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Feedback;
