import { Formik, Field, Form } from "formik";
import useSWR from "swr";
import axios from "axios";
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

export default function LogIn() {
  const { data, error } = useSWR(
    `
    { 
      authorized{
        username
      }
    }
  `,
    fetcher
  );
  return (
    <div>
      <h1>Log In</h1>
      <Formik
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
                  username
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
          console.log(result);
        }}
      >
        <Form>
          <label htmlFor="username">Username</label>
          <Field id="username" name="username" />

          <label htmlFor="password">Password</label>
          <Field id="password" name="password" type="password" />
          <button type="submit">Submit</button>
        </Form>
      </Formik>
    </div>
  );
}
