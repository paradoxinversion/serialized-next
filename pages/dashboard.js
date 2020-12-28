import useSWR from "swr";
import { useEffect, useState } from "react";
import Auth from "../hooks/containers/useAuthentication";
import Link from "next/link";
import axios from "axios";
import fetcher from "../utils/fetcher";

export default function Dashboard() {
  const UserData = Auth.useContainer();

  const { data: userSerials, mutate } = useSWR(
    `
    { 
      ownSerials{
        _id
        slug
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
    console.log("serials", userSerials);
  }, [userSerials]);
  const [showSubscriptions, setShowSubscriptions] = useState(true);
  const [showOwnSerials, setShowOwnSerials] = useState(true);

  if (!UserData.user)
    return (
      <Link href="/login">
        <a className="btn">Log In</a>
      </Link>
    );
  return (
    <div id="dashboard" className="m-4">
      <p className="text-center mb-4">
        Welcome to the dashboard, {UserData.user.username}
      </p>
      <Link href={`/users/[username]`} as={`/users/${UserData.user.username}`}>
        <a>My Profile</a>
      </Link>
      <Link href={`/serials/create`}>
        <a>New Serial</a>
      </Link>
      <div id="your-serials">
        <p
          className="bg-gray-500 hover:bg-red-400"
          onClick={() => setShowOwnSerials(!showOwnSerials)}
        >
          Your Serials &nbsp;&nbsp; {showOwnSerials ? "-" : "+"}
        </p>
        {showOwnSerials &&
          userSerials?.ownSerials &&
          userSerials.ownSerials.map((serial) => {
            const { title, slug } = serial;
            return (
              // <SerialBrief item={serial} controls={true} />
              <div id="serial" className="mx-4 m-4 p-2  border rounded">
                <header className="mb-2">
                  <p>{title}</p>
                </header>
                <div className="flex space-between space-x-4">
                  <Link
                    className="btn"
                    href={"/serials/[author]/[serialSlug]"}
                    as={`/serials/${UserData.user.username}/${slug}`}
                  >
                    Edit
                  </Link>
                  <button
                    className="btn"
                    onClick={async () => {
                      if (
                        window.confirm(
                          `You are about to delete ${serial.title}. Are you sure?`
                        )
                      ) {
                        const result = await axios.post("/api/graphql", {
                          query: `mutation($serialId: String!){
                            deleteSerial(serialId: $serialId){
                              deletedSerial {
                                title
                              }
                              error
                            }
                          }
                          `,
                          variables: {
                            serialId: serial._id,
                          },
                        });
                        console.log(result);

                        mutate("/api/graphql");
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
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
  );
}
