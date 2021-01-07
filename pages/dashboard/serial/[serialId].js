import { useRouter } from "next/router";
import { Fragment } from "react";
import useSWR from "swr";
import Link from "next/link";
import Auth from "../../../hooks/containers/useAuthentication";
import fetcher from "../../../utils/fetcher";

export default function AuthorSerialOverview() {
  const router = useRouter();
  const userData = Auth.useContainer();
  const { serialId } = router.query;
  console.log(router.query);
  const { data: serialData, error: serialDataError } = useSWR(
    `
    { 
      serialById(serialId: "${serialId}"){
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
      serialParts(parentSerial: "${serialData.serialById._id}"){\
        _id
        title
        synopsis
        partNumber
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
    <div className="m-4 w-full">
      <header className="mb-4">
        <div>
          <h1>{serialData.serialById.title}</h1>
        </div>
        <p>{serialData.serialById.synopsis}</p>
        <div className="flex justify-evenly border py-2 mt-4">
          <Link
            href={`/dashboard/serial/[serialId]/parts/new`}
            as={`/dashboard/serial/${serialId}/parts/new`}
          >
            <a>New Part</a>
          </Link>
          <Link
            href={`/dashboard/serial/[serialId]/edit`}
            as={`/dashboard/serial/${serialId}/edit`}
          >
            <a>Edit Serial</a>
          </Link>
        </div>
      </header>
      <div id="serial-parts">
        {serialPartData.serialParts.map((serialPart) => {
          return (
            <div className="border p-2">
              <p>{serialPart.title}</p>
              <p>{serialPart.synopis}</p>
              <Link
                className="btn"
                href={"/dashboard/serial/[serialId]/parts/[serialPartId]"}
                as={`/dashboard/serial/${serialId}/parts/${serialPart._id}`}
              >
                Go
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
