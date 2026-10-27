import { Outlet } from "react-router";
import { AuroraBackground } from "@/components/AuroraBackground";

export function AuthLayout() {
  return (
    <AuroraBackground>
      <Outlet />
    </AuroraBackground>
  );
}
