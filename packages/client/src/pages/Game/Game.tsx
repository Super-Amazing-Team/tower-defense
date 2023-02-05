import { Navigate } from "react-router-dom";
import { useUserStore } from "@/store/userStore";

export function Game() {
  const user = useUserStore((store) => store.user);
  console.log("user", user);

  if (!user.isAuth) {
    return <Navigate to="/" replace />;
  }

  return <h1>I&apos;m Game Component</h1>;
}
