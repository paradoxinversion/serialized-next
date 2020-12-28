import { useRouter } from "next/router";
import { Fragment } from "react";
import useSWR from "swr";
import Link from "next/link";
import Auth from "../../../hooks/containers/useAuthentication";

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

export default function SerialOverview() {
  const router = useRouter();
  const userData = Auth.useContainer();
  const { author, serialSlug } = router.query;

  const { data: serialData } = useSWR(
    `
    { 
      serial(authorUsername: "${author}", serialSlug: "${serialSlug}"){
        _id
        title
        synopsis
        genre{
          name
        }
        author{
          _id
          username
        }
      }
    }
  `,
    fetcher
  );

  const { data: serialPartData } = useSWR(
    () =>
      `
    { 
      serialParts(parentSerial: "${serialData.serial._id}"){
        title
        synopsis
        author{
          username
        }
      }
    }
  `,
    fetcher
  );
  if (!serialData || !serialPartData) return <div>Loading</div>;
  return (
    <Fragment>
      <header className="p-4">
        <div className="mb-4">
          <p>{serialData.serial.title}</p>
          <Link
            href={`/users/[username]`}
            as={`/users/${serialData.serial.author.username}`}
          >
            <a>By {`${serialData.serial.author.username}`}</a>
          </Link>
        </div>
        <p>{serialData.serial.synopsis}</p>
      </header>
      <Fragment>
        {userData.user?._id === serialData.serial.author._id && (
          <Link
            href={`/serials/[author]/[serialSlug]/new`}
            as={`/serials/${userData.user.username}/${serialSlug}/new`}
          >
            <a>New Part</a>
          </Link>
        )}
      </Fragment>
      <div id="serial-parts" className="m-4">
        {serialPartData.serialParts.map((serialPart) => {
          return (
            <div>
              <p>{serialPart.title}</p>
              <p>{serialPart.synopis}</p>
              <Link
                href={`/serials/[author]/[serialSlug]/[serialPartSlug]`}
                as={`/serials/${userData.user.username}/${serialSlug}/`}
              >
                <a>New Part</a>
              </Link>
            </div>
          );
        })}
      </div>
    </Fragment>
  );
}
