import { connectToDatabase } from "../utils/mongodb";
import { Serial } from "../models";
import { useState } from "react";
import Layout from "../components/layout";
import SerialBrief from "../components/SerialBrief";
function Browse({ serials }) {
  const [fetchedSerials, setSerials] = useState(serials);

  return (
    <Layout>
      <p className="text-lg font-bold m-4">Browse</p>
      <div id="serials">
        {serials.map((browseItem) => (
          <SerialBrief item={browseItem} showAuthor={true} />
        ))}
      </div>
    </Layout>
  );
}
export async function getServerSideProps(context) {
  await connectToDatabase();
  const serials = await Serial.find({}).populate("author").lean();
  return {
    props: { serials }, // will be passed to the page component as props
  };
}

export default Browse;
