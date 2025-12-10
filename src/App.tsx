import Chat from "./components/Chat";
import LandingPage from "./pages/LandingPage";
import TrendingPage from "./components/TrendingPage";
import Login from "./pages/Login";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route path="/chat" element={<Chat />} />

          <Route path="/login" element={<Login />} />

          <Route path="/trending" element={<TrendingPage />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App;
