import { useUserStore } from "@/store";
import { useNavigate } from "react-router-dom";

export function Profile() {
  const logout = useUserStore((store) => store.logout);
  const navigate = useNavigate();

  const logoutMe = (e: { preventDefault: () => void }) => {
    logout();
    navigate("/");
  };

  return (
    <div>
      <h1>I&apos;m Profile Component</h1>
      <button onClick={logoutMe}>Log out</button>
    </div>
  );
}
