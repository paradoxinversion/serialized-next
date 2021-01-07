import { useRouter } from "next/router";
import { Fragment } from "react";
import useSWR from "swr";
import { Form, Formik, Field, ErrorMessage } from "formik";
import axios from "axios";
import fetcher from "../../../../../../utils/fetcher";

export default function SerialPartEdit() {
  const router = useRouter();
  const { serialId, serialPartId } = router.query;
  const { data: serialPartData, error: serialDataError } = useSWR(
    `
    { 
      serialPartById(serialPartId: "${serialPartId}"){
        _id
        title
        synopsis
        content
        partNumber
        slug
        parentSerial{
          _id
        }
      }
    }
  `,
    fetcher
  );
  if (!serialPartData) return <div>Loading</div>;
  const { title, synopsis, content } = serialPartData.serialPartById;
  return (
    <div className="m-2 w-full">
      <h1>Edit Serial Part</h1>
      <Formik
        initialValues={{
          title,
          synopsis,
          content,
        }}
        onSubmit={async (values, { setSubmitting }) => {
          const { title, synopsis, content } = values;
          const editSerial = await axios.post("/api/graphql", {
            query: `mutation($serialPartId: String!, $title: String, $synopsis: String, $content: String){
              editSerialPart(serialPartId: $serialPartId, title: $title, synopsis: $synopsis, content: $content){
               _id
               title
              }    
            }
            `,
            variables: {
              serialPartId,
              content,
              title,
              synopsis,
            },
          });

          router.push(`/dashboard/serial/${serialId}/parts/${serialPartId}`);
        }}
      >
        {({ isSubmitting }) => (
          <Form className="form">
            <label className="block">Title</label>
            <Field className="border rounded" type="text" name="title" />
            <ErrorMessage name="title" component="div" />
            <label className="block">Synopsis</label>
            <Field className="border rounded" type="text" name="synopsis" />
            <ErrorMessage name="synopsis" component="div" />
            <label className="block">Content</label>
            <Field className="border rounded" as="textarea" name="content" />
            <ErrorMessage name="content" component="div" />

            <button type="submit" className="btn" disabled={isSubmitting}>
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
