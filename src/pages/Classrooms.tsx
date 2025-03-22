
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Plus, Users, FolderPlus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Define TypeScript interfaces for our classroom types
interface TeacherClassroom {
  id: string;
  name: string;
  code: string;
  students: number;
  materials: number;
}

interface StudentClassroom {
  id: string;
  name: string;
  code: string;
  teacher: string;
  materials: number;
}

// Mock data
const mockTeacherClassrooms: TeacherClassroom[] = [
  { id: '1', name: 'Biology 101', code: 'BIO101', students: 24, materials: 8 },
  { id: '2', name: 'Physics Advanced', code: 'PHY202', students: 18, materials: 12 },
];

const mockStudentClassrooms: StudentClassroom[] = [
  { id: '1', name: 'Chemistry Basics', code: 'CHEM101', teacher: 'Dr. Smith', materials: 5 },
  { id: '2', name: 'Mathematics 101', code: 'MATH101', teacher: 'Prof. Johnson', materials: 7 },
];

const Classrooms = () => {
  const [isTeacher, setIsTeacher] = useState(true); // Toggle between teacher/student view for demo
  const [classrooms, setClassrooms] = useState<TeacherClassroom[] | StudentClassroom[]>(
    isTeacher ? mockTeacherClassrooms : mockStudentClassrooms
  );
  const [newClassroom, setNewClassroom] = useState({ name: '' });
  const [joinCode, setJoinCode] = useState('');
  const { toast } = useToast();
  
  // Toggle role for demo purposes
  const toggleRole = () => {
    setIsTeacher(!isTeacher);
    setClassrooms(!isTeacher ? mockTeacherClassrooms : mockStudentClassrooms);
  };
  
  const handleCreateClassroom = () => {
    if (!newClassroom.name.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide a classroom name",
        variant: "destructive",
      });
      return;
    }
    
    // Generate a random 6-character classroom code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const classroom: TeacherClassroom = {
      id: Date.now().toString(),
      name: newClassroom.name,
      code: code,
      students: 0,
      materials: 0
    };
    
    setClassrooms([classroom, ...classrooms] as (TeacherClassroom[] | StudentClassroom[]));
    setNewClassroom({ name: '' });
    
    toast({
      title: "Classroom created",
      description: `Your new classroom "${classroom.name}" has been created with code: ${code}`,
    });
  };
  
  const handleJoinClassroom = () => {
    if (!joinCode.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide a classroom code",
        variant: "destructive",
      });
      return;
    }
    
    // Check if already joined (in a real app, this would check against a database)
    const alreadyJoined = mockStudentClassrooms.some(c => c.code === joinCode);
    
    if (alreadyJoined) {
      toast({
        title: "Already joined",
        description: "You have already joined this classroom",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would verify the code exists
    const classroom: StudentClassroom = {
      id: Date.now().toString(),
      name: `Class ${joinCode}`,
      code: joinCode,
      teacher: 'Unknown Teacher',
      materials: 0
    };
    
    setClassrooms([classroom, ...classrooms] as (TeacherClassroom[] | StudentClassroom[]));
    setJoinCode('');
    
    toast({
      title: "Classroom joined",
      description: `You have successfully joined the classroom`,
    });
  };
  
  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Classrooms</h1>
          <p className="text-muted-foreground mt-1">
            {isTeacher ? 'Create and manage your classrooms' : 'Join and access your classrooms'}
          </p>
        </div>
        
        {/* Demo toggle - would be user role based in real app */}
        <Button variant="outline" onClick={toggleRole}>
          Switch to {isTeacher ? 'Student' : 'Teacher'} View
        </Button>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Create/Join Card */}
        <Card className="col-span-1 animate-fade-in">
          <CardHeader>
            <CardTitle>
              {isTeacher ? 'Create Classroom' : 'Join Classroom'}
            </CardTitle>
            <CardDescription>
              {isTeacher 
                ? 'Create a new classroom for your students' 
                : 'Join an existing classroom with a code'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isTeacher ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Input
                    placeholder="Classroom name"
                    value={newClassroom.name}
                    onChange={(e) => setNewClassroom({...newClassroom, name: e.target.value})}
                  />
                </div>
                <Button className="w-full" onClick={handleCreateClassroom}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Classroom
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Input
                    placeholder="Enter classroom code"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                  />
                </div>
                <Button className="w-full" onClick={handleJoinClassroom}>
                  <Plus className="mr-2 h-4 w-4" />
                  Join Classroom
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Classrooms List */}
        <Card className="md:col-span-2 animate-fade-in">
          <CardHeader>
            <CardTitle>Your Classrooms</CardTitle>
            <CardDescription>
              {classrooms.length} {classrooms.length === 1 ? 'classroom' : 'classrooms'} available
            </CardDescription>
          </CardHeader>
          <CardContent>
            {classrooms.length === 0 ? (
              <div className="text-center py-12">
                <FolderPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No classrooms yet</h3>
                <p className="text-muted-foreground mt-1">
                  {isTeacher 
                    ? 'Create your first classroom to get started' 
                    : 'Join a classroom using a classroom code'
                  }
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {classrooms.map((classroom) => (
                  <Card key={classroom.id} className="hover:shadow-md transition-shadow border-2">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{classroom.name}</CardTitle>
                        <Badge>{classroom.code}</Badge>
                      </div>
                      <CardDescription>
                        {isTeacher 
                          ? `${(classroom as TeacherClassroom).students} students enrolled` 
                          : `Teacher: ${(classroom as StudentClassroom).teacher}`
                        }
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <FileText className="mr-1 h-4 w-4" />
                        <span>{classroom.materials} learning materials</span>
                      </div>
                      {isTeacher && (
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Users className="mr-1 h-4 w-4" />
                          <span>{(classroom as TeacherClassroom).students} students</span>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button variant="ghost" className="w-full text-primary">
                        View Classroom
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Classrooms;
