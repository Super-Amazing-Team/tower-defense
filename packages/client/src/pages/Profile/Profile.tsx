import { Navigate } from "react-router-dom";
import { useUserStore } from "@/store/userStore";

export function Profile() {
  const user = useUserStore((store) => store.user);
  const logout = useUserStore((store) => store.logout);
  console.log("user", user);

  if (!user.isAuth) {
    return <Navigate to="/" replace />;
  }

  const logoutMe = (e: any): void => {
    e.preventDefault();

    logout();
    window.location.href = "/";
  };

  return (
    <div>
      <h1>I&apos;m Profile Component</h1>
      <button onClick={logoutMe}>Log out</button>
    </div>
  );
}
