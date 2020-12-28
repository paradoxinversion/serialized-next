import { useRouter } from "next/router";
import { Fragment } from "react";
import useSWR from "swr";
import Link from "next/link";
import Auth from "../../../../../hooks/containers/useAuthentication";
import fetcher from "../../../../../utils/fetcher";
import axios from "axios";
export default function AuthorSerialPartOverview() {
  const router = useRouter();
  const userData = Auth.useContainer();
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
  const { title, partNumber, synopsis } = serialPartData.serialPartById;
  return (
    <Fragment>
      <header className="p-4">
        <div className="mb-4">
          <p>{serialPartData.serialPartById.title}</p>
          <p>Part {serialPartData.serialPartById.partNumber}</p>
        </div>
        <p>
          Synopsis
          <br />
          {serialPartData.serialPartById.synopsis}
        </p>
        <Link
          href={`/dashboard/serial/[serialId]`}
          as={`/dashboard/serial/${serialId}`}
        >
          <a>Back to Serial</a>
        </Link>
        <Link
          href={`/dashboard/serial/[serialId]/parts/[serialPartId]/edit`}
          as={`/dashboard/serial/${serialId}/parts/${serialPartId}/edit`}
        >
          <a>Edit</a>
        </Link>
        <button
          onClick={async () => {
            if (
              window.confirm(`You are about to delete ${title}. Are you sure?`)
            ) {
              const result = await axios.post("/api/graphql", {
                query: `mutation($serialPartId: String!){
                  deleteSerialPart(serialPartId: $serialPartId){
                    resourceName
                    error
                  }
                }
                `,
                variables: {
                  serialPartId,
                },
              });
              console.log(result);

              router.push(`/dashboard/serial/${serialId}`);
            }
          }}
        >
          Delete
        </button>
      </header>
      <div>
        <p>{serialPartData.serialPartById.content}</p>
      </div>
    </Fragment>
  );
}
