
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useInterview, QuestionType } from '@/contexts/InterviewContext';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
import { HelpCircle, Upload } from 'lucide-react';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

const generateQuestionsSchema = z.object({
  jobDescription: z.string().min(20, { message: 'Job description is required and should be detailed' }),
  resume: z
    .instanceof(FileList)
    .optional()
    .refine((files) => {
      if (!files || files.length === 0) return true;
      return files.length === 1;
    }, 'Please upload only one file')
    .refine((files) => {
      if (!files || files.length === 0) return true;
      return files[0].size <= MAX_FILE_SIZE;
    }, 'File size should be less than 5MB')
    .refine((files) => {
      if (!files || files.length === 0) return true;
      return ACCEPTED_FILE_TYPES.includes(files[0].type);
    }, 'Only PDF and Word documents are accepted'),
});

type GenerateQuestionsFormValues = z.infer<typeof generateQuestionsSchema>;

const GenerateQuestions: React.FC = () => {
  const { generateQuestions, loading } = useInterview();
  const [questions, setQuestions] = useState<QuestionType[]>([]);

  const form = useForm<GenerateQuestionsFormValues>({
    resolver: zodResolver(generateQuestionsSchema),
    defaultValues: {
      jobDescription: '',
    },
  });

  const onSubmit = async (data: GenerateQuestionsFormValues) => {
    try {
      const resumeFile = data.resume && data.resume.length > 0 ? data.resume[0] : null;
      const generatedQuestions = await generateQuestions(resumeFile, data.jobDescription);
      setQuestions(generatedQuestions);
      toast.success('Questions generated successfully');
    } catch (error) {
      toast.error('Failed to generate questions');
      console.error(error);
    }
  };

  return (
    <DashboardLayout title="Generate Interview Questions">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Question Generator</CardTitle>
              <CardDescription>
                Create tailored interview questions based on the job and candidate profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="jobDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter the full job description here..."
                            className="min-h-[150px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="resume"
                    render={({ field: { onChange, value, ...rest } }) => (
                      <FormItem>
                        <FormLabel>Candidate Resume (Optional)</FormLabel>
                        <FormControl>
                          <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:border-gray-400 transition-colors">
                            <Input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              className="hidden"
                              id="resume-upload"
                              onChange={(e) => {
                                onChange(e.target.files);
                              }}
                              {...rest}
                            />
                            <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center">
                              <Upload className="h-8 w-8 text-gray-400 mb-2" />
                              <span className="text-sm font-medium text-gray-700">
                                Click to upload resume
                              </span>
                              <span className="text-xs text-gray-500 mt-1">
                                PDF or Word (max 5MB)
                              </span>
                              {value && value.length > 0 && (
                                <span className="mt-2 text-sm text-interview-primary">
                                  {value[0].name}
                                </span>
                              )}
                            </label>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Generating...' : 'Generate Questions'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Generated Questions</CardTitle>
              <CardDescription>
                AI-generated questions based on job requirements and candidate profile
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {questions.length > 0 ? (
                <div className="space-y-5">
                  {questions.map((question) => (
                    <div key={question.id} className="border rounded-lg p-4 bg-gray-50 hover:bg-white hover:shadow-sm transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <span className={`badge ${
                          question.category === 'Technical' ? 'badge-blue' : 'badge-green'
                        }`}>
                          {question.category}
                        </span>
                        <span className={`badge ${
                          question.difficulty === 'Easy' ? 'badge-green' : 
                          question.difficulty === 'Medium' ? 'badge-yellow' : 'badge-red'
                        }`}>
                          {question.difficulty}
                        </span>
                      </div>
                      <p className="text-gray-800 font-medium">{question.question}</p>
                    </div>
                  ))}
                  <div className="flex justify-end mt-4">
                    <Button onClick={() => {
                      navigator.clipboard.writeText(questions.map(q => q.question).join('\n\n'));
                      toast.success('Questions copied to clipboard');
                    }}>
                      Copy All Questions
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center text-gray-500">
                  <HelpCircle className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No questions generated yet</h3>
                  <p className="max-w-md">
                    Fill out the form with a job description and optionally upload a resume to generate tailored interview questions.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GenerateQuestions;
