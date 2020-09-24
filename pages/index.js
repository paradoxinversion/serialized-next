import { signin, signout, useSession } from "next-auth/client";
import Layout from "../components/layout";
export default function HomePage() {
  const [session, loading] = useSession();
  return (
    <div>
      <Layout>
        <header>Serialized</header>
        {session && <p>Signed In</p>}
        {session && <button onClick={signout}>Sign Out</button>}
        {!session && (
          <p>
            <button onClick={signin}>Sign In</button>
          </p>
        )}
      </Layout>
    </div>
  );
}
