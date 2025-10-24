import TrendingPage from "./components/TrendingPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="">
        <TrendingPage />
      </div>
    </QueryClientProvider>
  )
}

export default App
