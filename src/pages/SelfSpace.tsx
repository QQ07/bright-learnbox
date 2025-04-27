import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { PdfNotesUploader } from "@/components/notes/PdfNotesUploader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MoreVertical, Trash2 } from "lucide-react";
import { getUserId } from "@/lib/auth";

const SelfSpace = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const { toast } = useToast();

  const userId = getUserId();

  // Fetch notes from the API
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/learnspace/learner/notes/learnerNotes?userId=${userId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch notes");
        }
        const data = await response.json();
        setNotes(data);
      } catch (error) {
        console.error("Error fetching notes:", error);
        toast({
          title: "Error",
          description: "Failed to fetch notes. Please try again later.",
          variant: "destructive",
        });
      }
    };

    fetchNotes();
  }, [userId, toast]);

  const handleAddGeneratedNotes = (generatedNotes) => {
    const newNotes = generatedNotes.map((note) => ({
      noteId: Date.now(), // Temporary ID for new notes
      title: note.subTopic,
      subNotes: [{ subTopic: note.subTopic, summary: note.summary }],
    }));
    setNotes((prevNotes) => [...newNotes, ...prevNotes]);

    toast({
      title: "Notes added",
      description: "Notes generated from the PDF have been added successfully.",
    });
  };

  const handleDeleteNote = async (noteId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/learnspace/learner/notes/${noteId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete note");
      }

      setNotes((prevNotes) =>
        prevNotes.filter((note) => note.noteId !== noteId)
      );

      toast({
        title: "Note deleted",
        description: "The note has been removed successfully.",
      });
    } catch (error) {
      console.error("Error deleting note:", error);
      toast({
        title: "Error",
        description: "Failed to delete the note. Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Self Space</h1>
        <p className="text-muted-foreground mt-1">
          Manage your personal notes and materials
        </p>
      </header>

      <Tabs defaultValue="notes" className="mt-6">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="notes">My Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="notes" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="col-span-1 animate-fade-in">
              <CardHeader>
                <CardTitle>Create Note</CardTitle>
                <CardDescription>
                  Add a new personal study note or generate from PDF
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <PdfNotesUploader
                    onNotesGenerated={handleAddGeneratedNotes}
                  />
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="note-title">Title</Label>
                    <Input
                      id="note-title"
                      placeholder="Note title"
                      value={newNote.title}
                      onChange={(e) =>
                        setNewNote({ ...newNote, title: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="note-content">Content</Label>
                    <textarea
                      id="note-content"
                      rows={5}
                      placeholder="Write your note here..."
                      className="w-full min-h-[120px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      value={newNote.content}
                      onChange={(e) =>
                        setNewNote({ ...newNote, content: e.target.value })
                      }
                    />
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => {
                      const note = {
                        noteId: Date.now(),
                        title: newNote.title,
                        subNotes: [
                          { subTopic: newNote.title, summary: newNote.content },
                        ],
                      };
                      setNotes([note, ...notes]);
                      setNewNote({ title: "", content: "" });
                      toast({
                        title: "Note saved",
                        description: "Your note has been saved successfully.",
                      });
                    }}
                  >
                    Save Note
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 animate-fade-in">
              <CardHeader>
                <CardTitle>Your Notes</CardTitle>
                <CardDescription>{notes.length} notes saved</CardDescription>
              </CardHeader>
              <CardContent>
                {notes.length === 0 ? (
                  <p className="text-center text-muted-foreground py-6">
                    No notes created yet
                  </p>
                ) : (
                  <div className="space-y-4">
                    {notes.map((note) => (
                      <div
                        key={note.noteId}
                        className="p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{note.title}</h3>
                          <div className="flex items-center">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                  <span className="sr-only">Menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => handleDeleteNote(note.noteId)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {note.subNotes.map((subNote, index) => (
                            <div key={index}>
                              <p className="text-sm text-muted-foreground">
                                {subNote.summary}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
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

export default SelfSpace;
