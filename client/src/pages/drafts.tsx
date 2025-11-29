import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { FileText, Trash2, Edit, Loader2, Save, X, Mail, Clock } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Draft } from "@shared/schema";

function DraftSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2 mt-2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-20 w-full" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-9 w-20" />
      </CardFooter>
    </Card>
  );
}

export default function DraftsPage() {
  const { toast } = useToast();
  const [editingDraft, setEditingDraft] = useState<Draft | null>(null);
  const [editForm, setEditForm] = useState({ to: "", subject: "", body: "" });

  const { data: drafts, isLoading } = useQuery<Draft[]>({
    queryKey: ["/api/drafts"],
  });

  const updateDraftMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Draft> }) => {
      return apiRequest("PATCH", `/api/drafts/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/drafts"] });
      setEditingDraft(null);
      toast({
        title: "Draft Saved",
        description: "Your draft has been updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Save Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteDraftMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/drafts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/drafts"] });
      toast({
        title: "Draft Deleted",
        description: "The draft has been removed.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Delete Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleEdit = (draft: Draft) => {
    setEditingDraft(draft);
    setEditForm({
      to: draft.to,
      subject: draft.subject,
      body: draft.body,
    });
  };

  const handleSave = () => {
    if (editingDraft) {
      updateDraftMutation.mutate({
        id: editingDraft.id,
        data: editForm,
      });
    }
  };

  const handleDelete = (id: number) => {
    deleteDraftMutation.mutate(id);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b">
        <div className="flex items-center gap-3 mb-2">
          <FileText className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight" data-testid="text-drafts-title">Drafts</h1>
        </div>
        <p className="text-muted-foreground">
          Review and edit AI-generated email drafts before sending. All drafts are saved locally for safety.
        </p>
      </div>

      <ScrollArea className="flex-1 p-6">
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <DraftSkeleton key={i} />
            ))}
          </div>
        ) : drafts && drafts.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {drafts.map((draft) => (
              <Card key={draft.id} data-testid={`draft-card-${draft.id}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base truncate" data-testid={`text-draft-subject-${draft.id}`}>
                        {draft.subject || "(No Subject)"}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Mail className="h-3 w-3" />
                        <span className="truncate" data-testid={`text-draft-to-${draft.id}`}>{draft.to}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <p className="text-sm text-muted-foreground line-clamp-3" data-testid={`text-draft-preview-${draft.id}`}>
                    {draft.body}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-3">
                    <Clock className="h-3 w-3" />
                    <span>Updated {format(new Date(draft.updatedAt), "MMM d, h:mm a")}</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(draft)}
                    data-testid={`button-edit-draft-${draft.id}`}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        data-testid={`button-delete-draft-${draft.id}`}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Draft?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete this draft.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(draft.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="flex items-center justify-center p-12">
            <div className="text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">No Drafts Yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Draft replies will appear here when you use the Email Agent to generate responses.
                Go to the Email Agent tab and select an email to get started.
              </p>
            </div>
          </Card>
        )}
      </ScrollArea>

      <Dialog open={!!editingDraft} onOpenChange={(open) => !open && setEditingDraft(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Draft</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="to">To</Label>
              <Input
                id="to"
                value={editForm.to}
                onChange={(e) => setEditForm({ ...editForm, to: e.target.value })}
                placeholder="recipient@example.com"
                data-testid="input-draft-to"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={editForm.subject}
                onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
                placeholder="Email subject"
                data-testid="input-draft-subject"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="body">Body</Label>
              <Textarea
                id="body"
                value={editForm.body}
                onChange={(e) => setEditForm({ ...editForm, body: e.target.value })}
                placeholder="Write your email here..."
                className="min-h-[200px] resize-y"
                data-testid="input-draft-body"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setEditingDraft(null)}
              disabled={updateDraftMutation.isPending}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={updateDraftMutation.isPending}
              data-testid="button-save-draft"
            >
              {updateDraftMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Draft
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
