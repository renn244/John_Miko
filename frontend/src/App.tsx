import { createBrowserRouter, RouterProvider } from 'react-router';
import ProtectedRoute from "./components/common/ProtectedRoute";
import { useAuthContext } from "./context/AuthContext";
import USER_ROLES from './lib/constant/USER_ROLES.constant';
import About from './page/About';
import AccommodationList from './page/AccommodationList';
import AccommodationView from './page/AccommodationView';
import Accommodation from "./page/Admin/Accommodation/Accommodation";
import AddAccommodation from "./page/Admin/Accommodation/AddAccommodation";
import EditAccommodation from "./page/Admin/Accommodation/EditAccommodation";
import AdminLayout from "./page/Admin/AdminLayout";
import AddBooking from './page/Admin/Booking/AddBooking';
import Booking from './page/Admin/Booking/Booking';
import AddChatbotRule from './page/Admin/ChatbotRule/AddChatbotRule';
import ChatbotRule from './page/Admin/ChatbotRule/ChatbotRule';
import EditChatbotRule from './page/Admin/ChatbotRule/EditChatbotRule';
import Feedback from './page/Admin/Feedback/Feedback';
import AddMaintenance from './page/Admin/Maintenance/AddMaintenance';
import EditMaintenance from './page/Admin/Maintenance/EditMaintenance';
import Maintenance from './page/Admin/Maintenance/Maintenance';
import AddMenuItem from './page/Admin/MenuItem/AddMenuItem';
import EditMenuItem from './page/Admin/MenuItem/EditMenuItem';
import MenuItem from './page/Admin/MenuItem/MenuItem';
import Overview from './page/Admin/Overview';
import Report from './page/Admin/Reports/Report';
import AddStaff from './page/Admin/Staff-Management/AddStaff';
import StaffManagement from './page/Admin/Staff-Management/StaffManagement';
import Amenities from './page/Amenities';
import ForgotPassword from "./page/ForgotPassword";
import CreateFeedback from './page/Guest/CreateFeedback';
import EditFeedback from './page/Guest/EditFeedback';
import MyBookings from './page/Guest/MyBookings';
import Home from "./page/Home";
import Login from "./page/Login";
import ResetPassword from "./page/ResetPassword";
import SignUpGuest from "./page/SignUpGuest";

const router = createBrowserRouter([
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
    path: '/accommodation',
    children: [
      { index: true, element: <AccommodationList /> },
      { path: ':id', element: <AccommodationView /> }
    ]
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
    path: '/feedback/:bookingId',
    element: (
      <CreateFeedback />
    )
  },
  {
    path: '/feedback/edit/:feedbackId',
    element: (
      <EditFeedback />
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
        path: 'maintenance',
        children: [
          { index: true, element: <Maintenance /> },
          { path: 'add', element: <AddMaintenance /> },
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
        path: 'feedback',
        children: [
          { index: true, element: <Feedback /> }
        ]
      },
      {
        path: 'chatbot-rule',
        children: [
          { index: true, element: <ChatbotRule /> },
          { path: 'add', element: <AddChatbotRule /> },
          { path: ':id/edit', element: <EditChatbotRule /> }
        ]
      }
    ]
  }
])

function App() {
  const { isLoading } = useAuthContext();

  if(isLoading) return null;

  return (
    <RouterProvider router={router} />
  )
}

export default App
