export type PaymentMethodType = 'GCASH' | 'MAYA' | 'BANK' | 'CASH';

export type PaymentMethod = {
    id: string;
    name: string;
    type: PaymentMethodType;
    accountName?: string | null;
    accountNumber?: string | null;
    instructions?: string | null;
    qrCodeUrl?: string | null;
    isActive: boolean;
    sortOrder: number;
    createdAt: string;
    updatedAt: string;
};

export type CreatePaymentMethodDto = {
    name: string;
    type: PaymentMethodType;
    accountName?: string;
    accountNumber?: string;
    instructions?: string;
    qrCodeUrl?: string | null;
    isActive?: boolean;
    sortOrder?: number;
};

export type UpdatePaymentMethodDto = Partial<CreatePaymentMethodDto>;

export type GetPaymentMethodsQuery = {
    search?: string;
    type?: PaymentMethodType;
    isActive?: boolean;
    page?: number;
    limit?: number;
};
