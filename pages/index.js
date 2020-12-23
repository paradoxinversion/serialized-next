import { signin, signout, useSession } from "next-auth/client";
import Link from "next/link";
import Layout from "../components/layout";
import useSWR from "swr";
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

export default function HomePage() {
  const { data, error } = useSWR(
    "{ users { username role biography } }",
    fetcher
  );
  return (
    <Layout>
      <img className="object-cover" src="https://picsum.photos/800/300" />
      <div className="m-4 text-center">
        <p className="text-lg font-bold">Lorem Ipsum</p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. In id aliquet
          diam, ac dapibus lacus. In hac habitasse platea dictumst. Mauris
          facilisis lacus quis tortor semper, vitae condimentum sapien pulvinar.
          Cras lectus metus, blandit eget lacus ac, porttitor finibus arcu. Sed
          augue neque, consectetur vitae elementum eget, vehicula sit amet arcu.
          Nam aliquam a odio ut sollicitudin.
        </p>
        <div className="mt-4 text-lg flex flex-col mx-auto justify-between w-1/2">
          <Link href="/browse">
            <a className="btn mb-4">Read</a>
          </Link>
          <Link href="/authorize">
            <a className="btn">Write</a>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
