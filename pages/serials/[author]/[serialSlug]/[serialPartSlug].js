import { useRouter } from "next/router";
import { Fragment } from "react";
import useSWR from "swr";
import Link from "next/link";
import Auth from "../../../../hooks/containers/useAuthentication";
import fetcher from "../../../../utils/fetcher";

export default function ViewSerialPart() {
  const router = useRouter();
  const userData = Auth.useContainer();
  const { author, serialSlug, serialPartSlug } = router.query;

  const { data: serialPartData } = useSWR(
    `
    { 
      serialPartSearch(authorUsername: "${author}", parentSerialSlug: "${serialSlug}", serialPartSlug: "${serialPartSlug}"){
        _id
        title
        synopsis
        content
        author{
          _id
          username
        }
      }
    }
  `,
    fetcher
  );
  if (!serialPartData) return <div>Loading</div>;
  return (
    <div className="m-2 w-full">
      <header>
        <h1>{serialPartData.serialPartSearch.title}</h1>
        <Link
          href={`/serials/[author]/[serialSlug]`}
          as={`/serials/${author}/${serialSlug}`}
        >
          <a>Back to Serial</a>
        </Link>
      </header>
      <div>
        <p>{serialPartData.serialPartSearch.content}</p>
      </div>
    </div>
  );
}
