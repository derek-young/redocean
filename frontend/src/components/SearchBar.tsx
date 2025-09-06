import { Search } from "@mui/icons-material";

import { useSearchContext } from "@/context/SearchContext";

import Loading from "./Loading";

function SearchBar() {
  const { searchTerm, setSearchTerm, isSearching, onSubmitSearch } =
    useSearchContext();

  return (
    <form onSubmit={onSubmitSearch} className="relative">
      <button
        type="submit"
        disabled={isSearching || !searchTerm.trim()}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-red-600 text-white p-2 rounded-md hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        <Search className="w-5 h-5" />
      </button>
      <input
        aria-label="Search"
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search in RedOcean"
        className="w-full pl-14 pr-4 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        disabled={isSearching}
      />
      {isSearching && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <Loading />
        </div>
      )}
    </form>
  );
}

export default SearchBar;
