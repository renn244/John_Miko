import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from 'react-router';
import { Toaster } from "./components/ui/sonner";
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
    element: <Login />
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
    children: [
      { index: true,  }, // DASHBOARD
      { 
        path: 'accommodation', 
        children: [
          { index: true, element: <AdminLayout><Accommodation /></AdminLayout> }, // ACCOMMODATION LIST
          { path: 'add', element: <AdminLayout><AddAccommodation /></AdminLayout> },
          { path: ':id/edit', element: <AdminLayout><EditAccommodation /></AdminLayout> }
        ]
      }, // ACCOMMODATION
    ]
  }
])

const queryClient = new QueryClient()

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster position="top-center" />
    </QueryClientProvider>
  )
}

export default App
