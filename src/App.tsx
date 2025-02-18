import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SearchInput } from './components/SearchInput';
import { FavoritesList } from './components/FavoritesList';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Live Movie Search
          </h1>
          <SearchInput />
          <div className="bg-white rounded-lg shadow p-6">
            <FavoritesList />
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;