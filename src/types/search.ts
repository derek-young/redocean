export interface SearchResponse {
  route: string | null;
  action: string;
  confidence: "high" | "low";
  message: string;
  suggestions?: string[];
}

export interface SearchRequest {
  searchTerm: string;
}

export interface SearchError {
  error: string;
}
