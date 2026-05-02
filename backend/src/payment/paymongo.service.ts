import { HttpService } from "@nestjs/axios";
import { Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { firstValueFrom } from "rxjs";
import { CheckoutSessionResponse, CreateCheckoutSessionBody } from "./interface/paymongo.types";

@Injectable()
export class PaymongoService {
    constructor(
        private readonly httpService: HttpService,
        @Inject('PAYMONGO_PUBLIC_KEY') private readonly paymongoPublicKey: string,
        @Inject('PAYMONGO_SECRET_KEY') private readonly paymongoSecretKey: string,
        @Inject('PAYMONGO_API_URL') private readonly paymongoApiUrl: string
    ) {
        if (!this.paymongoPublicKey || !this.paymongoSecretKey || !this.paymongoApiUrl) {
            throw new Error('Paymongo configuration is missing');
        }
    }

    getHeaders(keyType: 'public' | 'secret') {
        const key = keyType === 'public' ? this.paymongoPublicKey : this.paymongoSecretKey;
        return {
            headers: {
                Authorization: `Basic ${Buffer.from(key).toString('base64')}`,
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        };
    }

    async createCheckoutSession(data: CreateCheckoutSessionBody): Promise<CheckoutSessionResponse> {
        try {
            const response = await firstValueFrom(
                this.httpService.post<CheckoutSessionResponse>(
                    `${this.paymongoApiUrl}/checkout_sessions`,
                    data,
                    this.getHeaders('secret')
                )
            );

            return response.data;
        } catch (error) {
            throw new InternalServerErrorException('Failed to create checkout session');
        }
    }

    async retrieveCheckoutSession(id: string): Promise<CheckoutSessionResponse> {
        try {
            const response = await firstValueFrom(
                this.httpService.get<CheckoutSessionResponse>(
                    `${this.paymongoApiUrl}/checkout_sessions/${id}`,
                    this.getHeaders('secret')
                )
            );

            return response.data;
        } catch (error) {
            throw new InternalServerErrorException('Failed to retrieve checkout session');
        }
    }

    async expireCheckoutSession(id: string): Promise<CheckoutSessionResponse> {
        try {
            const response = await firstValueFrom(
                this.httpService.post<CheckoutSessionResponse>(
                    `${this.paymongoApiUrl}/checkout_sessions/${id}/expire`,
                    {},
                    this.getHeaders('secret')
                )
            );
            
            return response.data;
        } catch (error) {
            throw new InternalServerErrorException('Failed to expire checkout session');
        }
    }

    // TODO: refundPayment(paymentId) - later after payments
}