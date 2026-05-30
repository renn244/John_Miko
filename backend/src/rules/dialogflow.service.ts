import { IntentsClient, protos, SessionsClient } from '@google-cloud/dialogflow';
import {
    Inject,
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { DIALOGFLOW_OPTIONS_KEY, DialogFlowOptions } from './dialogo-options.provider';

export type DialogflowDetectIntentResult = {
    intent: string | null;
    confidence: number;
};

@Injectable()
export class DialogflowService {
    private readonly logger = new Logger(DialogflowService.name);

    private readonly intentsClient: IntentsClient;
    private readonly sessionsClient: SessionsClient;

    private readonly projectId: string;
    private readonly location: string;

    constructor(
        @Inject(DIALOGFLOW_OPTIONS_KEY) private readonly dialogflowOptions: DialogFlowOptions
    ) {
        const projectId = this.dialogflowOptions.projectId;
        const location = this.dialogflowOptions.location;

        if (!projectId) {
            throw new InternalServerErrorException('DIALOGFLOW_PROJECT_ID is not configured');
        }

        this.projectId = projectId;

        // Dialogflow ES can be global or regional. If your agent was created in a
        // specific region, you must use the regional endpoint + location paths.
        // Set `DIALOGFLOW_LOCATION=global` to force global behavior.
        this.location = (location ?? 'asia-northeast1').trim();

        const isRegional = this.location.length > 0 && this.location !== 'global';
        const clientOptions = isRegional
            ? { apiEndpoint: `${this.location}-dialogflow.googleapis.com` }
            : undefined;

        this.intentsClient = new IntentsClient(clientOptions);
        this.sessionsClient = new SessionsClient(clientOptions);
    }

    private get agentPath(): string {
        if (this.location && this.location !== 'global') {
            return this.intentsClient.projectLocationAgentPath(
                this.projectId,
                this.location,
            );
        }

        return this.intentsClient.projectAgentPath(this.projectId);
    }

    private normalizeTrainingPhrases(trainingPhrases: string[]): string[] {
        return trainingPhrases.map((p) => p.trim()).filter(Boolean);
    }

    private toTrainingPhrases(trainingPhrases: string[]): protos.google.cloud.dialogflow.v2.Intent.ITrainingPhrase[] {
        const normalized = this.normalizeTrainingPhrases(trainingPhrases);

        return normalized.map((text) => ({
            type: protos.google.cloud.dialogflow.v2.Intent.TrainingPhrase.Type.EXAMPLE,
            parts: [{ text }],
        }));
    }

    private async findIntentByDisplayName(
        displayName: string,
    ): Promise<protos.google.cloud.dialogflow.v2.IIntent | null> {
        const [intents] = await this.intentsClient.listIntents({
            parent: this.agentPath,
            intentView: protos.google.cloud.dialogflow.v2.IntentView.INTENT_VIEW_FULL,
        });

        const match = intents.find((intent) => intent.displayName === displayName);
        return match ?? null;
    }

    async createIntent(intentName: string, trainingPhrases: string[]): Promise<void> {
        try {
            const [existing] = await this.intentsClient.listIntents({ parent: this.agentPath });

            if (existing.some((i) => i.displayName === intentName)) {
                return;
            }

            await this.intentsClient.createIntent({
                parent: this.agentPath,
                intent: {
                    displayName: intentName,
                    trainingPhrases: this.toTrainingPhrases(trainingPhrases),
                },
            });
        } catch (error: any) {
            this.logger.error(`Dialogflow createIntent failed: ${error?.message ?? error}`);
            throw new InternalServerErrorException('Dialogflow createIntent failed');
        }
  }

    async updateIntent(intentName: string, trainingPhrases: string[]): Promise<void> {
        try {
            const existing = await this.findIntentByDisplayName(intentName);

            if (!existing?.name) {
                throw new NotFoundException(`Dialogflow intent not found: ${intentName}`);
            }

            await this.intentsClient.updateIntent({
                intent: {
                name: existing.name,
                    displayName: existing.displayName,
                    trainingPhrases: this.toTrainingPhrases(trainingPhrases),
                },
                updateMask: { paths: ['training_phrases'] },
            })
        } catch (error: any) {
            if (error instanceof NotFoundException) {
                throw error;
            }

            this.logger.error(`Dialogflow updateIntent failed: ${error?.message ?? error}`);

            throw new InternalServerErrorException('Dialogflow updateIntent failed');
        }
    }

    async deleteIntent(intentName: string): Promise<void> {
        try {
            const existing = await this.findIntentByDisplayName(intentName);

            if (!existing?.name) {
                // should delete to prevent orphan
                return;
            }

            await this.intentsClient.deleteIntent({ name: existing.name });
        } catch (error: any) {
            this.logger.error(`Dialogflow deleteIntent failed: ${error?.message ?? error}`);
            throw new InternalServerErrorException('Dialogflow deleteIntent failed');
        }
    }

    async detectIntent(message: string): Promise<DialogflowDetectIntentResult> {
        try {
            const sessionId = uuidv4();
            const sessionPath =
                this.location && this.location !== 'global'
                ? this.sessionsClient.projectLocationAgentSessionPath(
                        this.projectId,
                        this.location,
                        sessionId,
                    )
                : this.sessionsClient.projectAgentSessionPath(this.projectId, sessionId);

            const request: protos.google.cloud.dialogflow.v2.IDetectIntentRequest = {
                session: sessionPath,
                queryInput: {
                    text: {
                        text: message,
                        languageCode: 'en-US',
                    }
                },
            };

            const [response] = await this.sessionsClient.detectIntent(request);
            const queryResult = response.queryResult;

            const intent = queryResult?.intent?.displayName ?? null;
            const confidence = queryResult?.intentDetectionConfidence ?? 0;

            this.logger.log(`Dialogflow detected Intent: [${intent}], confidence: [${(confidence * 100).toFixed(2)}%]`)

            return { intent, confidence };
        } catch (error: any) {
            this.logger.error(`Dialogflow detectIntent failed: ${error?.message ?? error}`);
            throw new InternalServerErrorException('Dialogflow detectIntent failed');
        }
    }
}
