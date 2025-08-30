export interface SearchResponse {
  route: string | null;
  message?: string;
  suggestions?: string[];
}

export interface SearchRequest {
  searchTerm: string;
}

export interface SearchError {
  error: string;
}
