import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { SidebarNav } from "./SidebarNav";
import { cn } from "@/lib/utils";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatDialog } from "../chat/ChatDialog";

const AppLayout = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background relative">
      {/* Sidebar Navigation */}
      <SidebarNav />

      {/* Main Content Area */}
      <div
        className="flex-1 flex flex-col p-6 md:p-8 animate-fade-in duration-300"
        style={{ marginLeft: "16rem" }}
      >
        <main className="flex-1 max-w-6xl mx-auto w-full">
          <Outlet />
        </main>
      </div>

      {/* AI Chat Button (Fixed position) */}
      <Button
        onClick={() => setIsChatOpen(true)}
        className={cn(
          "fixed right-6 bottom-6 md:right-8 md:bottom-8 rounded-full p-4 h-14 w-14",
          "shadow-lg hover:shadow-xl transition-all duration-300",
          "bg-primary hover:bg-primary/90 text-white"
        )}
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="sr-only">Open AI Chat</span>
      </Button>

      {/* AI Chat Dialog */}
      <ChatDialog open={isChatOpen} onOpenChange={setIsChatOpen} />
    </div>
  );
};

export default AppLayout;
