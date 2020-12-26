import useSWR from "swr";
import { useRouter } from "next/router";
const fetcher = (query) =>
  fetch("/api/graphql", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ query }),
    credentials: "include",
  })
    .then((res) => res.json())
    .then((json) => json.data);

export default function UserProfile() {
  const router = useRouter();
  const { username } = router.query;
  const { data: profileUserData } = useSWR(
    `
    { 
      user(username: "${username}"){
        username
        biography
        role
      }
    }
  `,
    fetcher
  );

  if (!profileUserData) return <div>Loading</div>;
  return (
    <div id="user-profile">
      <h1>{profileUserData.user.username}</h1>
      <p>
        {profileUserData.user.biography ||
          "This user hasn't written a bio, yet."}
      </p>
    </div>
  );
}
