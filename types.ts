export interface SafetyAnalysisRequest {
  image: File;
  description: string;
}

export interface AnalysisState {
  isLoading: boolean;
  result: string | null;
  error: string | null;
  selectedImage: string | null;
  selectedFile: File | null;
}

export enum RiskLevel {
  LOW = 'Низкий',
  MEDIUM = 'Средний',
  HIGH = 'Высокий',
  UNKNOWN = 'Не определен'
}