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
import Feedback from './page/Admin/Feedback/Feedback';
import AddMenuItem from './page/Admin/MenuItem/AddMenuItem';
import EditMenuItem from './page/Admin/MenuItem/EditMenuItem';
import MenuItem from './page/Admin/MenuItem/MenuItem';
import Amenities from './page/Amenities';
import Contact from './page/Contact';
import ForgotPassword from "./page/ForgotPassword";
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
    path: '/contact',
    element: <Contact />
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
    path: 'accommodation',
    children: [
      { index: true, element: <AccommodationList /> },
      { path: ':id', element: <AccommodationView /> }
    ]
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute rolesAllowed={[USER_ROLES.ADMIN]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true,  },
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
        path: 'feedback',
        children: [
          { index: true, element: <Feedback /> }
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
