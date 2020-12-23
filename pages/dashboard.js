import Layout from "../components/layout";
import { getSession, useSession, signin } from "next-auth/client";
import { connectToDatabase } from "../utils/mongodb";
import { Serial } from "../models";
import useSWR from "swr";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import SerialBrief from "../components/SerialBrief";
import Auth from "../hooks/containers/useAuthentication";

const fetcher = (query) =>
  fetch("/api/graphql", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ query }),
  })
    .then((res) => res.json())
    .then((json) => json.data);
export default function Dashboard() {
  const UserData = Auth.useContainer();
  const [session, loading] = useSession();

  const { data: authorizedUser } = useSWR(
    `
    { 
      authorized{
        _id
        username
        role
        biography

      }
    }
  `,
    fetcher
  );
  const { data: userSerials } = useSWR(
    `
    { 
      ownSerials{
        title
        synopsis
        genre{
          name
        }
        author{
          username
        }
      }
    }
  `,
    fetcher
  );

  useEffect(() => {
    if (authorizedUser && authorizedUser.authorized) {
      console.log(authorizedUser);
      if (UserData.user) {
        if (authorizedUser.authorized._id === UserData.user._id) {
          console.log("same authorized user");
        } else {
          console.log("setting auth");
          UserData.setUser(authorizedUser.authorized);
        }
      } else {
        UserData.setUser(authorizedUser.authorized);
      }
    } else {
      console.log("unauthorized");
    }
  }, authorizedUser);
  const [showSubscriptions, setShowSubscriptions] = useState(true);
  const [showOwnSerials, setShowOwnSerials] = useState(true);
  if (typeof window !== "undefined" && loading) return null;

  if (!UserData.user) return <button onClick={signin}>Sign In</button>;

  if (!UserData.user) return <div>Loading User</div>;
  return (
    <Layout>
      <div className="m-4">
        <p className="text-center mb-4">
          Welcome to the dashboard, {UserData.user.username}
        </p>
        <Link
          href={`/users/[username]`}
          as={`/users/${UserData.user.username}`}
        >
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
            userSerials &&
            userSerials.ownSerials.map((serial) => (
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
