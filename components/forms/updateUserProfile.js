import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import useSWR from "swr";
import Auth from "../../hooks/containers/useAuthentication";
import Link from "next/link";
import { useRouter } from "next/router";
import fetcher from "../../utils/fetcher";
import * as yup from "yup";

const updateProfileSchema = yup.object().shape({
  biography: yup.string().nullable(),
  viewNSFW: yup.boolean(),
});
export default function UpdateUserProfile() {
  const userData = Auth.useContainer();
  const router = useRouter();

  const { data: userProfileData, error } = useSWR(
    `
      { 
        user(username: "${userData.user.username}"){
          _id
          biography
          username
          viewNSFW
        }
      }
    `,
    fetcher
  );

  if (!userData.user)
    return (
      <Link href="/login">
        <a className="btn">Log In</a>
      </Link>
    );
  if (!userProfileData?.user) return <p>Loading</p>;
  return (
    <Formik
      validationSchema={updateProfileSchema}
      initialValues={{
        biography: userProfileData.user.biography,
        viewNSFW: userProfileData.user.viewNSFW,
      }}
      onSubmit={async (values, { setSubmitting }) => {
        const { biography, viewNSFW } = values;
        const createSerialResponse = await axios.post("/api/graphql", {
          query: `mutation($biography: String, $viewNSFW: Boolean){
            updateUserProfile(biography: $biography, viewNSFW: $viewNSFW){
                biography
                viewNSFW
              }    
            }
            `,
          variables: {
            biography,
            viewNSFW,
          },
        });
        console.log(createSerialResponse);
        router.push(`/dashboard`);
      }}
    >
      {({ isSubmitting }) => (
        <Form className="form">
          <header>
            <h2>User Bio &amp; Data</h2>
          </header>
          <label className="block">Biography</label>
          <Field
            className="border rounded my-2 w-full"
            type="text"
            name="biography"
            as="textarea"
          />
          <ErrorMessage className="error" name="biography" component="div" />

          <label className="inline-block">
            View NSFW{" "}
            <span>
              {" "}
              <Field type="checkbox" name="viewNSFW" />
            </span>
          </label>

          <ErrorMessage className="error" name="viewNSFW" component="div" />

          <div className="flex justify-evenly">
            <button type="submit" className="btn" disabled={isSubmitting}>
              Submit
            </button>

            <Link href="/dashboard">
              <a className="btn">Back</a>
            </Link>
          </div>
        </Form>
      )}
    </Formik>
  );
}
