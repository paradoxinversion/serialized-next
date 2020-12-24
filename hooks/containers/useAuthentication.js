import { createContainer } from "unstated-next";
import { useState } from "react";

function useAuthentication() {
  const [user, setUser] = useState(null);
  return {
    user,
    setUser: (user) => {
      setUser(user);
    },
  };
}

let Auth = createContainer(useAuthentication);

export default Auth;
