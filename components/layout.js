import { useState } from "react";
import Link from "next/link";
import PropTypes from "prop-types";
import { useSession } from "next-auth/client";

function Layout({ children, userData }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [session, loading] = useSession();
  return (
    <div className="flex flex-col h-screen max-h-screen box-border">
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
            {session && (
              <React.Fragment>
                <Link href="/dashboard">
                  <a>Dashboard</a>
                </Link>
                <Link
                  href={`/users/[username]`}
                  as={`/users/${session.user.username}`}
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

Layout.propTypes = {
  userData: PropTypes.shape({
    role: PropTypes.string,
    id: PropTypes.string,
    username: PropTypes.string,
  }),
};

export default Layout;
