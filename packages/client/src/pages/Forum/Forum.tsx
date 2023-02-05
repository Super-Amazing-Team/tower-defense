import { Link, Navigate } from "react-router-dom";
import { useUserStore } from "@/store/userStore";

export function Forum() {
  const user = useUserStore((store) => store.user);
  console.log("user", user);

  if (!user.isAuth) {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      <h1>I&apos;m Forum Componen</h1>
      <div className="forum-links">
        <Link to={"/forum/1"}>Message 1</Link>
        <Link to={"/forum/2"}>Message 2</Link>
        <Link to={"/forum/3"}>Message 3</Link>
      </div>
    </div>
  );
}
