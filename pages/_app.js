import { Provider } from "next-auth/client";
import Auth from "../hooks/containers/useAuthentication";
import "../styles/index.css";
const App = ({ Component, pageProps }) => {
  const { session } = pageProps;
  return (
    <Auth.Provider>
      <Component {...pageProps} />
    </Auth.Provider>
  );
};

export default App;
