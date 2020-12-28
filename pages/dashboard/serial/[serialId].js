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
    <Fragment>
      <header className="p-4">
        <div className="mb-4">
          <p>{serialData.serialById.title}</p>
        </div>
        <p>
          Synopsis
          <br />
          {serialData.serialById.synopsis}
        </p>
      </header>
      <Fragment>
        <Link
          href={`/dashboard/serial/[serialId]/parts/new`}
          as={`/dashboard/serial/${serialId}/parts/new`}
        >
          <a>New Part</a>
        </Link>
      </Fragment>
      <div id="serial-parts" className="m-4">
        {serialPartData.serialParts.map((serialPart) => {
          return (
            <div>
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
    </Fragment>
  );
}
