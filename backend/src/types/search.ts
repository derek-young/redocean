export interface SearchResponse {
  route: string | null;
  message?: string;
  suggestions?: string[];
  params?: Record<string, any>;
}

export interface SearchRequest {
  searchTerm: string;
}

export interface SearchError {
  error: string;
}
