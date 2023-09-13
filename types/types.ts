export type OpenAIModel = 'gpt-3.5-turbo' | 'gpt-4';

export interface TranslateBody {
  help_doc: string;
  language: string;
  model: OpenAIModel;
  apiKey: string;
}

export interface TranslateResponse {
  code: string;
}
