import { redirect } from "next/navigation";

import { clearAuthCookie } from "@/server/supabase/auth-server";

export default function LogoutPage() {
  clearAuthCookie();
  redirect("/login");
}
