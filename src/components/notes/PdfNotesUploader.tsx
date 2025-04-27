/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, Loader } from "lucide-react";
import { saveTaskId, getTaskId, clearTaskId } from "@/utils/taskUtils";
import { getUserId } from "@/lib/auth"; // Import getUserId

interface NotesData {
  Topic: Array<{
    Sub_topic: string;
    summary: string;
  }>;
}

interface TaskResponse {
  task_id: string;
  status: string;
  message: string;
  result?: NotesData;
}

interface PdfNotesUploaderProps {
  onNotesGenerated: (
    notes: Array<{ subTopic: string; summary: string }>
  ) => void;
}

const saveNote = async (note: { subTopic: string; summary: string }) => {
  const userId = getUserId(); // Retrieve userId from localStorage
  if (!userId) {
    console.error("User ID not found in localStorage");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:8080/learnspace/learner/notes?userId=${userId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        body: JSON.stringify({
          noteId: Date.now(), // Generate a unique noteId
          title: note.subTopic,
          subNotes: [
            {
              subTopic: note.subTopic,
              summary: note.summary,
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to save note: ${response.statusText}`);
    }

    console.log("Note saved successfully:", note);
  } catch (error) {
    console.error("Error saving note:", error);
  }
};

export const PdfNotesUploader = ({
  onNotesGenerated,
}: PdfNotesUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing task on component mount
    const existingTaskId = getTaskId();
    if (existingTaskId) {
      startPolling(existingTaskId);
    }
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    if (!file.type.includes("pdf")) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("pdf_file", file);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/generate-notes-from-pdf",
        {
          method: "POST",
          body: formData,
        }
      );

      const data: TaskResponse = await response.json();
      saveTaskId(data.task_id);

      toast({
        title: "Processing PDF",
        description: data.message,
      });

      startPolling(data.task_id);
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to process PDF file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const startPolling = async (taskId: string) => {
    setIsPolling(true);
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes with 5-second intervals

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`http://localhost:8000/tasks/${taskId}`);
        const data: TaskResponse = await response.json();

        if (data.status === "completed" && data.result) {
          clearInterval(pollInterval);
          setIsPolling(false);
          clearTaskId();

          // Create note format expected by the app
          const generatedNotes = data.result.Topic.map((topic) => ({
            subTopic: topic.Sub_topic,
            summary: topic.summary,
          }));

          // Save each note using the API
          for (const note of generatedNotes) {
            await saveNote(note);
          }

          // Pass generated notes to parent component
          onNotesGenerated(generatedNotes);

          toast({
            title: "Notes generated",
            description: "PDF has been processed successfully",
          });
        }
      } catch (error) {
        console.error("Error polling task status:", error);
      }

      attempts++;
      if (attempts >= maxAttempts) {
        clearInterval(pollInterval);
        setIsPolling(false);
        clearTaskId();
        toast({
          title: "Process timeout",
          description: "PDF processing took too long",
          variant: "destructive",
        });
      }
    }, 5000); // Poll every 5 seconds
  };

  return (
    <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
      <input
        type="file"
        id="pdf-upload"
        accept=".pdf"
        onChange={handleFileUpload}
        className="hidden"
        disabled={isUploading || isPolling}
      />
      {isUploading || isPolling ? (
        <div className="flex flex-col items-center gap-2">
          <Loader className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            {isUploading ? "Uploading PDF..." : "Generating notes..."}
          </p>
        </div>
      ) : (
        <>
          <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground mb-2">
            Upload a PDF to generate notes
          </p>
          <Button
            onClick={() => document.getElementById("pdf-upload")?.click()}
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            Choose PDF
          </Button>
        </>
      )}
    </div>
  );
};
