import React from "react";
import { useAuthStore } from "../store/useAuthStore";

function ChatPage() {
  const { authUser, login, isLoggedIn } = useAuthStore();
  return <div>ChatPage</div>;
}

export default ChatPage;
