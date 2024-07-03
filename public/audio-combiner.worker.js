import Crunker from "crunker";

self.onmessage = async (event) => {
  const audioUrls = event.data;
  const crunker = new Crunker();

  try {
    const buffers = await crunker.fetchAudio(...audioUrls);
    const combined = crunker.concatAudio(buffers);
    const output = crunker.export(combined, "audio/mp3");
    self.postMessage({
      audioUrl: URL.createObjectURL(output.blob),
      blob: output.blob,
    });
  } catch (error) {
    console.error("Error combining audio:", error);
    self.postMessage(null);
  }
};
