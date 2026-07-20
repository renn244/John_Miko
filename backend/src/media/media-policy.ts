import { Role } from 'src/generated/prisma/enums';

export enum MediaPurpose {
  ACCOMMODATION = 'ACCOMMODATION',
  MENU_ITEM = 'MENU_ITEM',
  ADD_ON_SERVICE = 'ADD_ON_SERVICE',
  PAYMENT_METHOD_QR = 'PAYMENT_METHOD_QR',
  PAYMENT_PROOF = 'PAYMENT_PROOF',
  STAFF_REPORT_PROOF = 'STAFF_REPORT_PROOF',
  MAINTENANCE_ISSUE = 'MAINTENANCE_ISSUE',
  MAINTENANCE_RESOLUTION = 'MAINTENANCE_RESOLUTION',
}

export type MediaVisibility = 'public' | 'private';
export type MediaDeliveryType = 'upload' | 'authenticated';

export type MediaPolicy = {
  publicIdPrefix: string;
  visibility: MediaVisibility;
  deliveryType: MediaDeliveryType;
  allowedRoles: readonly Role[];
};

export const MEDIA_POLICIES: Record<MediaPurpose, MediaPolicy> = {
  [MediaPurpose.ACCOMMODATION]: {
    publicIdPrefix: 'public/accommodations',
    visibility: 'public',
    deliveryType: 'upload',
    allowedRoles: [Role.ADMIN],
  },
  [MediaPurpose.MENU_ITEM]: {
    publicIdPrefix: 'public/menu-items',
    visibility: 'public',
    deliveryType: 'upload',
    allowedRoles: [Role.ADMIN],
  },
  [MediaPurpose.ADD_ON_SERVICE]: {
    publicIdPrefix: 'public/add-on-services',
    visibility: 'public',
    deliveryType: 'upload',
    allowedRoles: [Role.ADMIN],
  },
  [MediaPurpose.PAYMENT_METHOD_QR]: {
    publicIdPrefix: 'public/payment-methods',
    visibility: 'public',
    deliveryType: 'upload',
    allowedRoles: [Role.ADMIN],
  },
  [MediaPurpose.PAYMENT_PROOF]: {
    publicIdPrefix: 'private/payment-proofs',
    visibility: 'private',
    deliveryType: 'authenticated',
    allowedRoles: [Role.GUEST, Role.ADMIN],
  },
  [MediaPurpose.STAFF_REPORT_PROOF]: {
    publicIdPrefix: 'private/staff-reports',
    visibility: 'private',
    deliveryType: 'authenticated',
    allowedRoles: [Role.RESORT_STAFF],
  },
  [MediaPurpose.MAINTENANCE_ISSUE]: {
    publicIdPrefix: 'private/maintenance/issues',
    visibility: 'private',
    deliveryType: 'authenticated',
    allowedRoles: [Role.ADMIN],
  },
  [MediaPurpose.MAINTENANCE_RESOLUTION]: {
    publicIdPrefix: 'private/maintenance/resolutions',
    visibility: 'private',
    deliveryType: 'authenticated',
    allowedRoles: [Role.ADMIN, Role.MAINTENANCE_STAFF],
  },
};
