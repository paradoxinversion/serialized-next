import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import useSWR from "swr";
import GenericSelect from "../../components/customFields/Select";
import Auth from "../../hooks/containers/useAuthentication";
import Link from "next/link";
import { Fragment } from "react";
import { useRouter } from "next/router";
import fetcher from "../../utils/fetcher";

export default function CreateSerial() {
  const UserData = Auth.useContainer();
  const router = useRouter();

  const { data: genreData, error } = useSWR(
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
  if (!genreData?.genres) return <p>Loading</p>;
  return (
    <Fragment>
      <header>Create a new serial</header>
      <Formik
        initialValues={{ title: "", synopsis: "", genre: "", nsfw: false }}
        onSubmit={async (values, { setSubmitting }) => {
          const { title, synopsis, genre, nsfw } = values;
          const createSerialResponse = await axios.post("/api/graphql", {
            query: `mutation($title: String!, $synopsis: String, $genre: String!, $nsfw: Boolean!){
              createSerial(title: $title, synopsis: $synopsis, genre: $genre, nsfw: $nsfw){
               slug
              }    
            }
            `,
            variables: {
              title,
              synopsis,
              genre,
              nsfw,
            },
          });
          console.log(createSerialResponse);
          router.push(`/dashboard`);
        }}
      >
        {({ isSubmitting }) => (
          <Form className="">
            <label className="block">Title</label>
            <Field className="border rounded" type="text" name="title" />
            <ErrorMessage name="title" component="div" />
            <label className="block">Synopsis</label>
            <Field className="border rounded" type="text" name="synopsis" />
            <ErrorMessage name="synopsis" component="div" />
            <GenericSelect
              name="genre"
              label="Genre"
              options={genreData.genres}
            />
            <ErrorMessage name="genre" component="div" />
            <label className="block">NSFW</label>
            <Field className="border rounded" type="checkbox" name="nsfw" />
            <ErrorMessage name="nsfw" component="div" />

            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>

            <Link href="/dashboard">
              <a className="btn">Back</a>
            </Link>
          </Form>
        )}
      </Formik>
    </Fragment>
  );
}
