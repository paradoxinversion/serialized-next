import { Formik, Field, Form, ErrorMessage } from "formik";
import { useRouter } from "next/router";
import axios from "axios";
import Auth from "../hooks/containers/useAuthentication";
import * as yup from "yup";

const loginSchema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required(),
});
export default function LogIn() {
  const router = useRouter();
  const UserData = Auth.useContainer();
  return (
    <div className="m-2 w-full">
      <h1>Log In</h1>
      <Formik
        validationSchema={loginSchema}
        initialValues={{
          username: "",
          password: "",
        }}
        onSubmit={async (values) => {
          // do thing
          const result = await axios.post("/api/graphql", {
            query: `mutation($username: String!, $password: String!){
              login(username: $username, password: $password){
                user {
                  _id
                  username
                  role
                  biography
                  viewNSFW
                }
                error
              }    
            }
            `,
            variables: {
              username: values.username,
              password: values.password,
            },
          });
          const { error, user } = result.data.data.login;
          if (error) {
            console.log(error);
            return;
          }
          if (user === null) {
            console.log("No user returned from Login!");
          }

          UserData.setUser(user);
          router.push("/dashboard");
        }}
      >
        <Form className="form">
          <label htmlFor="username">Username</label>
          <Field id="username" name="username" className="field" />
          <ErrorMessage name="username" component="div" className="error" />
          <label htmlFor="password">Password</label>
          <Field
            id="password"
            name="password"
            type="password"
            className="field"
          />
          <ErrorMessage name="username" component="div" className="error" />

          <button type="submit" className="btn">
            Submit
          </button>
        </Form>
      </Formik>
    </div>
  );
}
