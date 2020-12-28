import { useRouter } from "next/router";
import { Fragment } from "react";
import useSWR from "swr";
import { Form, Formik, Field, ErrorMessage } from "formik";
import GenericSelect from "../../../../components/customFields/Select";
import axios from "axios";
import fetcher from "../../../../utils/fetcher";

export default function SerialEdit() {
  const router = useRouter();
  const { author, serialSlug } = router.query;

  const { data: serialData } = useSWR(
    `
    { 
      serial(authorUsername: "${author}", serialSlug: "${serialSlug}"){
        _id
        nsfw
        title
        synopsis
        genre{
          _id
          name
        }
        author{
          username
        }
      }
    }
  `,
    fetcher
  );
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
  if (!serialData || !genreData) return <div>Loading</div>;
  return (
    <Fragment>
      <Formik
        initialValues={{
          title: serialData.serial.title,
          synopsis: serialData.serial.synopsis,
          genre: serialData.serial.genre._id,
          nsfw: serialData.serial.nsfw,
          serialId: serialData.serial._id,
        }}
        onSubmit={async (values, { setSubmitting }) => {
          const { title, synopsis, genre, nsfw, serialId } = values;
          const editSerial = await axios.post("/api/graphql", {
            query: `mutation($serialId: String!, $title: String!, $synopsis: String, $genre: String!, $nsfw: Boolean!){
              editSerial(serialId: $serialId, title: $title, synopsis: $synopsis, genre: $genre, nsfw: $nsfw){
               _id
               title
              }    
            }
            `,
            variables: {
              serialId,
              title,
              synopsis,
              genre,
              nsfw,
            },
          });
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
          </Form>
        )}
      </Formik>
    </Fragment>
  );
}
