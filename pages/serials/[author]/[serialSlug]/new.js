import { useRouter } from "next/router";
import { Fragment } from "react";
import useSWR from "swr";
import Link from "next/link";
import { Form, Formik, Field, ErrorMessage } from "formik";
import GenericSelect from "../../../../components/customFields/Select";
import axios from "axios";
import Auth from "../../../../hooks/containers/useAuthentication";
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

export default function SerialPartCreate() {
  const router = useRouter();
  const userData = Auth.useContainer();
  const { author, serialSlug } = router.query;

  const { data: serialData } = useSWR(
    `
    { 
      serial(authorUsername: "${author}", serialSlug: "${serialSlug}"){
        _id
        slug
      }
    }
  `,
    fetcher
  );

  if (!serialData) return <div>Loading</div>;
  return (
    <Fragment>
      <Formik
        initialValues={{
          title: "",
          content: "",
          synopsis: "",
        }}
        onSubmit={async (values, { setSubmitting }) => {
          const { title, synopsis, content } = values;
          const createSerialPart = await axios.post("/api/graphql", {
            query: `mutation($title: String!, $content: String!, $synopsis: String, $parentSerial: String!, $author: String!){
              createSerialPart(title: $title, content: $content, synopsis: $synopsis, parentSerial: $parentSerial, author: $author){
               _id
               title
              }    
            }
            `,
            variables: {
              parentSerial: serialData.serial._id,
              title,
              synopsis,
              content,
              author: userData.user._id,
            },
          });

          router.push(
            `/serials/${userData.user.username}/${serialData.serial.slug}`
          );
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <label className="block">Title</label>
            <Field className="border rounded" type="text" name="title" />
            <ErrorMessage name="title" component="div" />
            <label className="block">Synopsis</label>
            <Field className="border rounded" type="text" name="synopsis" />
            <ErrorMessage name="synopsis" component="div" />
            <label className="block">Content</label>

            <Field className="border rounded" type="text" name="content" />
            <ErrorMessage name="content" component="div" />

            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </Fragment>
  );
}
