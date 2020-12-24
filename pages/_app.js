import Layout from "../components/layout";
import Auth from "../hooks/containers/useAuthentication";
import "../styles/index.css";
const App = ({ Component, pageProps }) => {
  return (
    <Auth.Provider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Auth.Provider>
  );
};

export default App;
