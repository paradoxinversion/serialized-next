import SerialBrief from "../components/SerialBrief";
import useSWR from "swr";
import { Fragment } from "react";
import fetcher from "../utils/fetcher";

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
    <div id="browse-directory" className="w-full">
      <p className="text-lg font-bold m-4">Browse</p>
      {data && (
        <div id="serials">
          {data.serials.map((browseItem) => (
            <SerialBrief item={browseItem} showAuthor={true} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Browse;
