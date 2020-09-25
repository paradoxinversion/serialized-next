import { signin, useSession } from "next-auth/client";
import Layout from "../../components/layout";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import useSWR from "swr";
import GenericSelect from "../../components/customFields/Select";

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function CreateSerial() {
  const { data, error } = useSWR("/api/genres", fetcher);

  const [session, loading] = useSession();

  if (typeof window !== "undefined" && loading) return null;

  if (!session) return <button onClick={signin}>Sign In</button>;
  if (!data.genres) return <p>Loading</p>;
  return (
    <Layout>
      <header>Create a new serial</header>
      <Formik
        initialValues={{ title: "", synopsis: "", genre: "", nsfw: false }}
        onSubmit={async (values, { setSubmitting }) => {
          const newSerialResponse = await axios.post("/api/serials", {
            serial: values,
          });

          debugger;
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
    </Layout>
  );
}
