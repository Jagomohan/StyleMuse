
export enum AppStep {
  ApiKey = 'API_KEY',
  Introduction = 'INTRODUCTION',
  Event = 'EVENT',
  Suggestion = 'SUGGESTION',
  Profiling = 'PROFILING',
  Generating = 'GENERATING',
  Results = 'RESULTS',
}

export interface UserProfile {
  occasion: string;
  vibe: string;
  colorsOrMaterials: string;
  styleInspirations: string;
  budget: string;
}

export interface StyleSuggestion {
  name: string;
  description: string;
  keywords: Partial<Omit<UserProfile, 'occasion'>>;
}

export interface Outfit {
  editPrompt: string;
  explanation: string;
  name: string;
}

export interface AccessorySuggestion {
  name: string;
  description: string;
}

export interface GeneratedLook extends Outfit {
  imageUrl: string;
}