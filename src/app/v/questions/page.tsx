"use client";

import { FC, FormEvent, useRef } from "react";
import { ref, uploadBytes } from "firebase/storage";
import { storage } from "../../../../firebase/client";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  const inputRef = useRef(null);
  const upload = async (e: FormEvent) => {
    e.preventDefault();
    //@ts-ignore
    const file = inputRef.current?.files[0];

    try {
      if (storage) {
        const fileRef = ref(storage, `test/${file.name}`);
        const snapshot = await uploadBytes(fileRef, file);
        console.log("done");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-full bg-[url(/images/5434380.jpg)] bg-center bg-no-repeat bg-cover ">
      <form onSubmit={upload}>
        <input ref={inputRef} type="file" />
        <button
          type="submit"
          className="px-4 py-2 rounded text-white transition-opacity duration-200"
          // style={noisyGradientStyle}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default page;
