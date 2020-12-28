import { useRouter } from "next/router";
import { Fragment } from "react";
import { Form, Formik, Field, ErrorMessage } from "formik";
import axios from "axios";
import Auth from "../../../../../hooks/containers/useAuthentication";
import Link from "next/link";

export default function SerialPartCreate() {
  const router = useRouter();
  const userData = Auth.useContainer();
  const { serialId } = router.query;

  if (!userData.user)
    return (
      <Link href="/login">
        <a className="btn">Log In</a>
      </Link>
    );
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
              parentSerial: serialId,
              title,
              synopsis,
              content,
              author: userData.user._id,
            },
          });

          router.push(`/dashboard/serial/${serialId}`);
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
