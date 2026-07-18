import type { StaffRole } from "@/types/auth.type";

export type RoleTourTargetId =
  | "resort.dashboard-header"
  | "resort.booking-search"
  | "resort.new-report-header"
  | "resort.report-details"
  | "resort.report-severity"
  | "resort.report-proof-photos"
  | "resort.reports-header"
  | "resort.reports-filter"
  | "resort.settings-replay-guide"
  | "kitchen.dashboard-header"
  | "kitchen.pre-order-search"
  | "kitchen.date-filter"
  | "kitchen.settings-replay-guide"
  | "maintenance.dashboard-header"
  | "maintenance.ticket-search"
  | "maintenance.history-header"
  | "maintenance.history-ticket-search"
  | "maintenance.settings-replay-guide";

export type RoleTourStepDefinition = {
  id: string;
  targetId: RoleTourTargetId;
  title: string;
  description: string;
  details: string[];
};

export type RoleTourChapterDefinition = {
  id: string;
  label: string;
  route: string;
  steps: RoleTourStepDefinition[];
  scrollTargetIds?: RoleTourTargetId[];
};

export type RoleTourDefinition = {
  id: string;
  storageVersion: string;
  chapters: RoleTourChapterDefinition[];
};

export const roleTourDefinitions: Record<StaffRole, RoleTourDefinition> = {
  RESORT_STAFF: {
    id: "resort-staff-role-guide-v2",
    storageVersion: "v2",
    chapters: [
      {
        id: "resort-bookings",
        label: "Bookings",
        route: "/resort-staff",
        steps: [
          {
            id: "resort-bookings-overview",
            targetId: "resort.dashboard-header",
            title: "Upcoming bookings",
            description:
              "Use this workspace to prepare for confirmed guest arrivals.",
            details: [
              "Tap any booking card to review its guest, stay, and accommodation details.",
              "Start here at the beginning of each shift to see what is coming up.",
            ],
          },
          {
            id: "resort-booking-search",
            targetId: "resort.booking-search",
            title: "Find a reservation",
            description:
              "Search by guest name or booking reference to locate a reservation quickly.",
            details: [
              "Use the guest name when assisting someone in person.",
              "Use the booking reference when you need an exact match.",
            ],
          },
        ],
      },
      {
        id: "resort-new-report",
        label: "New Report",
        route: "/resort-staff/new-report",
        scrollTargetIds: [
          "resort.new-report-header",
          "resort.report-details",
          "resort.report-severity",
          "resort.report-proof-photos",
        ],
        steps: [
          {
            id: "resort-new-report-overview",
            targetId: "resort.new-report-header",
            title: "New report",
            description:
              "Report a general maintenance concern not linked to a booking.",
            details: [],
          },
          {
            id: "resort-report-details",
            targetId: "resort.report-details",
            title: "Describe the concern",
            description:
              "Add a clear title, location, and what needs attention.",
            details: [],
          },
          {
            id: "resort-report-severity",
            targetId: "resort.report-severity",
            title: "Set the severity",
            description:
              "Low is minor, Medium needs attention, and High is urgent.",
            details: [],
          },
          {
            id: "resort-report-proof-photos",
            targetId: "resort.report-proof-photos",
            title: "Attach proof photos",
            description: "Attach one to three clear photos of the issue.",
            details: [],
          },
        ],
      },
      {
        id: "resort-my-reports",
        label: "My Reports",
        route: "/resort-staff/(reports)",
        steps: [
          {
            id: "resort-reports-overview",
            targetId: "resort.reports-header",
            title: "My reports",
            description:
              "Track the reports you submitted and their progress through admin review.",
            details: [
              "Open a report card when you need its full details and current status.",
            ],
          },
          {
            id: "resort-reports-filter",
            targetId: "resort.reports-filter",
            title: "Filter reports",
            description:
              "Narrow your report list when you are looking for a particular status or concern.",
            details: [
              "Filter by status, report type, or severity without changing any report data.",
            ],
          },
        ],
      },
      {
        id: "resort-settings",
        label: "Settings",
        route: "/resort-staff/settings",
        scrollTargetIds: ["resort.settings-replay-guide"],
        steps: [
          {
            id: "resort-settings-replay",
            targetId: "resort.settings-replay-guide",
            title: "Need this guide again?",
            description:
              "Your Settings page is where you can update your account and replay this walkthrough.",
            details: [
              "Replay role guide always starts again from Upcoming bookings.",
            ],
          },
        ],
      },
    ],
  },
  KITCHEN_STAFF: {
    id: "kitchen-staff-role-guide-v2",
    storageVersion: "v2",
    chapters: [
      {
        id: "kitchen-queue",
        label: "Kitchen Queue",
        route: "/kitchen-staff",
        steps: [
          {
            id: "kitchen-queue-overview",
            targetId: "kitchen.dashboard-header",
            title: "Kitchen queue",
            description:
              "See the guest pre-orders that need preparation for the selected day.",
            details: [
              "Open an order to review its meals, add-ons, and booking details.",
            ],
          },
          {
            id: "kitchen-search",
            targetId: "kitchen.pre-order-search",
            title: "Find a pre-order",
            description:
              "Search by guest or booking reference when you need a specific order.",
            details: [],
          },
          {
            id: "kitchen-date-filter",
            targetId: "kitchen.date-filter",
            title: "Filter by date",
            description:
              "Choose a preparation date to focus the kitchen queue on the right orders.",
            details: [
              "Pick the date you are preparing for to avoid mixing different service days.",
              "Clear or change the date whenever you need to review another day’s queue.",
            ],
          },
        ],
      },
      {
        id: "kitchen-settings",
        label: "Settings",
        route: "/kitchen-staff/settings",
        scrollTargetIds: ["kitchen.settings-replay-guide"],
        steps: [
          {
            id: "kitchen-settings-replay",
            targetId: "kitchen.settings-replay-guide",
            title: "Need this guide again?",
            description:
              "Use Settings to update your account and replay this walkthrough.",
            details: [
              "Replay role guide always starts again from the Kitchen queue.",
            ],
          },
        ],
      },
    ],
  },
  MAINTENANCE_STAFF: {
    id: "maintenance-staff-role-guide-v2",
    storageVersion: "v2",
    chapters: [
      {
        id: "maintenance-assigned-work",
        label: "Maintenance",
        route: "/maintenance-staff",
        steps: [
          {
            id: "maintenance-assigned-work-overview",
            targetId: "maintenance.dashboard-header",
            title: "Assigned maintenance",
            description:
              "Your active maintenance work appears below this dashboard header.",
            details: [
              "Open a ticket to read the issue and update its work progress.",
            ],
          },
          {
            id: "maintenance-search",
            targetId: "maintenance.ticket-search",
            title: "Find a ticket",
            description:
              "Search by ticket ID or title to quickly find assigned maintenance work.",
            details: [],
          },
        ],
      },
      {
        id: "maintenance-history",
        label: "History",
        route: "/maintenance-staff/(history)",
        steps: [
          {
            id: "maintenance-history-overview",
            targetId: "maintenance.history-header",
            title: "Maintenance history",
            description:
              "Review completed and past maintenance work when you need a record of it.",
            details: [
              "Open a ticket to check its report, resolution, and proof photos.",
            ],
          },
          {
            id: "maintenance-history-search",
            targetId: "maintenance.history-ticket-search",
            title: "Search past work",
            description:
              "Search by ticket ID or title to find a completed maintenance ticket.",
            details: [],
          },
        ],
      },
      {
        id: "maintenance-settings",
        label: "Settings",
        route: "/maintenance-staff/settings",
        scrollTargetIds: ["maintenance.settings-replay-guide"],
        steps: [
          {
            id: "maintenance-settings-replay",
            targetId: "maintenance.settings-replay-guide",
            title: "Need this guide again?",
            description:
              "Use Settings to update your account and replay this walkthrough.",
            details: [
              "Replay role guide always starts again from Assigned maintenance.",
            ],
          },
        ],
      },
    ],
  },
};

export const getRoleTourDefinition = (role: StaffRole) =>
  roleTourDefinitions[role];

export const getRoleTourStepCount = (definition: RoleTourDefinition) =>
  definition.chapters.reduce(
    (count, chapter) => count + chapter.steps.length,
    0,
  );

export const getRoleTourStepOffset = (
  definition: RoleTourDefinition,
  chapterIndex: number,
) =>
  definition.chapters
    .slice(0, chapterIndex)
    .reduce((count, chapter) => count + chapter.steps.length, 0);
