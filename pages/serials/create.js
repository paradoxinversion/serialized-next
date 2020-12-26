import Layout from "../../components/layout";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import useSWR from "swr";
import GenericSelect from "../../components/customFields/Select";
import Auth from "../../hooks/containers/useAuthentication";
import Link from "next/link";
import { Fragment } from "react";

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

export default function CreateSerial() {
  const UserData = Auth.useContainer();
  const { data, error } = useSWR(
    `
      { 
        genres{
          _id
          name
          description
        }
      }
    `,
    fetcher
  );

  if (!UserData.user)
    return (
      <Link href="/login">
        <a className="btn">Log In</a>
      </Link>
    );
  if (!data.genres) return <p>Loading</p>;
  return (
    <Fragment>
      <header>Create a new serial</header>
      <Formik
        initialValues={{ title: "", synopsis: "", genre: "", nsfw: false }}
        onSubmit={async (values, { setSubmitting }) => {
          const { title, synopsis, genre, nsfw } = values;
          const createSerialResponse = await axios.post("/api/graphql", {
            query: `
              createSerial(title: ${title}, synopsis: ${synopsis}, genre: ${genre}, nsfw: ${nsfw}){
                serial{
                  _id
                }
              }    
            `,
          });
        }}>
        {({ isSubmitting }) => (
          <Form className="">
            <label className="block">Title</label>
            <Field className="border rounded" type="text" name="title" />
            <ErrorMessage name="title" component="div" />
            <label className="block">Synopsis</label>
            <Field className="border rounded" type="text" name="synopsis" />
            <ErrorMessage name="synopsis" component="div" />
            <GenericSelect name="genre" label="Genre" options={data.genres} />
            <ErrorMessage name="genre" component="div" />
            <label className="block">NSFW</label>
            <Field className="border rounded" type="checkbox" name="nsfw" />
            <ErrorMessage name="nsfw" component="div" />

            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </Fragment>
  );
}
