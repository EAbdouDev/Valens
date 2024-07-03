"use client";

import { FC, useEffect, useState } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import Crunker from "crunker";

interface PageProps {
  params: {
    transId: string;
  };
}

interface FileData {
  fileURL: string;
  fileUUID: string;
  mimeType: string;
}

interface PodcastScript {
  host: string;
  text: string;
}

const Page: FC<PageProps> = ({ params }) => {
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [podcastScript, setPodcastScript] = useState<PodcastScript[]>([]);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const fetchFileData = async () => {
    try {
      const response = await fetch(`/api/transcriptions/${params.transId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch file data");
      }
      const result = await response.json();
      setFileData(result.data);
      if (result.data && result.data.fileURL) {
        await generateNote(params.transId);
      }
    } catch (err) {
      console.log(err);
      setError("Error fetching file data");
    } finally {
      setLoading(false);
    }
  };

  const generateNote = async (transId: string) => {
    try {
      const response = await fetch(
        `/api/transcriptions/${transId}/generate-note`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate note");
      }

      const result = await response.json();
      setPodcastScript(result.res || []);
    } catch (err) {
      console.error("Error generating note:", err);
      setError("Error generating note");
    }
  };

  const generateAudio = async () => {
    try {
      const response = await fetch(
        `/api/transcriptions/${params.transId}/generate-audio`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ podcastScript }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate audio");
      }

      const result = await response.json();
      combineAudio(result.audioUrls);
    } catch (err) {
      console.error("Error generating audio:", err);
      setError("Error generating audio");
    }
  };

  const combineAudio = async (audioUrls: string[]) => {
    const crunker = new Crunker();
    try {
      const buffers = await crunker.fetchAudio(...audioUrls);
      const merged = crunker.concatAudio(buffers);
      const output = crunker.export(merged, "audio/mp3");
      setAudioUrl(URL.createObjectURL(output.blob));
    } catch (error) {
      console.error("Error combining audio:", error);
      setError("Error combining audio");
    }
  };

  useEffect(() => {
    fetchFileData();
  }, [params.transId]);

  const getColor = (host: string) => {
    switch (host.toLowerCase()) {
      case "eslam":
        return "text-blue-500";
      case "aya":
        return "text-green-500";
      default:
        return "text-black";
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!fileData) {
    return <div>No file data found</div>;
  }

  return (
    <div className="min-h-full flex flex-col h-full">
      <header className="mb-16 space-y-2">
        <h1 className="text-2xl font-semibold">Transcriptions</h1>
      </header>

      {/* main container */}
      <div className="flex-1 flex flex-row overflow-y-hidden">
        <main className="flex-1 overflow-y-auto p-4">
          <div className="mb-4 text-xl font-bold">AI Generated Note:</div>
          <div className="space-y-4">
            {podcastScript.length > 0 &&
              podcastScript.map((entry, index) => (
                <div key={index} className={`p-2 ${getColor(entry.host)}`}>
                  <strong>{entry.host}:</strong> {entry.text}
                </div>
              ))}
          </div>
          <button
            className="mt-4 p-2 bg-blue-500 text-white rounded"
            onClick={generateAudio}
          >
            Generate
          </button>
        </main>
      </div>
      {/* end main container */}

      <footer className="mt-4">
        {audioUrl && (
          <div>
            <AudioPlayer src={audioUrl} />
            <a
              href={audioUrl}
              download="combined_audio.mp3"
              className="mt-2 p-2 bg-green-500 text-white rounded inline-block"
            >
              Download Combined Audio
            </a>
          </div>
        )}
      </footer>
    </div>
  );
};

export default Page;
