import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RedirectionPage } from "./pages/RedirectionPage";

export function App() {
  const queryClient = new QueryClient()

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/:shortenedUrl" element={<RedirectionPage />} />
            <Route path="/not-found" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
      <Toaster position="bottom-right" />
    </>
  )
}
