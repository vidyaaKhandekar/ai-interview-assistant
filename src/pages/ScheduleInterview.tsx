import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useInterview, InterviewType } from "@/contexts/InterviewContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { Calendar, Upload, Clock } from "lucide-react";

const scheduleInterviewSchema = z.object({
  candidateName: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" }),
  candidateEmail: z
    .string()
    .email({ message: "Please enter a valid email address" }),
  candidatePhone: z
    .string()
    .min(7, { message: "Please enter a valid phone number" }),
  date: z.string().refine(
    (val) => {
      const selectedDate = new Date(val);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    },
    { message: "Date must be today or in the future" }
  ),
  time: z.string(),
  jobDescription: z
    .string()
    .min(20, { message: "Job description is required" }),
  resume: z.any().optional(),
});

type ScheduleInterviewFormValues = z.infer<typeof scheduleInterviewSchema>;

const ScheduleInterview: React.FC = () => {
  const { scheduleInterview, loading } = useInterview();
  const navigate = useNavigate();
  const [scheduledInterview, setScheduledInterview] =
    useState<InterviewType | null>(null);

  const form = useForm<ScheduleInterviewFormValues>({
    resolver: zodResolver(scheduleInterviewSchema),
    defaultValues: {
      candidateName: "",
      candidateEmail: "",
      candidatePhone: "",
      date: new Date().toISOString().split("T")[0],
      time: "10:00",
      jobDescription: "",
    },
  });

  const onSubmit = async (data: ScheduleInterviewFormValues) => {
    try {
      // Combine date and time
      const dateTime = new Date(`${data.date}T${data.time}`);

      const interviewData = {
        candidateName: data.candidateName,
        candidateEmail: data.candidateEmail,
        candidatePhone: data.candidatePhone,
        date: dateTime.toISOString(),
        jobDescription: data.jobDescription,
        resumeUrl: data.resume ? URL.createObjectURL(data.resume) : undefined,
      };

      const newInterview = await scheduleInterview(interviewData);
      setScheduledInterview(newInterview);
      toast.success("Interview scheduled successfully");
    } catch (error) {
      toast.error("Failed to schedule interview");
      console.error(error);
    }
  };

  const handleViewInterview = () => {
    if (scheduledInterview) {
      navigate(`/interview-session?id=${scheduledInterview.id}`);
    }
  };

  return (
    <DashboardLayout title="Schedule Interview">
      {!scheduledInterview ? (
        <Card>
          <CardHeader>
            <CardTitle>Schedule a New Interview</CardTitle>
            <CardDescription>
              Set up an interview session with a candidate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div className="border-b pb-4 mb-4">
                      <h3 className="text-lg font-medium mb-4">
                        Candidate Information
                      </h3>
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="candidateName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="candidateEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="john@example.com"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="candidatePhone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="(123) 456-7890"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">
                        Interview Schedule
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="date"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date</FormLabel>
                              <div className="relative">
                                <Calendar className="h-4 w-4 absolute top-3 left-3 text-gray-500" />
                                <FormControl>
                                  <Input
                                    type="date"
                                    className="pl-10"
                                    {...field}
                                  />
                                </FormControl>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="time"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Time</FormLabel>
                              <div className="relative">
                                <Clock className="h-4 w-4 absolute top-3 left-3 text-gray-500" />
                                <FormControl>
                                  <Input
                                    type="time"
                                    className="pl-10"
                                    {...field}
                                  />
                                </FormControl>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="jobDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter the job description here..."
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
                                  if (
                                    e.target.files &&
                                    e.target.files.length > 0
                                  ) {
                                    onChange(e.target.files[0]);
                                  }
                                }}
                                {...rest}
                              />
                              <label
                                htmlFor="resume-upload"
                                className="cursor-pointer flex flex-col items-center"
                              >
                                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                                <span className="text-sm font-medium text-gray-700">
                                  Click to upload resume
                                </span>
                                <span className="text-xs text-gray-500 mt-1">
                                  PDF or Word (max 5MB)
                                </span>
                                {value && (
                                  <span className="mt-2 text-sm text-interview-primary">
                                    {value.name}
                                  </span>
                                )}
                              </label>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <Button
                    type="submit"
                    className="w-full sm:w-auto"
                    disabled={loading}
                    style={{
                      background:
                        "linear-gradient(139deg, #5BBFF6 8.31%, #7F6AF2 31.55%, #B651D7 48.99%, #E83E54 63.93%, #ED8939 91.32%)",
                    }}
                  >
                    {loading ? "Scheduling..." : "Schedule Interview"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Interview Scheduled!</CardTitle>
            <CardDescription>
              The interview has been successfully scheduled
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
              <h3 className="text-lg font-medium text-blue-800 mb-4">
                Interview Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Candidate:
                  </p>
                  <p className="text-gray-800 font-medium">
                    {scheduledInterview.candidateName}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Date & Time:
                  </p>
                  <p className="text-gray-800 font-medium">
                    {new Date(scheduledInterview.date).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Interviewer's Link</h3>
                <div className="flex items-center gap-2">
                  <Input
                    value={scheduledInterview.interviewerLink}
                    readOnly
                    className="bg-gray-50"
                  />
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        scheduledInterview.interviewerLink || ""
                      );
                      toast.success("Interviewer link copied");
                    }}
                  >
                    Copy
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Use this link to join as the interviewer
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Candidate's Link</h3>
                <div className="flex items-center gap-2">
                  <Input
                    value={scheduledInterview.candidateLink}
                    readOnly
                    className="bg-gray-50"
                  />
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        scheduledInterview.candidateLink || ""
                      );
                      toast.success("Candidate link copied");
                    }}
                  >
                    Copy
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Share this link with the candidate
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-4 justify-end">
            <Button
              variant="outline"
              onClick={() => setScheduledInterview(null)}
            >
              Schedule Another
            </Button>
            <Button onClick={handleViewInterview}>
              Go to Interview Session
            </Button>
          </CardFooter>
        </Card>
      )}
    </DashboardLayout>
  );
};

export default ScheduleInterview;
