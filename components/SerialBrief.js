import Link from "next/link";
import { useState } from "react";
function SerialBrief(props) {
  const { title, synopsis, slug, author } = props.item;
  const [showSynopsis, setShowSynopsis] = useState(props.showSynopsis);
  return (
    <div id="serial" className="mx-4 m-4 p-2  border rounded">
      <header className="mb-2">
        <p>{title}</p>
        {props.showAuthor && (
          <Link href={`/users/[username]`} as={`/users/${author.username}`}>
            <a>By {author.username}</a>
          </Link>
        )}
      </header>
      <div className="mb-2">
        <button
          className="block mb-2"
          onClick={() => setShowSynopsis(!showSynopsis)}
        >
          {`${showSynopsis ? "Hide" : "Show"}`} Synopsis
        </button>
        {showSynopsis && <p className="mb-2">{synopsis}</p>}
        <Link
          href={"/serials/[author]/[serialSlug]"}
          as={`/serials/${author.username}/${slug}`}
        >
          <a>Read</a>
        </Link>
      </div>
      {props.controls && (
        <div className="flex space-between space-x-4">
          <button className="btn ">Edit</button>
          <button className="btn">Delete</button>
          <button className="btn">Up</button>
          <button className="btn">Down</button>
        </div>
      )}
    </div>
  );
}

export default SerialBrief;
