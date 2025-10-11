import React from "react";
import { useAuthStore } from "../store/useAuthStore";

function LoginPage() {
  const { authUser, login, isLoggedIn } = useAuthStore();
  return <div>LoginPage</div>;
}

export default LoginPage;
