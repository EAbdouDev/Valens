"use client";

import { useAuth } from "@/components/auth/auth-provider";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

export default function Upload() {
  const auth = useAuth();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", auth!.currentUser!.uid); // Add the user ID to the form data

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const result = await response.json();
      setSuccess(`${result.url}`);
      setIsLoading(true);

      // Redirect to the new transcription page
      router.push(`/t/transcriptions/new/${result.docId}`);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <main>
      <h1>Upload an Audio File</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <input
            type="file"
            name="file"
            accept="audio/*"
            onChange={handleFileChange}
          />
        </label>
        <button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Submit"}
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {/* {success && (
        <AudioPlayer
          autoPlay
          src={success}
          onPlay={(e) => console.log("onPlay")}
          // other props here
        />
      )} */}
      {isLoading && <p>Redirecting...</p>}
    </main>
  );
}
