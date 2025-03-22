
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Clock, CheckCircle, AlertTriangle, BarChart3, Plus, BrainCircuit } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Mock data
const mockQuizzes = [
  { id: '1', title: 'Biology Cell Structure', questions: 10, completed: false, date: '2023-10-25' },
  { id: '2', title: 'Physics Forces', questions: 15, completed: true, score: 85, date: '2023-10-20' },
];

const mockDailyQuestions = [
  { 
    id: '1', 
    question: 'What is the powerhouse of the cell?', 
    options: ['Nucleus', 'Mitochondria', 'Golgi Apparatus', 'Endoplasmic Reticulum'],
    answer: 'Mitochondria',
    submitted: false,
    userAnswer: null
  },
  { 
    id: '2', 
    question: 'Which of the following is NOT a state of matter?',
    options: ['Solid', 'Liquid', 'Gas', 'Energy'],
    answer: 'Energy',
    submitted: false,
    userAnswer: null
  },
  { 
    id: '3', 
    question: 'What is the Pythagorean theorem?',
    options: ['a² + b² = c²', 'E = mc²', 'F = ma', 'PV = nRT'],
    answer: 'a² + b² = c²',
    submitted: false,
    userAnswer: null
  },
];

const Tests = () => {
  const [quizzes, setQuizzes] = useState(mockQuizzes);
  const [dailyQuestions, setDailyQuestions] = useState(mockDailyQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [quizProgress, setQuizProgress] = useState(0);
  const [quizResult, setQuizResult] = useState({ correct: 0, total: 0 });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const handleAnswerSubmit = () => {
    if (!userAnswer) {
      toast({
        title: "No answer selected",
        description: "Please select an answer before submitting",
        variant: "destructive",
      });
      return;
    }
    
    // Update the current question with user's answer
    const updatedQuestions = [...dailyQuestions];
    updatedQuestions[currentQuestionIndex].submitted = true;
    updatedQuestions[currentQuestionIndex].userAnswer = userAnswer;
    setDailyQuestions(updatedQuestions);
    
    // Check if answer is correct for the results
    const isCorrect = userAnswer === dailyQuestions[currentQuestionIndex].answer;
    setQuizResult(prev => ({
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      total: prev.total + 1
    }));
    
    // Move to next question or finish quiz
    if (currentQuestionIndex < dailyQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setUserAnswer(null);
      setQuizProgress(Math.round(((currentQuestionIndex + 1) / dailyQuestions.length) * 100));
    } else {
      // Completed all questions
      setQuizProgress(100);
      setTimeout(() => {
        toast({
          title: "Daily questions completed",
          description: `You got ${quizResult.correct + (isCorrect ? 1 : 0)} out of ${dailyQuestions.length} correct!`,
        });
      }, 500);
    }
  };
  
  const handleCreateQuiz = () => {
    setIsDialogOpen(false);
    
    // Create a new quiz (in a real app, this would navigate to a quiz creation page)
    const newQuiz = {
      id: Date.now().toString(),
      title: "New Custom Quiz",
      questions: 0,
      completed: false,
      date: new Date().toISOString().split('T')[0]
    };
    
    setQuizzes([newQuiz, ...quizzes]);
    
    toast({
      title: "Quiz created",
      description: "Your new quiz has been created. Add questions to get started.",
    });
  };
  
  const restartQuiz = () => {
    // Reset the quiz state
    setCurrentQuestionIndex(0);
    setUserAnswer(null);
    setQuizProgress(0);
    setQuizResult({ correct: 0, total: 0 });
    
    // Reset all questions to unsubmitted
    const resetQuestions = dailyQuestions.map(q => ({
      ...q,
      submitted: false,
      userAnswer: null
    }));
    setDailyQuestions(resetQuestions);
    
    toast({
      title: "Quiz restarted",
      description: "You can now attempt the daily questions again",
    });
  };

  const currentQuestion = dailyQuestions[currentQuestionIndex];
  const isQuizComplete = quizProgress === 100;
  
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Tests</h1>
        <p className="text-muted-foreground mt-1">
          Practice with quizzes and daily questions
        </p>
      </header>
      
      <Tabs defaultValue="daily" className="mt-6">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="daily">Daily Questions</TabsTrigger>
          <TabsTrigger value="quizzes">My Quizzes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="daily" className="animate-fade-in">
          <div className="grid grid-cols-1 gap-6">
            <Card className="animate-fade-in">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <BrainCircuit className="mr-2 h-5 w-5 text-primary" />
                      Daily Practice
                    </CardTitle>
                    <CardDescription>
                      {isQuizComplete 
                        ? `You scored ${quizResult.correct} out of ${dailyQuestions.length}` 
                        : `Question ${currentQuestionIndex + 1} of ${dailyQuestions.length}`
                      }
                    </CardDescription>
                  </div>
                  {isQuizComplete && (
                    <Button variant="outline" onClick={restartQuiz}>
                      Try Again
                    </Button>
                  )}
                </div>
                <Progress value={quizProgress} className="h-2" />
              </CardHeader>
              
              <CardContent>
                {isQuizComplete ? (
                  // Quiz results
                  <div className="text-center py-8 space-y-4">
                    <div className="mx-auto rounded-full bg-green-100 w-20 h-20 flex items-center justify-center">
                      <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold">
                      {quizResult.correct === dailyQuestions.length 
                        ? "Perfect Score!" 
                        : quizResult.correct > dailyQuestions.length / 2 
                          ? "Good Job!" 
                          : "Keep Practicing!"
                      }
                    </h2>
                    <p className="text-muted-foreground">
                      You got {quizResult.correct} out of {dailyQuestions.length} questions correct
                    </p>
                    <div className="pt-4">
                      <h3 className="font-medium text-left mb-2">Question Summary:</h3>
                      <div className="space-y-2">
                        {dailyQuestions.map((q, idx) => (
                          <div key={q.id} className="flex items-start border p-3 rounded-lg">
                            <div className={`flex-shrink-0 rounded-full p-1 ${q.userAnswer === q.answer ? 'bg-green-100' : 'bg-red-100'}`}>
                              {q.userAnswer === q.answer 
                                ? <CheckCircle className="h-5 w-5 text-green-600" /> 
                                : <AlertTriangle className="h-5 w-5 text-red-600" />
                              }
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium">{q.question}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Your answer: <span className={q.userAnswer === q.answer ? 'text-green-600' : 'text-red-600'}>
                                  {q.userAnswer || "None"}
                                </span>
                              </p>
                              {q.userAnswer !== q.answer && (
                                <p className="text-xs text-green-600 mt-1">
                                  Correct answer: {q.answer}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  // Quiz question
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h2 className="text-xl font-medium">
                        {currentQuestion.question}
                      </h2>
                      <RadioGroup value={userAnswer || ""} onValueChange={setUserAnswer}>
                        <div className="space-y-3 pt-3">
                          {currentQuestion.options.map((option) => (
                            <div key={option} className="flex items-center space-x-2">
                              <RadioGroupItem value={option} id={option} />
                              <Label htmlFor={option} className="cursor-pointer flex-1 p-3 rounded-lg hover:bg-muted">
                                {option}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                )}
              </CardContent>
              
              {!isQuizComplete && (
                <CardFooter>
                  <Button 
                    onClick={handleAnswerSubmit} 
                    disabled={!userAnswer}
                    className="w-full"
                  >
                    {currentQuestionIndex < dailyQuestions.length - 1 ? "Next Question" : "Finish Quiz"}
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="quizzes" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Create Quiz Card */}
            <Card className="col-span-1 animate-fade-in">
              <CardHeader>
                <CardTitle>Create Quiz</CardTitle>
                <CardDescription>
                  Create a personalized quiz from your materials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Create New Quiz
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Quiz</DialogTitle>
                      <DialogDescription>
                        Create a personalized quiz from your study materials.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Quiz Type:</p>
                        <RadioGroup defaultValue="custom">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="custom" id="custom" />
                            <Label htmlFor="custom">Custom Quiz</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="material" id="material" />
                            <Label htmlFor="material">From Materials</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateQuiz}>
                        Continue
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
            
            {/* Quiz List */}
            <Card className="md:col-span-2 animate-fade-in">
              <CardHeader>
                <CardTitle>Your Quizzes</CardTitle>
                <CardDescription>
                  {quizzes.length} {quizzes.length === 1 ? 'quiz' : 'quizzes'} available
                </CardDescription>
              </CardHeader>
              <CardContent>
                {quizzes.length === 0 ? (
                  <div className="text-center py-8">
                    <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium">No quizzes yet</h3>
                    <p className="text-muted-foreground mt-1">
                      Create your first quiz to start practicing
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {quizzes.map((quiz) => (
                      <Card key={quiz.id} className="hover:shadow-md transition-shadow border">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{quiz.title}</CardTitle>
                            {quiz.completed ? (
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                                {quiz.score}%
                              </Badge>
                            ) : (
                              <Badge variant="outline">Not completed</Badge>
                            )}
                          </div>
                          <CardDescription className="flex items-center">
                            <Clock className="mr-1 h-3 w-3" />
                            Created on {quiz.date}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <p className="text-sm text-muted-foreground">
                            {quiz.questions} questions
                          </p>
                        </CardContent>
                        <CardFooter>
                          <Button variant="ghost" className="w-full text-primary">
                            {quiz.completed ? "Review Quiz" : "Start Quiz"}
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Tests;
