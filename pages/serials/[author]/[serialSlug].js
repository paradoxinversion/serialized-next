import { useRouter } from "next/router";
import { Fragment } from "react";
import useSWR from "swr";
import Link from "next/link";

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
  const { author, serialSlug } = router.query;

  const { data: serialData } = useSWR(
    `
    { 
      serial(authorUsername: "${author}", serialSlug: "${serialSlug}"){
        title
        synopsis
        genre{
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
  if (!serialData) return <div>Loading</div>;
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
      {/* <div id="serial-parts" className="m-4">
        {serialPartsData.serialParts.map((serialPart) => {
          return (
            <SerialPartBrief
              item={serialPart}
              showSynopsis={false}
              author={serialPartsData.user}
            />
          );
        })}
      </div> */}
    </Fragment>
  );
}
