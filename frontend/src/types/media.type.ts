export type MediaPurpose =
    | "ACCOMMODATION"
    | "MENU_ITEM"
    | "ADD_ON_SERVICE"
    | "PAYMENT_METHOD_QR"
    | "PAYMENT_PROOF"
    | "STAFF_REPORT_PROOF"
    | "MAINTENANCE_ISSUE"
    | "MAINTENANCE_RESOLUTION";

export type UploadSignatureResponse = {
    cloudName: string;
    apiKey: string;
    uploadUrl: string;
    uploadPreset: string;
    timestamp: number;
    signature: string;
    publicId: string;
    deliveryType: "upload" | "authenticated";
    visibility: "public" | "private";
    deliveryUrl?: string;
};
