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

  if (!serialPartData?.serialPartById) return <div>Loading</div>;
  const { title, partNumber, synopsis } = serialPartData.serialPartById;
  return (
    <div className="m-2 w-full">
      <header className="mb-4">
        <h1>{serialPartData.serialPartById.title}</h1>
        <p>Part {serialPartData.serialPartById.partNumber}</p>
        <p>{serialPartData.serialPartById.synopsis}</p>
        <div className="flex justify-evenly border py-2 mt-4">
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
                window.confirm(
                  `You are about to delete ${title}. Are you sure?`
                )
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
        </div>
      </header>
      <div>
        <p>{serialPartData.serialPartById.content}</p>
      </div>
    </div>
  );
}
