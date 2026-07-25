import { createBrowserRouter, Outlet, RouterProvider } from 'react-router';
import { lazy } from 'react';
import ProtectedRoute from "./components/common/ProtectedRoute";
import { useAuthContext } from "./context/AuthContext";
import USER_ROLES from './lib/constant/USER_ROLES.constant';
import About from './page/About';
import AccommodationList from './page/AccommodationList';
import AccommodationView from './page/AccommodationView';
import AdminLayout from "./page/Admin/AdminLayout";
import Amenities from './page/Amenities';
import BookingFlow from './page/Booking';
import ForbiddenPage from './page/Forbidden';
import ForgotPassword from "./page/ForgotPassword";
import CreateFeedback from './page/Guest/CreateFeedback';
import EditFeedback from './page/Guest/EditFeedback';
import MyBookings from './page/Guest/MyBookings';
import Home from "./page/Home";
import Login from "./page/Login";
import Menu from './page/Menu';
import NotFoundPage from './page/NotFound';
import ResetPassword from "./page/ResetPassword";
import RouteErrorPage from './page/RouteError';
import Settings from './page/Settings';
import SignUpGuest from "./page/SignUpGuest";
import VirtualTour from './page/VirtualTour';

const RouterRoot = () => <Outlet />;
const Accommodation = lazy(() => import('./page/Admin/Accommodation/Accommodation'));
const AddAccommodation = lazy(() => import('./page/Admin/Accommodation/AddAccommodation'));
const EditAccommodation = lazy(() => import('./page/Admin/Accommodation/EditAccommodation'));
const AddAddOnService = lazy(() => import('./page/Admin/AddOnService/AddAddOnService'));
const AddOnService = lazy(() => import('./page/Admin/AddOnService/AddOnService'));
const EditAddOnService = lazy(() => import('./page/Admin/AddOnService/EditAddOnService'));
const AddBooking = lazy(() => import('./page/Admin/Booking/AddBooking'));
const Booking = lazy(() => import('./page/Admin/Booking/Booking'));
const ViewBooking = lazy(() => import('./page/Admin/Booking/ViewBooking'));
const Feedback = lazy(() => import('./page/Admin/Feedback/Feedback'));
const GuestManagement = lazy(() => import('./page/Admin/Guest-Management/GuestManagement'));
const AddMaintenance = lazy(() => import('./page/Admin/Maintenance/AddMaintenance'));
const EditMaintenance = lazy(() => import('./page/Admin/Maintenance/EditMaintenance'));
const Maintenance = lazy(() => import('./page/Admin/Maintenance/Maintenance'));
const ViewMaintenance = lazy(() => import('./page/Admin/Maintenance/ViewMaintenance'));
const ViewStaffReport = lazy(() => import('./page/Admin/Maintenance/ViewStaffReport'));
const AddMenuItem = lazy(() => import('./page/Admin/MenuItem/AddMenuItem'));
const EditMenuItem = lazy(() => import('./page/Admin/MenuItem/EditMenuItem'));
const MenuItem = lazy(() => import('./page/Admin/MenuItem/MenuItem'));
const Overview = lazy(() => import('./page/Admin/Overview'));
const AddPaymentMethod = lazy(() => import('./page/Admin/PaymentMethods/AddPaymentMethod'));
const EditPaymentMethod = lazy(() => import('./page/Admin/PaymentMethods/EditPaymentMethod'));
const PaymentMethods = lazy(() => import('./page/Admin/PaymentMethods/PaymentMethods'));
const Report = lazy(() => import('./page/Admin/Reports/Report'));
const AdminSettings = lazy(() => import('./page/Admin/Settings'));
const AddStaff = lazy(() => import('./page/Admin/Staff-Management/AddStaff'));
const StaffManagement = lazy(() => import('./page/Admin/Staff-Management/StaffManagement'));
const Knowledge = lazy(() => import('./page/Admin/Knowledge/Knowledge'));

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
          <ProtectedRoute rolesAllowed={[USER_ROLES.GUEST, USER_ROLES.ADMIN]}>
            <BookingFlow />
          </ProtectedRoute>
        )
      },
      {
        path: '/my-bookings',
        element: (
          <ProtectedRoute rolesAllowed={[USER_ROLES.GUEST, USER_ROLES.ADMIN]}>
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
