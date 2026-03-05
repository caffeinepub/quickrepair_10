import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  useLocation,
  useNavigate,
} from "@tanstack/react-router";
import Footer from "./components/Footer";
import Header from "./components/Header";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import BookingPage from "./pages/BookingPage";
import HomePage from "./pages/HomePage";
import MechanicRegisterPage from "./pages/MechanicRegisterPage";
import ThankYouPage from "./pages/ThankYouPage";

// Root layout — conditionally renders Header/Footer based on route
function RootLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  if (isAdminRoute) {
    return (
      <>
        <Outlet />
        <Toaster />
      </>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
      <Toaster />
    </div>
  );
}

const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const bookRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/book",
  validateSearch: (search: Record<string, unknown>) => ({
    service: (search.service as string) || "",
  }),
  component: BookingPage,
});

const mechanicRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/mechanic-register",
  component: MechanicRegisterPage,
});

const thankyouRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/thankyou",
  component: ThankYouPage,
});

const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminLoginPage,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/dashboard",
  component: AdminDashboardPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  bookRoute,
  mechanicRoute,
  thankyouRoute,
  adminLoginRoute,
  adminDashboardRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}

export { useNavigate, useLocation };
