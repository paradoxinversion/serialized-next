import { useRouter } from "next/router";
import useSWR from "swr";
const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function SerialOverview() {
  const router = useRouter();
  const { author, serialSlug } = router.query;

  const { data, error } = useSWR(`/api/serials/${author}/${serialSlug}`);

  return (
    <Layout>
      <header className="p-4">
        <div className="mb-4">
          <p>{serialPartsData.serial.title}</p>
          <Link
            href={`/users/[username]`}
            as={`/users/${serialPartsData.user.username}`}
          >
            <a>By {`${serialPartsData.user.username}`}</a>
          </Link>
        </div>
        <p>{serialPartsData.serial.synopsis}</p>
      </header>
      <div id="serial-parts" className="m-4">
        {serialPartsData.serialParts.map((serialPart) => {
          return (
            <SerialPartBrief
              item={serialPart}
              showSynopsis={false}
              author={serialPartsData.user}
            />
          );
        })}
      </div>
    </Layout>
  );
}
