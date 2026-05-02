export type PaymongoPaymentMethod =
  | 'card'
  | 'gcash'
  | 'paymaya'
  | 'grab_pay'
  | 'dob'
  | 'dob_ubp'
  | 'billease'
  | 'qrph';

export interface CheckoutLineItem {
    amount: number;       // in centavos
    currency: 'PHP';
    name: string;         // e.g. 'Accommodation Fee', 'Pre-order Fee'
    quantity: number;
    images?: string[];      // array of image URLs to show in the checkout page
    description?: string;
}

export interface CheckoutBillingAddress {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
}

export interface CheckoutBilling {
    name?: string;
    email?: string;
    phone?: string;
    address?: CheckoutBillingAddress;
}

export interface CreateCheckoutSessionAttributes {
    line_items: CheckoutLineItem[];              // required
    payment_method_types: PaymongoPaymentMethod[]; // required
    success_url: string;                         // required
    description?: string;
    cancel_url?: string;
    billing?: CheckoutBilling;
    send_email_receipt?: boolean;
    show_description?: boolean;
    show_line_items?: boolean;                   // shows itemized breakdown to guest
    reference_number?: string;                   // good for bookingId
    metadata?: Record<string, unknown>;
}

export interface CreateCheckoutSessionBody {
    data: {
        attributes: CreateCheckoutSessionAttributes;
    };
}

export interface CheckoutSessionResponse {
    data: {
        id: string;
            type: 'checkout_session';
            attributes: {
            billing: CheckoutBilling | null;
            cancel_url: string | null;
            checkout_url: string;         // redirect guest here
            client_key: string;
            description: string | null;
            line_items: CheckoutLineItem[];
            livemode: boolean;
            merchant: string;
            payment_method_types: PaymongoPaymentMethod[];
            reference_number: string | null;
            send_email_receipt: boolean;
            show_description: boolean;
            show_line_items: boolean;
            status: 'active' | 'expired';
            success_url: string;
            created_at: number;
            updated_at: number;
            paid_at: number | null;
        };
    };
}

export interface CheckoutSessionWebhookEvent {
    data: {
        id: string;
        type: 'event';
        attributes: {
            type: 'checkout_session.payment.paid';
            livemode: boolean;
            data: CheckoutSessionResponse['data'];
        };
    };
}