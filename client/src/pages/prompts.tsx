import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Settings, Save, RotateCcw, Loader2, Tag, ClipboardList, Reply, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Prompt } from "@shared/schema";

const promptInfo: Record<string, { icon: typeof Tag; description: string }> = {
  categorization: {
    icon: Tag,
    description: "This prompt guides how the AI categorizes emails into Important, Newsletter, Spam, or To-Do categories.",
  },
  action_extraction: {
    icon: ClipboardList,
    description: "This prompt defines how the AI extracts action items and tasks from email content.",
  },
  auto_reply: {
    icon: Reply,
    description: "This prompt controls how the AI generates draft replies based on email context.",
  },
};

function PromptSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-2/3 mt-2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-32 w-full" />
      </CardContent>
    </Card>
  );
}

export default function PromptsPage() {
  const { toast } = useToast();
  const [editedPrompts, setEditedPrompts] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState<Record<string, boolean>>({});

  const { data: prompts, isLoading } = useQuery<Prompt[]>({
    queryKey: ["/api/prompts"],
  });

  const updatePromptMutation = useMutation({
    mutationFn: async ({ id, content }: { id: string; content: string }) => {
      return apiRequest("PATCH", `/api/prompts/${id}`, { content });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/prompts"] });
      setHasChanges((prev) => ({ ...prev, [variables.id]: false }));
      toast({
        title: "Prompt Updated",
        description: "Your prompt configuration has been saved.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetPromptMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("POST", `/api/prompts/${id}/reset`);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["/api/prompts"] });
      setEditedPrompts((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      setHasChanges((prev) => ({ ...prev, [id]: false }));
      toast({
        title: "Prompt Reset",
        description: "The prompt has been reset to its default value.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Reset Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handlePromptChange = (id: string, value: string, originalContent: string) => {
    setEditedPrompts((prev) => ({ ...prev, [id]: value }));
    setHasChanges((prev) => ({ ...prev, [id]: value !== originalContent }));
  };

  const handleSave = (id: string) => {
    const content = editedPrompts[id];
    if (content) {
      updatePromptMutation.mutate({ id, content });
    }
  };

  const handleReset = (id: string) => {
    resetPromptMutation.mutate(id);
  };

  const getPromptValue = (prompt: Prompt) => {
    return editedPrompts[prompt.id] ?? prompt.content;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b">
        <div className="flex items-center gap-3 mb-2">
          <Settings className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight" data-testid="text-prompts-title">Agent Brain</h1>
        </div>
        <p className="text-muted-foreground">
          Configure the AI prompts that control how the email agent processes and responds to emails.
        </p>
      </div>

      <ScrollArea className="flex-1 p-6">
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertDescription>
            These prompts are the "brain" of your email agent. Modify them to change how the AI 
            categorizes emails, extracts action items, and generates replies. Changes take effect immediately.
          </AlertDescription>
        </Alert>

        {isLoading ? (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <PromptSkeleton key={i} />
            ))}
          </div>
        ) : prompts && prompts.length > 0 ? (
          <div className="space-y-6">
            {prompts.map((prompt) => {
              const info = promptInfo[prompt.type];
              const Icon = info?.icon || Settings;
              const isChanged = hasChanges[prompt.id];
              const isSaving = updatePromptMutation.isPending && updatePromptMutation.variables?.id === prompt.id;
              const isResetting = resetPromptMutation.isPending && resetPromptMutation.variables === prompt.id;

              return (
                <Card key={prompt.id} data-testid={`prompt-card-${prompt.type}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg" data-testid={`text-prompt-name-${prompt.type}`}>
                            {prompt.name}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {info?.description || prompt.description}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReset(prompt.id)}
                          disabled={isResetting || isSaving}
                          data-testid={`button-reset-${prompt.type}`}
                        >
                          {isResetting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <RotateCcw className="h-4 w-4" />
                          )}
                          <span className="ml-2 hidden sm:inline">Reset</span>
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleSave(prompt.id)}
                          disabled={!isChanged || isSaving}
                          data-testid={`button-save-${prompt.type}`}
                        >
                          {isSaving ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Save className="h-4 w-4 mr-2" />
                          )}
                          Save
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label htmlFor={`prompt-${prompt.id}`} className="sr-only">
                        {prompt.name} Prompt
                      </Label>
                      <Textarea
                        id={`prompt-${prompt.id}`}
                        value={getPromptValue(prompt)}
                        onChange={(e) => handlePromptChange(prompt.id, e.target.value, prompt.content)}
                        className="min-h-[150px] font-mono text-sm resize-y"
                        placeholder="Enter your prompt here..."
                        data-testid={`textarea-prompt-${prompt.type}`}
                      />
                      {isChanged && (
                        <p className="text-xs text-amber-600 dark:text-amber-400">
                          You have unsaved changes
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="flex items-center justify-center p-12">
            <div className="text-center">
              <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">No Prompts Found</h3>
              <p className="text-sm text-muted-foreground">
                Prompt templates will appear here once loaded.
              </p>
            </div>
          </Card>
        )}
      </ScrollArea>
    </div>
  );
}
