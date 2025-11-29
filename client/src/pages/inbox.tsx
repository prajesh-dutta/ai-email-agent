import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { Mail, MailOpen, Sparkles, Tag, Loader2, RefreshCw, CheckCircle2, Clock, AlertTriangle, Trash2, FileText, ListChecks, PenLine, Wand2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Email, EmailCategory } from "@shared/schema";

const categoryConfig: Record<EmailCategory, { color: string; icon: typeof Tag }> = {
  "Important": { color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400", icon: AlertTriangle },
  "Newsletter": { color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400", icon: FileText },
  "Spam": { color: "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-400", icon: Trash2 },
  "To-Do": { color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400", icon: CheckCircle2 },
  "Uncategorized": { color: "bg-slate-100 text-slate-800 dark:bg-slate-800/50 dark:text-slate-400", icon: Tag },
};

function EmailSkeleton() {
  return (
    <div className="flex items-start gap-4 p-4 border-b">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-full" />
      </div>
    </div>
  );
}

export default function InboxPage() {
  const { toast } = useToast();
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);

  const { data: emails, isLoading } = useQuery<Email[]>({
    queryKey: ["/api/emails"],
  });

  const processInboxMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/emails/process");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/emails"] });
      toast({
        title: "Inbox Processed",
        description: "All emails have been categorized using AI.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Processing Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (emailId: number) => {
      return apiRequest("PATCH", `/api/emails/${emailId}`, { read: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/emails"] });
    },
  });

  const extractActionsMutation = useMutation({
    mutationFn: async (emailId: number) => {
      return apiRequest("POST", `/api/emails/${emailId}/extract-actions`);
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/emails"] });
      if (data.email) {
        setSelectedEmail(data.email);
      }
      const count = data.actionItems?.length ?? 0;
      toast({
        title: "Action Items Extracted",
        description: count > 0 
          ? `Found ${count} action item${count > 1 ? "s" : ""} in this email.`
          : "No action items found in this email.",
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
    mutationFn: async (emailId: number) => {
      return apiRequest("POST", `/api/emails/${emailId}/generate-draft`);
    },
    onSuccess: (data: any) => {
      if (data.draft) {
        queryClient.invalidateQueries({ queryKey: ["/api/drafts"] });
        toast({
          title: "Draft Created",
          description: "A reply draft has been saved to your Drafts folder.",
        });
      } else {
        toast({
          title: "No Reply Needed",
          description: "This email doesn't require a reply (newsletter/promotional).",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Draft Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleEmailClick = (email: Email) => {
    setSelectedEmail(email);
    if (!email.read) {
      markAsReadMutation.mutate(email.id);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return format(date, "h:mm a");
    }
    return format(date, "MMM d");
  };

  const unreadCount = emails?.filter(e => !e.read).length ?? 0;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between gap-4 p-6 border-b flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" data-testid="text-inbox-title">Inbox</h1>
          <p className="text-sm text-muted-foreground" data-testid="text-inbox-stats">
            {emails?.length ?? 0} emails {unreadCount > 0 && `• ${unreadCount} unread`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/emails"] })}
            data-testid="button-refresh-inbox"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            onClick={() => processInboxMutation.mutate()}
            disabled={processInboxMutation.isPending}
            data-testid="button-process-inbox"
          >
            {processInboxMutation.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            Process Inbox with AI
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        {isLoading ? (
          <div>
            {Array.from({ length: 5 }).map((_, i) => (
              <EmailSkeleton key={i} />
            ))}
          </div>
        ) : emails && emails.length > 0 ? (
          <div className="divide-y">
            {emails.map((email) => {
              const CategoryIcon = email.category ? categoryConfig[email.category]?.icon : Tag;
              return (
                <div
                  key={email.id}
                  className={`flex items-start gap-4 p-4 cursor-pointer hover-elevate transition-colors ${
                    !email.read ? "bg-primary/5" : ""
                  }`}
                  onClick={() => handleEmailClick(email)}
                  data-testid={`email-row-${email.id}`}
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    {email.read ? (
                      <MailOpen className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <Mail className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className={`text-sm ${!email.read ? "font-semibold" : "font-medium"}`} data-testid={`text-sender-${email.id}`}>
                        {email.sender}
                      </span>
                      <span className="text-xs text-muted-foreground flex-shrink-0" data-testid={`text-date-${email.id}`}>
                        {formatDate(email.date)}
                      </span>
                    </div>
                    <h3 className={`text-base truncate ${!email.read ? "font-semibold" : ""}`} data-testid={`text-subject-${email.id}`}>
                      {email.subject}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate mt-1" data-testid={`text-preview-${email.id}`}>
                      {email.body.substring(0, 100)}...
                    </p>
                  </div>
                  <div className="flex-shrink-0 flex flex-col items-end gap-2">
                    {email.category && (
                      <Badge 
                        variant="secondary" 
                        className={`${categoryConfig[email.category]?.color} text-xs`}
                        data-testid={`badge-category-${email.id}`}
                      >
                        <CategoryIcon className="h-3 w-3 mr-1" />
                        {email.category}
                      </Badge>
                    )}
                    {email.actionItems && email.actionItems.length > 0 && (
                      <Badge variant="outline" className="text-xs" data-testid={`badge-actions-${email.id}`}>
                        <Clock className="h-3 w-3 mr-1" />
                        {email.actionItems.length} task{email.actionItems.length > 1 ? "s" : ""}
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <Mail className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No emails yet</h3>
            <p className="text-sm text-muted-foreground">
              Your inbox is empty. Load some emails to get started.
            </p>
          </div>
        )}
      </ScrollArea>

      <Dialog open={!!selectedEmail} onOpenChange={(open) => !open && setSelectedEmail(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          {selectedEmail && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <DialogTitle className="text-xl mb-2" data-testid="text-modal-subject">
                      {selectedEmail.subject}
                    </DialogTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                      <span className="font-medium text-foreground" data-testid="text-modal-sender">
                        {selectedEmail.sender}
                      </span>
                      <span>&lt;{selectedEmail.senderEmail}&gt;</span>
                      <span>•</span>
                      <span data-testid="text-modal-date">{format(new Date(selectedEmail.date), "PPpp")}</span>
                    </div>
                  </div>
                  {selectedEmail.category && (
                    <Badge 
                      variant="secondary" 
                      className={categoryConfig[selectedEmail.category]?.color}
                      data-testid="badge-modal-category"
                    >
                      {selectedEmail.category}
                    </Badge>
                  )}
                </div>
              </DialogHeader>
              
              <div className="flex items-center gap-2 mt-4 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => extractActionsMutation.mutate(selectedEmail.id)}
                  disabled={extractActionsMutation.isPending}
                  data-testid="button-extract-actions"
                >
                  {extractActionsMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <ListChecks className="h-4 w-4 mr-2" />
                  )}
                  Extract Actions
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generateDraftMutation.mutate(selectedEmail.id)}
                  disabled={generateDraftMutation.isPending}
                  data-testid="button-generate-draft"
                >
                  {generateDraftMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <PenLine className="h-4 w-4 mr-2" />
                  )}
                  Generate Draft
                </Button>
              </div>

              <ScrollArea className="flex-1 mt-4">
                <div className="prose prose-sm dark:prose-invert max-w-none" data-testid="text-modal-body">
                  <p className="whitespace-pre-wrap">{selectedEmail.body}</p>
                </div>
                
                {selectedEmail.actionItems && selectedEmail.actionItems.length > 0 && (
                  <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                    <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-3 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Extracted Action Items
                    </h4>
                    <ul className="space-y-2">
                      {selectedEmail.actionItems.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm" data-testid={`action-item-${idx}`}>
                          <span className="w-5 h-5 rounded-full bg-amber-200 dark:bg-amber-700 text-amber-800 dark:text-amber-200 flex items-center justify-center text-xs flex-shrink-0">
                            {idx + 1}
                          </span>
                          <div>
                            <span className="text-amber-900 dark:text-amber-100">{item.task}</span>
                            {item.deadline && (
                              <span className="text-amber-700 dark:text-amber-300 ml-2">
                                (Due: {item.deadline})
                              </span>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
