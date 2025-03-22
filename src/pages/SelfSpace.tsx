
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, Image, FileIcon, MoreVertical, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';

// Mock data for demonstration
const mockFiles = [
  { id: '1', name: 'Biology notes.pdf', type: 'pdf', size: '1.2 MB', date: '2023-10-15' },
  { id: '2', name: 'Physics formulas.docx', type: 'doc', size: '0.5 MB', date: '2023-10-10' },
  { id: '3', name: 'Study diagram.png', type: 'image', size: '0.8 MB', date: '2023-10-05' },
];

const mockNotes = [
  { id: '1', title: 'Important Formulas', content: 'E=mc² and other key physics equations...', date: '2023-10-18' },
  { id: '2', title: 'Biology Study Plan', content: 'Week 1: Cell structure\nWeek 2: Genetics...', date: '2023-10-16' },
];

const SelfSpace = () => {
  const [files, setFiles] = useState(mockFiles);
  const [notes, setNotes] = useState(mockNotes);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const { toast } = useToast();
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Check file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Files must be less than 2MB in size",
          variant: "destructive",
        });
        return;
      }
      
      // Process file (in a real app, this would involve uploading to server)
      const newFile = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type.split('/')[0],
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        date: new Date().toISOString().split('T')[0],
      };
      
      setFiles([newFile, ...files]);
      
      toast({
        title: "File uploaded",
        description: `${file.name} has been uploaded successfully`,
      });
    }
  };
  
  const handleDeleteFile = (id: string) => {
    setFiles(files.filter(file => file.id !== id));
    toast({
      title: "File deleted",
      description: "The file has been removed",
    });
  };
  
  const handleSaveNote = () => {
    if (!newNote.title || !newNote.content) {
      toast({
        title: "Missing information",
        description: "Please provide both a title and content for your note",
        variant: "destructive",
      });
      return;
    }
    
    const note = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      date: new Date().toISOString().split('T')[0],
    };
    
    setNotes([note, ...notes]);
    setNewNote({ title: '', content: '' });
    
    toast({
      title: "Note saved",
      description: "Your note has been saved successfully",
    });
  };
  
  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
    toast({
      title: "Note deleted",
      description: "The note has been removed",
    });
  };
  
  // Helper function to get icon based on file type
  const getFileIcon = (type: string) => {
    switch(type) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'doc':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'image':
        return <Image className="h-5 w-5 text-green-500" />;
      default:
        return <FileIcon className="h-5 w-5 text-gray-500" />;
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
      
      <Tabs defaultValue="files" className="mt-6">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="files">My Files</TabsTrigger>
          <TabsTrigger value="notes">My Notes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="files" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Upload Card */}
            <Card className="col-span-1 animate-fade-in">
              <CardHeader>
                <CardTitle>Upload Files</CardTitle>
                <CardDescription>
                  Upload your study materials and documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag and drop files here or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Max file size: 2MB
                  </p>
                  <Label 
                    htmlFor="file-upload" 
                    className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 cursor-pointer"
                  >
                    Choose File
                  </Label>
                  <Input 
                    id="file-upload" 
                    type="file" 
                    className="hidden" 
                    onChange={handleFileUpload}
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Files List */}
            <Card className="md:col-span-2 animate-fade-in">
              <CardHeader>
                <CardTitle>Your Files</CardTitle>
                <CardDescription>
                  {files.length} files stored
                </CardDescription>
              </CardHeader>
              <CardContent>
                {files.length === 0 ? (
                  <p className="text-center text-muted-foreground py-6">
                    No files uploaded yet
                  </p>
                ) : (
                  <div className="space-y-2">
                    {files.map((file) => (
                      <div 
                        key={file.id} 
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {getFileIcon(file.type)}
                          <div>
                            <p className="font-medium text-sm">{file.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs font-normal">
                                {file.size}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {file.date}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDeleteFile(file.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="notes" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Create Note Card */}
            <Card className="col-span-1 animate-fade-in">
              <CardHeader>
                <CardTitle>Create Note</CardTitle>
                <CardDescription>
                  Add a new personal study note
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="note-title">Title</Label>
                    <Input 
                      id="note-title" 
                      placeholder="Note title"
                      value={newNote.title}
                      onChange={(e) => setNewNote({...newNote, title: e.target.value})}
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
                      onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                    />
                  </div>
                  <Button className="w-full" onClick={handleSaveNote}>
                    Save Note
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Notes List */}
            <Card className="md:col-span-2 animate-fade-in">
              <CardHeader>
                <CardTitle>Your Notes</CardTitle>
                <CardDescription>
                  {notes.length} notes saved
                </CardDescription>
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
                        key={note.id} 
                        className="p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{note.title}</h3>
                          <div className="flex items-center">
                            <span className="text-xs text-muted-foreground mr-2">
                              {note.date}
                            </span>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                  <span className="sr-only">Menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => handleDeleteNote(note.id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">
                          {note.content}
                        </p>
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
