import { Provider } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

export type DialogFlowOptions = {
  projectId: string;
  location: string;
}

export const DIALOGFLOW_OPTIONS_KEY = 'DIALOGFLOW_OPTIONS' as const;

const DIALOGFLOW_OPTIONS = {
  provide: DIALOGFLOW_OPTIONS_KEY,
  useFactory: (configService: ConfigService) => {
    return {
      projectId: configService.get<string>("DIALOGFLOW_PROJECT_ID"),
      location: configService.get<string>("DIALOGFLOW_LOCATION")
    }
  },
  inject: [ConfigService]
} satisfies Provider;

export default DIALOGFLOW_OPTIONS;