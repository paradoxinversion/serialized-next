import { useRouter } from "next/router";
import { Fragment } from "react";
import useSWR from "swr";
import Link from "next/link";
import Auth from "../../../hooks/containers/useAuthentication";
import fetcher from "../../../utils/fetcher";

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
        slug
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
        slug
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
    <div className="m-2 w-full">
      <header>
        <div>
          <h1>{serialData.serial.title}</h1>
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
            href={`/dashboard/serial/[serialId]/edit`}
            as={`/dashboard/serial/${serialData.serial._id}/edit`}
          >
            <a>Edit Serial</a>
          </Link>
        )}
      </Fragment>
      <div id="serial-parts">
        {serialPartData.serialParts.map((serialPart) => {
          return (
            <div>
              <p>{serialPart.title}</p>
              <p>{serialPart.synopis}</p>
              <Link
                href={`/serials/[author]/[serialSlug]/[serialPartSlug]`}
                as={`/serials/${serialData.serial.author.username}/${serialData.serial.slug}/${serialPart.slug}`}
              >
                <a>Read</a>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
