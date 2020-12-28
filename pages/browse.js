import Layout from "../components/layout";
import SerialBrief from "../components/SerialBrief";
import useSWR from "swr";
import { Fragment } from "react";

const fetcher = (query) =>
  fetch("/api/graphql", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ query }),
  })
    .then((res) => res.json())
    .then((json) => json.data);

function Browse() {
  const { data, error } = useSWR(
    `{ 
      serials { 
        _id
        title 
        synopsis 
        genre {
          name
        }
        author {
          username
        }
        slug
      } 
    }`,
    fetcher
  );

  return (
    <Fragment>
      <p className="text-lg font-bold m-4">Browse</p>
      {data && (
        <div id="serials">
          {data.serials.map((browseItem) => (
            <SerialBrief item={browseItem} showAuthor={true} />
          ))}
        </div>
      )}
    </Fragment>
  );
}

export default Browse;
