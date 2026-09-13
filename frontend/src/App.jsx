import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LandingPage } from "./pages/LandingPage";
import { ResumeProfilePage } from "./pages/ResumeProfilePage";
import { JobFeedPage } from "./pages/JobFeedPage";
import { AgentControlPage } from "./pages/AgentControlPage";
import { RunHistoryPage } from "./pages/RunHistoryPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import "@/store/themeStore";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/resume-profile" element={<ResumeProfilePage />} />
          <Route path="/job-feed" element={<JobFeedPage />} />
          <Route path="/agent-control" element={<AgentControlPage />} />
          <Route path="/run-history" element={<RunHistoryPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
