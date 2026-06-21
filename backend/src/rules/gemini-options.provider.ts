import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export type GeminiOptions = {
  apiKey?: string;
  model: string;
  apiUrl: string;
};

export const GEMINI_OPTIONS_KEY = 'GEMINI_OPTIONS' as const;

const GEMINI_OPTIONS = {
  provide: GEMINI_OPTIONS_KEY,
  useFactory: (configService: ConfigService) => {
    const model = configService.get<string>('GEMINI_MODEL') || 'gemini-2.5-flash-lite';

    return {
      apiKey: configService.get<string>('GEMINI_API_KEY'),
      model,
      apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models',
    };
  },
  inject: [ConfigService],
} satisfies Provider;

export default GEMINI_OPTIONS;
