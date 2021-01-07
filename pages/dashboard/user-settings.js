import Auth from "../../hooks/containers/useAuthentication";
import Link from "next/link";
import { useRouter } from "next/router";
import UpdateUserProfile from "../../components/forms/updateUserProfile";

export default function CreateSerial() {
  const UserData = Auth.useContainer();
  const router = useRouter();

  if (!UserData.user)
    return (
      <Link href="/login">
        <a className="btn">Log In</a>
      </Link>
    );

  return (
    <div className="m-2 w-full">
      <header>
        <h1>User Settings</h1>
      </header>
      <UpdateUserProfile />
    </div>
  );
}
