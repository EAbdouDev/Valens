"use client";
import { FC, FormEvent, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as use from "@tensorflow-models/universal-sentence-encoder";

interface TestEmbProps {}

const TestEmb: FC<TestEmbProps> = ({}) => {
  const [embedding, setEmbedding] = useState<any>();
  const [text, setText] = useState<string>("");

  useEffect(() => {
    const loadBackend = async () => {
      await tf.setBackend("webgl");
      await tf.ready();
    };
    loadBackend();
  }, []);

  const generate = async (e: FormEvent) => {
    e.preventDefault();
    const model = await use.load();
    const embeddings = await model.embed([text]);

    const embeddingArray = embeddings.arraySync()[0];
    setEmbedding(embeddingArray);
  };

  return (
    <div className="w-full">
      <form onSubmit={generate}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text"
          rows={20}
          className="border"
        />
        <button type="submit">Generate Embedding</button>
      </form>
      {embedding && <pre>{JSON.stringify(embedding, null, 2)}</pre>}
    </div>
  );
};

export default TestEmb;
