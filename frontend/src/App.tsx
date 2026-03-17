import { createBrowserRouter, RouterProvider } from 'react-router';
import ProtectedRoute from "./components/common/ProtectedRoute";
import { useAuthContext } from "./context/AuthContext";
import USER_ROLES from './lib/constant/USER_ROLES.constant';
import Accommodation from "./page/Admin/Accommodation/Accommodation";
import AddAccommodation from "./page/Admin/Accommodation/AddAccommodation";
import EditAccommodation from "./page/Admin/Accommodation/EditAccommodation";
import AdminLayout from "./page/Admin/AdminLayout";
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
    path: '/admin',
    element: (
      <ProtectedRoute rolesAllowed={[USER_ROLES.ADMIN]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true,  }, // DASHBOARD
      { 
        path: 'accommodation', 
        children: [
          { index: true, element: <Accommodation /> }, // ACCOMMODATION LIST
          { path: 'add', element: <AddAccommodation /> },
          { path: ':id/edit', element: <EditAccommodation /> }
        ]
      }, // ACCOMMODATION
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
