import { Switch, Route, useLocation, Link } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, MessageSquare, Settings, FileText, Sparkles } from "lucide-react";
import InboxPage from "@/pages/inbox";
import EmailAgentPage from "@/pages/email-agent";
import PromptsPage from "@/pages/prompts";
import DraftsPage from "@/pages/drafts";
import NotFound from "@/pages/not-found";

function AppHeader() {
  return (
    <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="h-full flex items-center justify-between px-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight" data-testid="text-app-title">
              Email Agent
            </h1>
            <p className="text-xs text-muted-foreground hidden sm:block">
              AI-powered email productivity
            </p>
          </div>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}

function AppNavigation() {
  const [location] = useLocation();
  
  const tabs = [
    { path: "/", label: "Inbox", icon: Mail },
    { path: "/agent", label: "Email Agent", icon: MessageSquare },
    { path: "/prompts", label: "Agent Brain", icon: Settings },
    { path: "/drafts", label: "Drafts", icon: FileText },
  ];

  const getCurrentTab = () => {
    const current = tabs.find(tab => tab.path === location);
    return current?.path || "/";
  };

  return (
    <nav className="border-b bg-background px-6">
      <Tabs value={getCurrentTab()} className="w-full">
        <TabsList className="w-full justify-start h-12 bg-transparent p-0 gap-0">
          {tabs.map((tab) => (
            <Link key={tab.path} href={tab.path}>
              <TabsTrigger
                value={tab.path}
                className="h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 gap-2"
                data-testid={`tab-${tab.label.toLowerCase().replace(" ", "-")}`}
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            </Link>
          ))}
        </TabsList>
      </Tabs>
    </nav>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={InboxPage} />
      <Route path="/agent" component={EmailAgentPage} />
      <Route path="/prompts" component={PromptsPage} />
      <Route path="/drafts" component={DraftsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div className="min-h-screen flex flex-col bg-background">
            <AppHeader />
            <AppNavigation />
            <main className="flex-1 overflow-hidden">
              <Router />
            </main>
          </div>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
