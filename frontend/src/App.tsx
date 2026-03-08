import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from 'react-router';
import ForgotPassword from "./page/ForgotPassword";
import Home from "./page/Home";
import Login from "./page/Login";
import ResetPassword from "./page/ResetPassword";
import { Toaster } from "./components/ui/sonner";
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
