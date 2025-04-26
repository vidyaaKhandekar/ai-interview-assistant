import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useInterview, QuestionType } from "@/contexts/InterviewContext";
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
} from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { HelpCircle } from "lucide-react";

const generateQuestionsSchema = z.object({
  jobTitle: z.string().min(2, { message: "Job Title is required" }),
  jobDescription: z
    .string()
    .min(20, { message: "Job description is required and should be detailed" }),
  workExperience: z
    .number({ invalid_type_error: "Work experience must be a number" })
    .min(0, { message: "Work experience must be at least 0 years" }),
  requiredSkills: z
    .string()
    .min(2, { message: "Required skills are necessary" }),
});

type GenerateQuestionsFormValues = z.infer<typeof generateQuestionsSchema>;

const GenerateQuestions: React.FC = () => {
  const { generateQuestions, loading } = useInterview();
  const [questions, setQuestions] = useState<QuestionType[]>([]);

  const form = useForm<GenerateQuestionsFormValues>({
    resolver: zodResolver(generateQuestionsSchema),
    defaultValues: {
      jobTitle: "",
      jobDescription: "",
      workExperience: 0,
      requiredSkills: "",
    },
  });

  const onSubmit = async (data: GenerateQuestionsFormValues) => {
    try {
      const generatedQuestions = await generateQuestions(
        data.jobTitle,
        data.jobDescription,
        data.workExperience,
        data.requiredSkills
      );
      setQuestions(generatedQuestions);
      toast.success("Questions generated successfully");
    } catch (error) {
      toast.error("Failed to generate questions");
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
                Create tailored interview questions based on the job role
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="jobTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Frontend Developer"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                    name="workExperience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Work Experience (in years)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            placeholder="e.g. 3"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="requiredSkills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Required Skills</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g. React, TypeScript, Node.js"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                    style={{
                      background:
                        "linear-gradient(139deg, #5BBFF6 8.31%, #7F6AF2 31.55%, #B651D7 48.99%, #E83E54 63.93%, #ED8939 91.32%)",
                    }}
                  >
                    {loading ? "Generating..." : "Generate Questions"}
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
                AI-generated questions based on job title, description, and
                skills
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {questions.length > 0 ? (
                <div className="space-y-5">
                  {questions.map((question) => (
                    <div
                      key={question.id}
                      className="border rounded-lg p-4 bg-gray-50 hover:bg-white hover:shadow-sm transition-all"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span
                          className={`badge ${
                            question.category === "Technical"
                              ? "badge-blue"
                              : "badge-green"
                          }`}
                        >
                          {question.category}
                        </span>
                        <span
                          className={`badge ${
                            question.difficulty === "easy"
                              ? "badge-green"
                              : question.difficulty === "medium"
                              ? "badge-yellow"
                              : "badge-red"
                          }`}
                        >
                          {question.difficulty}
                        </span>
                      </div>
                      <p className="text-gray-800 font-medium">
                        {question.question}
                      </p>
                    </div>
                  ))}
                  <div className="flex justify-end mt-4">
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          questions.map((q) => q.question).join("\n\n")
                        );
                        toast.success("Questions copied to clipboard");
                      }}
                    >
                      Copy All Questions
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center text-gray-500">
                  <HelpCircle className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    No questions generated yet
                  </h3>
                  <p className="max-w-md">
                    Fill out the form with job title, description, experience,
                    and skills to generate tailored interview questions.
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
