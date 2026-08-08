import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getAdminToken } from "@/lib/auth-token";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const token = getAdminToken();
    if (!token) throw redirect({ to: "/auth" });
    return { token };
  },
  component: () => <Outlet />,
});
