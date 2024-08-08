import PlayComp from "@/components/podcasts/PlayComp";
import { Metadata } from "next";
import { FC } from "react";
import { firestore } from "../../../../../../firebase/server";

interface pageProps {
  params: {
    id: string;
  };
}

export const generateMetadata = async (props: pageProps): Promise<Metadata> => {
  const { params } = props;
  const { id } = params;

  try {
    if (!firestore) {
      throw new Error("Firestore is not initialized.");
    }

    const podcastSnapshot = await firestore!
      .collection("podcasts")
      .doc(id)
      .get();

    if (!podcastSnapshot.exists) {
      console.error("No such document!");
      return {
        title: "Note Not Found",
      };
    }

    const podcast = podcastSnapshot.data();
    const title =
      `${podcast?.title} -  Podcasts` || "Untitled podcast - Podcasts"; // Use the title field from your document or a default value

    return {
      title,
    };
  } catch (error) {
    console.error("Error fetching document:", error);
    return {
      title: "Error",
    };
  }
};
const PlayPage: FC<pageProps> = async ({ params }) => {
  return (
    <div>
      <PlayComp id={String(params.id)} />
    </div>
  );
};

export default PlayPage;
