import { Outlet } from "react-router";
import type { RoleRouteProps } from "@/types/navigation";
// import { Navigate } from "react-router";
// import { useAuth } from "@/context/AuthContext";

export default function RoleRoute(_: RoleRouteProps) {
  // const { user, isAuthenticated, isLoading } = useAuth();

  // if (isLoading) {
  //     return <div>Loading...</div>;
  // }

  // if (!isAuthenticated) {
  //     return <Navigate to="/login" replace />;
  // }

  // if (!user || !_.allowedRoles.includes(user.role)) {
  //     return <Navigate to="/login" replace />; // or a "No Access" page
  // }

  return <Outlet />;
}
