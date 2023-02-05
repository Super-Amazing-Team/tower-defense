import { useUserStore } from "@/store";

export function Profile() {
  const logout = useUserStore((store) => store.logout);

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
