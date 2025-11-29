import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { 
  MessageSquare, Send, Sparkles, Loader2, FileText, 
  ClipboardList, Reply, Mail, User, Bot, Zap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Email, ChatMessage } from "@shared/schema";

const quickActions = [
  { label: "Summarize", prompt: "Please summarize this email concisely.", icon: FileText },
  { label: "Extract Tasks", prompt: "What action items or tasks are mentioned in this email?", icon: ClipboardList },
  { label: "Draft Reply", prompt: "Help me draft a professional reply to this email.", icon: Reply },
  { label: "Key Points", prompt: "What are the key points I should know from this email?", icon: Zap },
];

export default function EmailAgentPage() {
  const { toast } = useToast();
  const [selectedEmailId, setSelectedEmailId] = useState<string>("");
  const [message, setMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: emails, isLoading: emailsLoading } = useQuery<Email[]>({
    queryKey: ["/api/emails"],
  });

  const { data: chatHistory, isLoading: chatLoading } = useQuery<ChatMessage[]>({
    queryKey: ["/api/chat", selectedEmailId],
    enabled: !!selectedEmailId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (query: string) => {
      return apiRequest("POST", "/api/chat", {
        emailId: parseInt(selectedEmailId),
        message: query,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat", selectedEmailId] });
      setMessage("");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const extractActionsMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/emails/${selectedEmailId}/extract-actions`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/emails"] });
      queryClient.invalidateQueries({ queryKey: ["/api/chat", selectedEmailId] });
      toast({
        title: "Actions Extracted",
        description: "Action items have been extracted from this email.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Extraction Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const generateDraftMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/emails/${selectedEmailId}/generate-draft`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/drafts"] });
      toast({
        title: "Draft Generated",
        description: "A reply draft has been created. Check the Drafts tab.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Draft Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const selectedEmail = emails?.find(e => e.id.toString() === selectedEmailId);

  const handleSend = () => {
    if (message.trim() && selectedEmailId) {
      sendMessageMutation.mutate(message.trim());
    }
  };

  const handleQuickAction = (prompt: string) => {
    if (selectedEmailId) {
      sendMessageMutation.mutate(prompt);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6 p-6">
      <div className="lg:w-2/5 flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Select Email</h2>
          <Select value={selectedEmailId} onValueChange={setSelectedEmailId}>
            <SelectTrigger data-testid="select-email">
              <SelectValue placeholder="Choose an email to analyze..." />
            </SelectTrigger>
            <SelectContent>
              {emails?.map((email) => (
                <SelectItem key={email.id} value={email.id.toString()}>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate max-w-[250px]">{email.subject}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedEmail ? (
          <Card className="flex-1 overflow-hidden flex flex-col">
            <CardHeader className="border-b pb-4">
              <CardTitle className="text-base" data-testid="text-selected-subject">{selectedEmail.subject}</CardTitle>
              <div className="text-sm text-muted-foreground mt-1">
                <span className="font-medium text-foreground">{selectedEmail.sender}</span>
                <span className="mx-2">•</span>
                <span>{format(new Date(selectedEmail.date), "MMM d, yyyy")}</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
              <ScrollArea className="h-full max-h-[300px] p-4">
                <p className="text-sm whitespace-pre-wrap" data-testid="text-selected-body">
                  {selectedEmail.body}
                </p>
              </ScrollArea>
            </CardContent>
          </Card>
        ) : (
          <Card className="flex-1 flex items-center justify-center">
            <div className="text-center p-8">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">No Email Selected</h3>
              <p className="text-sm text-muted-foreground">
                Select an email above to start chatting with the AI agent.
              </p>
            </div>
          </Card>
        )}

        {selectedEmail && (
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => extractActionsMutation.mutate()}
              disabled={extractActionsMutation.isPending}
              data-testid="button-extract-actions"
            >
              {extractActionsMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <ClipboardList className="h-4 w-4 mr-2" />
              )}
              Extract Actions
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => generateDraftMutation.mutate()}
              disabled={generateDraftMutation.isPending}
              data-testid="button-generate-draft"
            >
              {generateDraftMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Reply className="h-4 w-4 mr-2" />
              )}
              Generate Draft Reply
            </Button>
          </div>
        )}
      </div>

      <Card className="lg:w-3/5 flex flex-col overflow-hidden">
        <CardHeader className="border-b pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-primary" />
            Email Agent Chat
          </CardTitle>
        </CardHeader>

        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          {!selectedEmailId ? (
            <div className="h-full flex items-center justify-center text-center p-8">
              <div>
                <Bot className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">Ready to Help</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Select an email from the dropdown to start asking questions, 
                  get summaries, extract tasks, or draft replies.
                </p>
              </div>
            </div>
          ) : chatLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className={`flex gap-3 ${i % 2 === 0 ? "" : "justify-end"}`}>
                  <Skeleton className="h-20 w-3/4 rounded-2xl" />
                </div>
              ))}
            </div>
          ) : chatHistory && chatHistory.length > 0 ? (
            <div className="space-y-4">
              {chatHistory.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
                  data-testid={`chat-message-${msg.id}`}
                >
                  {msg.role === "assistant" && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    <span className="text-xs opacity-70 mt-2 block">
                      {format(new Date(msg.timestamp), "h:mm a")}
                    </span>
                  </div>
                  {msg.role === "user" && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <User className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              ))}
              {sendMessageMutation.isPending && (
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-muted p-4 rounded-2xl">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-medium mb-2">Start a Conversation</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                Ask questions about the selected email or use the quick actions below.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {quickActions.map((action) => (
                  <Button
                    key={action.label}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction(action.prompt)}
                    disabled={sendMessageMutation.isPending}
                    data-testid={`quick-action-${action.label.toLowerCase().replace(" ", "-")}`}
                  >
                    <action.icon className="h-4 w-4 mr-2" />
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </ScrollArea>

        <div className="border-t p-4">
          {selectedEmailId && chatHistory && chatHistory.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {quickActions.map((action) => (
                <Button
                  key={action.label}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuickAction(action.prompt)}
                  disabled={sendMessageMutation.isPending}
                  className="text-xs"
                  data-testid={`quick-action-footer-${action.label.toLowerCase().replace(" ", "-")}`}
                >
                  <action.icon className="h-3 w-3 mr-1" />
                  {action.label}
                </Button>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <Textarea
              placeholder={selectedEmailId ? "Ask about this email..." : "Select an email first..."}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={!selectedEmailId || sendMessageMutation.isPending}
              className="min-h-[60px] resize-none"
              data-testid="input-chat-message"
            />
            <Button
              onClick={handleSend}
              disabled={!message.trim() || !selectedEmailId || sendMessageMutation.isPending}
              size="icon"
              className="h-auto aspect-square"
              data-testid="button-send-message"
            >
              {sendMessageMutation.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </Card>
    </div>
  );
}
