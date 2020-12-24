import { useEffect, useState } from "react";
import Link from "next/link";
import PropTypes from "prop-types";
import { useSession } from "next-auth/client";
import Auth from "../hooks/containers/useAuthentication";
import useSWR from "swr";

const fetcher = (query) =>
  fetch("/api/graphql", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ query }),
    credentials: "include",
  })
    .then((res) => res.json())
    .then((json) => json.data);
function Layout({ children }) {
  const UserData = Auth.useContainer();
  const { data: authorizedUser } = useSWR(
    `
    { 
      authorized{
        _id
        username
        role
        biography
        viewNSFW
      }
    }
  `,
    fetcher
  );

  useEffect(() => {
    authorizedUser
      ? UserData.setUser(authorizedUser.authorized)
      : UserData.setUser(null);
  }, [authorizedUser]);

  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="flex flex-col h-screen">
      <header className="bg-red-500 flex">
        <button
          onClick={(e) => {
            e.preventDefault();
            setMenuOpen(!menuOpen);
          }}
        >
          menu
        </button>
        <p className="p-2 font-bold text-lg text-center">Unnamed Serial Site</p>
      </header>
      <main className="container relative h-full flex-grow mx-auto overflow-y-scroll">
        {menuOpen && (
          <div className="flex flex-col bg-gray-400 absolute inset-0 z-10">
            <Link href="/">
              <a>Home</a>
            </Link>
            {UserData.user !== null && (
              <React.Fragment>
                <Link href="/dashboard">
                  <a>Dashboard</a>
                </Link>
                <Link
                  href={`/users/[username]`}
                  as={`/users/${UserData.user.username}`}
                >
                  <a>My Profile</a>
                </Link>
              </React.Fragment>
            )}
            <Link href="/browse">
              <a>Browse</a>
            </Link>
          </div>
        )}
        {children}
      </main>
      <footer className="bg-red-500 text-xs text-center">
        <p className="m-2">(C)2019 Paradox Inversion Press</p>
      </footer>
    </div>
  );
}

export default Layout;
