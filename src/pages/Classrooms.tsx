import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FolderPlus, FileText, Plus, Users } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  createClassroom,
  getClassrooms,
  joinClassroom,
} from "@/services/apiService";

// Define TypeScript interfaces for our classroom types
interface MentorClassroom {
  classroomId: number;
  classroomName: string;
  classroomCode: string;
  fileNames: string[];
  learnerEmails: string[];
}

const Classrooms = () => {
  const [isTeacher, setIsTeacher] = useState(() => {
    const role = localStorage.getItem("userRole");
    return role === "mentor";
  }); // Initialize based on localStorage value
  const [classrooms, setClassrooms] = useState<MentorClassroom[]>([]);
  const [newClassroom, setNewClassroom] = useState({ name: "" });
  const [joinCode, setJoinCode] = useState("");
  const { toast } = useToast();

  const fetchClassrooms = async () => {
    try {
      const userId = parseInt(localStorage.getItem("userId") || "0", 10);
      const classroomsData = await getClassrooms(userId);
      setClassrooms(classroomsData);
    } catch (error) {
      console.error("Failed to fetch classrooms:", error);
      toast({
        title: "Failed to fetch classrooms",
        description:
          "There was an error fetching your classrooms. Please try again later.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchClassrooms();
  }, [isTeacher]);

  const handleCreateClassroom = async () => {
    if (!newClassroom.name.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide a classroom name",
        variant: "destructive",
      });
      return;
    }

    try {
      await createClassroom(newClassroom.name);
      fetchClassrooms();
      setNewClassroom({ name: "" });

      toast({
        title: "Classroom created",
        description: `Your new classroom "${newClassroom.name}" has been created`,
      });
    } catch (error) {
      console.error("Error creating classroom:", error);
      toast({
        title: "Error creating classroom",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const handleJoinClassroom = async () => {
    if (!joinCode.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide a classroom code",
        variant: "destructive",
      });
      return;
    }

    try {
      const userId = parseInt(localStorage.getItem("userId") || "0", 10);
      await joinClassroom(userId, joinCode);
      fetchClassrooms();
      setJoinCode("");

      toast({
        title: "Classroom joined",
        description: "You have successfully joined the classroom",
      });
    } catch (error) {
      console.error("Error joining classroom:", error);
      toast({
        title: "Error joining classroom",
        description: "Please check the classroom code and try again",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Classrooms</h1>
          <p className="text-muted-foreground mt-1">
            {isTeacher
              ? "Create and manage your classrooms"
              : "Join and access your classrooms"}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Create/Join Card */}
        <Card className="col-span-1 animate-fade-in">
          <CardHeader>
            <CardTitle>
              {isTeacher ? "Create Classroom" : "Join Classroom"}
            </CardTitle>
            <CardDescription>
              {isTeacher
                ? "Create a new classroom for your students"
                : "Join an existing classroom with a code"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isTeacher ? (
              <div className="space-y-4">
                <Input
                  placeholder="Classroom name"
                  value={newClassroom.name}
                  onChange={(e) =>
                    setNewClassroom({ ...newClassroom, name: e.target.value })
                  }
                />
                <Button className="w-full" onClick={handleCreateClassroom}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Classroom
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Input
                  placeholder="Enter classroom code"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                />
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
              {classrooms.length}{" "}
              {classrooms.length === 1 ? "classroom" : "classrooms"} available
            </CardDescription>
          </CardHeader>
          <CardContent>
            {classrooms.length === 0 ? (
              <div className="text-center py-12">
                <FolderPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No classrooms yet</h3>
                <p className="text-muted-foreground mt-1">
                  {isTeacher
                    ? "Create your first classroom to get started"
                    : "Join a classroom using a classroom code"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {classrooms.map((classroom) => (
                  <Card
                    key={classroom.classroomId}
                    className="hover:shadow-md transition-shadow border-2"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">
                          {classroom.classroomName}
                        </CardTitle>
                        <Badge>{classroom.classroomCode}</Badge>
                      </div>
                      <CardDescription>
                        {classroom.learnerEmails.length} learners enrolled
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <FileText className="mr-1 h-4 w-4" />
                        <span>{classroom.fileNames.length} files uploaded</span>
                      </div>
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
