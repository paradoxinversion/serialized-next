import { useRouter } from "next/router";
import useSWR from "swr";
import { Form, Formik, Field, ErrorMessage } from "formik";
import GenericSelect from "../../../../components/customFields/Select";
import axios from "axios";
import fetcher from "../../../../utils/fetcher";

export default function SerialEdit() {
  const router = useRouter();
  const { serialId } = router.query;

  const { data: serialData, error: serialDataError } = useSWR(
    `
    { 
      serialById(serialId: "${serialId}"){
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
  const { data: genreData, error: genreDataError } = useSWR(
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
    <div className="m-2 w-full">
      <h1>Edit Serial Information</h1>
      <Formik
        initialValues={{
          title: serialData.serialById.title,
          synopsis: serialData.serialById.synopsis,
          genre: serialData.serialById.genre._id,
          nsfw: serialData.serialById.nsfw,
          serialId: serialData.serialById._id,
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

          router.push("/dashboard");
        }}
      >
        {({ isSubmitting }) => (
          <Form className="form">
            <label className="block">Title</label>
            <Field className="field" type="text" name="title" />
            <ErrorMessage name="title" component="div" />
            <label className="block">Synopsis</label>
            <Field className="field" type="text" name="synopsis" />
            <ErrorMessage name="synopsis" component="div" />
            <GenericSelect
              name="genre"
              label="Genre"
              options={genreData.genres}
              className="field"
            />
            <ErrorMessage name="genre" component="div" />
            <label className="inline">NSFW</label>
            <div className="flex">
              <Field className="field inline" type="checkbox" name="nsfw" />
              <ErrorMessage name="nsfw" component="div" />
            </div>

            <button type="submit" className="btn" disabled={isSubmitting}>
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
