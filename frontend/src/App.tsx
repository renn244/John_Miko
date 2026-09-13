import { createBrowserRouter, Navigate, Outlet } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { lazy } from 'react';
import ProtectedRoute from "./features/auth/components/ProtectedRoute";
import { useAuthContext } from "./features/auth/context/AuthContext";
import USER_ROLES from './lib/constant/USER_ROLES.constant';
import About from './features/public/about/pages/AboutPage';
import AccommodationList from './features/public/accommodations/pages/AccommodationListPage';
import AccommodationView from './features/public/accommodations/pages/AccommodationViewPage';
import AdminLayout from "./features/admin/layout/components/AdminLayout";
import Amenities from './features/public/amenities/pages/AmenitiesPage';
import BookingFlow from './features/public/bookings/pages/BookingPage';
import ForbiddenPage from './page/Forbidden';
import ForgotPassword from "./page/ForgotPassword";
import CreateFeedback from './features/public/feedback/pages/CreateFeedbackPage';
import EditFeedback from './features/public/feedback/pages/EditFeedbackPage';
import MyBookings from './features/public/bookings/pages/MyBookingsPage';
import Home from "./features/public/home/pages/HomePage";
import Login from "./page/Login";
import Menu from './features/public/menu/pages/MenuPage';
import NotFoundPage from './page/NotFound';
import ResetPassword from "./page/ResetPassword";
import RouteErrorPage from './page/RouteError';
import Settings from './page/Settings';
import SignUpGuest from "./page/SignUpGuest";
import VirtualTour from './features/public/virtual-tour/pages/VirtualTourPage';

const RouterRoot = () => <Outlet />;
const Accommodation = lazy(() => import('./features/admin/accommodations/pages/Accommodation'));
const AddAccommodation = lazy(() => import('./features/admin/accommodations/pages/AddAccommodation'));
const EditAccommodation = lazy(() => import('./features/admin/accommodations/pages/EditAccommodation'));
const AddAddOnService = lazy(() => import('./features/admin/add-on-services/pages/AddAddOnService'));
const AddOnService = lazy(() => import('./features/admin/add-on-services/pages/AddOnService'));
const EditAddOnService = lazy(() => import('./features/admin/add-on-services/pages/EditAddOnService'));
const AddBooking = lazy(() => import('./features/admin/bookings/pages/AddBooking'));
const Booking = lazy(() => import('./features/admin/bookings/pages/Booking'));
const ViewBooking = lazy(() => import('./features/admin/bookings/pages/ViewBooking'));
const Feedback = lazy(() => import('./features/admin/feedback/pages/Feedback'));
const GuestManagement = lazy(() => import('./features/admin/guest-management/pages/GuestManagement'));
const AddMaintenance = lazy(() => import('./features/admin/maintenance/pages/AddMaintenance'));
const EditMaintenance = lazy(() => import('./features/admin/maintenance/pages/EditMaintenance'));
const Maintenance = lazy(() => import('./features/admin/maintenance/pages/Maintenance'));
const ViewMaintenance = lazy(() => import('./features/admin/maintenance/pages/ViewMaintenance'));
const ViewStaffReport = lazy(() => import('./features/admin/staff-reports/pages/ViewStaffReport'));
const AddMenuItem = lazy(() => import('./features/admin/menu-items/pages/AddMenuItem'));
const EditMenuItem = lazy(() => import('./features/admin/menu-items/pages/EditMenuItem'));
const MenuItem = lazy(() => import('./features/admin/menu-items/pages/MenuItem'));
const Overview = lazy(() => import('./features/admin/overview/pages/Overview'));
const AddPaymentMethod = lazy(() => import('./features/admin/payment-methods/pages/AddPaymentMethod'));
const EditPaymentMethod = lazy(() => import('./features/admin/payment-methods/pages/EditPaymentMethod'));
const PaymentMethods = lazy(() => import('./features/admin/payment-methods/pages/PaymentMethods'));
const Report = lazy(() => import('./features/admin/reports/pages/Report'));
const AdminSettings = lazy(() => import('./features/admin/settings/pages/Settings'));
const AddStaff = lazy(() => import('./features/admin/staff-management/pages/AddStaff'));
const StaffManagement = lazy(() => import('./features/admin/staff-management/pages/StaffManagement'));
const Knowledge = lazy(() => import('./features/admin/knowledge/pages/Knowledge'));
const VirtualTourManagement = lazy(() => import('./features/admin/virtual-tour/pages/VirtualTourManagement'));
const StaffLayout = lazy(() => import('./page/Staff/StaffLayout'));
const MaintenanceAssignedTickets = lazy(() => import('./page/Staff/Maintenance/AssignedTickets'));
const MaintenanceHistory = lazy(() => import('./page/Staff/Maintenance/History'));
const MaintenanceSettings = lazy(() => import('./page/Staff/Maintenance/Settings'));
const MaintenanceTicketDetail = lazy(() => import('./page/Staff/Maintenance/TicketDetail'));
const KitchenLayout = lazy(() => import('./page/Staff/Kitchen/KitchenLayout'));
const KitchenDashboard = lazy(() => import('./page/Staff/Kitchen/Dashboard'));
const KitchenOrderDetail = lazy(() => import('./page/Staff/Kitchen/OrderDetail'));
const KitchenSettings = lazy(() => import('./page/Staff/Kitchen/Settings'));
const ResortLayout = lazy(() => import('./page/Staff/Resort/ResortLayout'));
const ResortDashboard = lazy(() => import('./page/Staff/Resort/Dashboard'));
const ResortNewReport = lazy(() => import('./page/Staff/Resort/NewReport'));
const ResortReports = lazy(() => import('./page/Staff/Resort/Reports'));
const ResortSettings = lazy(() => import('./page/Staff/Resort/Settings'));
const ResortBookingDetail = lazy(() => import('./page/Staff/Resort/BookingDetail'));
const ResortBookingReport = lazy(() => import('./page/Staff/Resort/BookingReport'));
const ResortReportDetail = lazy(() => import('./page/Staff/Resort/ReportDetail'));

const router = createBrowserRouter([
  {
    element: <RouterRoot />,
    errorElement: <RouteErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: '/amenities',
        element: <Amenities />
      },
      {
        path: '/about',
        element: <About />
      },
      {
        path: '/menu',
        element: <Menu />
      },
      {
        path: '/virtual-tour',
        element: <VirtualTour />
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: '/forgot-password',
        element: <ForgotPassword />
      },
      {
        path: '/reset-password',
        element: <ResetPassword />
      },
      {
        path: '/signup-guest',
        element: <SignUpGuest />
      },
      {
        path: '/unauthorized',
        element: <ForbiddenPage />
      },
      {
        path: '/accommodation',
        children: [
          { index: true, element: <AccommodationList /> },
          { path: ':id', element: <AccommodationView /> }
        ]
      },
      {
        path: '/booking/:accommodationId',
        element: (
          <ProtectedRoute rolesAllowed={[USER_ROLES.GUEST]}>
            <BookingFlow />
          </ProtectedRoute>
        )
      },
      {
        path: '/my-bookings',
        element: (
          <ProtectedRoute rolesAllowed={[USER_ROLES.GUEST]}>
            <MyBookings />
          </ProtectedRoute>
        )
      },
      {
        path: '/settings',
        element: (
          <ProtectedRoute rolesAllowed={[USER_ROLES.GUEST, USER_ROLES.ADMIN]}>
            <Settings />
          </ProtectedRoute>
        )
      },
      {
        path: '/feedback/:bookingId',
        element: (
          <ProtectedRoute rolesAllowed={[USER_ROLES.GUEST]}>
            <CreateFeedback />
          </ProtectedRoute>
        )
      },
      {
        path: '/feedback/edit/:feedbackId',
        element: (
          <ProtectedRoute rolesAllowed={[USER_ROLES.GUEST]}>
            <EditFeedback />
          </ProtectedRoute>
        )
      },
      {
        path: '/admin',
        element: (
          <ProtectedRoute rolesAllowed={[USER_ROLES.ADMIN]}>
            <AdminLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <Overview />  },
          { path: 'report', element: <Report /> },
          {
            path: 'accommodation',
            children: [
              { index: true, element: <Accommodation /> },
              { path: 'add', element: <AddAccommodation /> },
              { path: ':id/edit', element: <EditAccommodation /> }
            ]
          },
          {
            path: 'booking',
            children: [
              { index: true, element: <Booking /> },
              { path: 'add', element: <AddBooking /> },
              { path: 'walk-in', element: <AddBooking walkIn /> },
              { path: ':id', element: <ViewBooking /> },
            ]
          },
          {
            path: 'menu-item',
            children: [
              { index: true, element: <MenuItem /> },
              { path: 'add', element: <AddMenuItem /> },
              { path: ':id/edit', element: <EditMenuItem /> }
            ]
          },
          {
            path: 'add-on-service',
            children: [
              { index: true, element: <AddOnService /> },
              { path: 'add', element: <AddAddOnService /> },
              { path: ':id/edit', element: <EditAddOnService /> }
            ]
          },
          {
            path: 'maintenance',
            children: [
              { index: true, element: <Maintenance /> },
              { path: 'add', element: <AddMaintenance /> },
              { path: 'reports/:id', element: <ViewStaffReport /> },
              { path: ':id', element: <ViewMaintenance /> },
              { path: ':id/edit', element: <EditMaintenance /> }
            ]
          },
          {
            path: 'staff-management',
            children: [
              { index: true, element: <StaffManagement /> },
              { path: 'add', element: <AddStaff /> }
            ]
          },
          {
            path: 'user-management',
            children: [
              { index: true, element: <GuestManagement /> }
            ]
          },
          {
            path: 'feedback',
            children: [
              { index: true, element: <Feedback /> }
            ]
          },
          {
            path: 'payment-methods',
            children: [
              { index: true, element: <PaymentMethods /> },
              { path: 'add', element: <AddPaymentMethod /> },
              { path: ':id/edit', element: <EditPaymentMethod /> },
            ]
          },
          {
            path: 'knowledge',
            element: <Knowledge />,
          },
          {
            path: 'virtual-tour',
            element: <VirtualTourManagement />,
          },
          {
            path: 'settings',
            element: <AdminSettings />
          },
          {
            path: '*',
            element: (
              <NotFoundPage
                embedded
                homeTo="/admin"
                homeLabel="Back to Overview"
              />
            )
          }
        ]
      },
      {
        path: '/staff/maintenance',
        element: (
          <ProtectedRoute rolesAllowed={[USER_ROLES.MAINTENANCE_STAFF]}>
            <StaffLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <Navigate to="assigned" replace /> },
          { path: 'assigned', element: <MaintenanceAssignedTickets /> },
          { path: 'history', element: <MaintenanceHistory /> },
          { path: 'settings', element: <MaintenanceSettings /> },
          { path: 'assigned/:id', element: <MaintenanceTicketDetail /> },
          { path: 'history/:id', element: <MaintenanceTicketDetail /> },
        ],
      },
      {
        path: '/staff/kitchen',
        element: (
          <ProtectedRoute rolesAllowed={[USER_ROLES.KITCHEN_STAFF]}>
            <KitchenLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: 'dashboard', element: <KitchenDashboard /> },
          { path: 'order/:id', element: <KitchenOrderDetail /> },
          { path: 'settings', element: <KitchenSettings /> },
        ],
      },
      {
        path: '/staff/resort',
        element: (
          <ProtectedRoute rolesAllowed={[USER_ROLES.RESORT_STAFF]}>
            <ResortLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: 'dashboard', element: <ResortDashboard /> },
          { path: 'new-report', element: <ResortNewReport /> },
          { path: 'reports', element: <ResortReports /> },
          { path: 'settings', element: <ResortSettings /> },
          { path: 'booking/:id', element: <ResortBookingDetail /> },
          { path: 'booking/:id/report/:type', element: <ResortBookingReport /> },
          { path: 'report/:id', element: <ResortReportDetail /> },
        ],
      },
      {
        path: '*',
        element: <NotFoundPage />
      }
    ]
  }
])

function App() {
  const { isLoading } = useAuthContext();

  if(isLoading) {
    return null;
  }

  return (
    <RouterProvider router={router} />
  )
}

export default App
