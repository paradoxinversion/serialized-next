import Layout from "../components/layout";
import { getSession, useSession, signin } from "next-auth/client";
import { connectToDatabase } from "../utils/mongodb";
import { Serial } from "../models";
import useSWR from "swr";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import SerialBrief from "../components/SerialBrief";
const fetcher = (url) => axios.get(url).then((res) => res.data);
export default function Dashboard({ serials }) {
  const [session, loading] = useSession();
  const { data, error } = useSWR(`/api/serials?author=${session.user.id}`);
  const [showSubscriptions, setShowSubscriptions] = useState(true);
  const [showOwnSerials, setShowOwnSerials] = useState(true);
  if (typeof window !== "undefined" && loading) return null;

  if (!session) return <button onClick={signin}>Sign In</button>;
  return (
    <Layout>
      <div className="m-4">
        <p className="text-center mb-4">
          Welcome to the dashboard, {session.user.username}
        </p>
        <Link href={`/users/[username]`} as={`/users/${session.user.username}`}>
          <a>My Profile</a>
        </Link>
        <div id="your-serials">
          <p
            className="bg-gray-500 hover:bg-red-400"
            onClick={() => setShowOwnSerials(!showOwnSerials)}
          >
            Your Serials &nbsp;&nbsp; {showOwnSerials ? "-" : "+"}
          </p>
          {showOwnSerials &&
            data.serials &&
            data.serials.map((serial) => (
              <SerialBrief item={serial} controls={true} />
            ))}
        </div>
        <div id="subsribed-serial-parts">
          <p
            className="bg-gray-500 hover:bg-red-400"
            onClick={() => setShowSubscriptions(!showSubscriptions)}
          >
            Your subscriptions &nbsp;&nbsp; {showSubscriptions ? "-" : "+"}
          </p>
          {/* {showSubscriptions && <SerialPartBrief />} */}
        </div>
      </div>
    </Layout>
  );
}
export async function getServerSideProps(context) {
  const session = await getSession(context);
  return {
    props: { session },
  };
}
