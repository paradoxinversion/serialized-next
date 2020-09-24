import Layout from "../components/layout";
import { getSession, useSession, signin } from "next-auth/client";
import { connectToDatabase } from "../utils/mongodb";
import { Serial } from "../models";
export default function Dashboard() {
  const [session, loading] = useSession();

  if (typeof window !== "undefined" && loading) return null;

  if (!session) return <button onClick={signin}>Sign In</button>;
  return (
    <Layout>
      <header>Dashboard</header>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  await connectToDatabase();
  const session = await getSession(context);

  return {
    props: { session },
  };
}
