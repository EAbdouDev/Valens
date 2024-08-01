"use client";
import {
  Excalidraw,
  MainMenu,
  WelcomeScreen,
  exportToBlob,
} from "@excalidraw/excalidraw";
// import "@excalidraw/excalidraw/index.css";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { FC } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "../auth/auth-provider";

interface ExcalidrawWrapperProps {}

const ExcalidrawWrapper: FC<ExcalidrawWrapperProps> = ({}) => {
  const [elements, setElements] = useState<any>([]);
  const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const auth = useAuth();
  const boardTheme = "light";
  const router = useRouter();
  const [boardData, setBoardData] = useState<any>([]);

  useEffect(() => {
    setIsMounted(true);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "s") {
        event.preventDefault();
        // saveExcalidrawData(elements);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  //   const saveExcalidrawData = async (data: any) => {
  //     const allElementsDeleted = data.every((element: any) => element.isDeleted);
  //     try {
  //       // Retrieve current image URL from the database
  //       const { data: existingData, error: fetchError } = await supabase.current
  //         .from("flowdraw")
  //         .select("image_url")
  //         .eq("id", id)
  //         .single();

  //       if (fetchError) throw fetchError;

  //       if (existingData && existingData.image_url) {
  //         // Delete the old screenshot
  //         const oldFilename = existingData.image_url.split("/").pop();
  //         const { error: deleteError } = await supabase.current.storage
  //           .from("screenshots")
  //           .remove([oldFilename]);

  //         if (deleteError) {
  //           console.error("Error deleting old screenshot:", deleteError);
  //           toast.error("Error deleting old screenshot");
  //           return;
  //         }
  //       }

  //       // Save the new Excalidraw data
  //       const { error: updateError } = await supabase.current
  //         .from("flowdraw")
  //         .update({ data: data })
  //         .eq("id", id);

  //       if (updateError) throw updateError;

  //       if (!allElementsDeleted) {
  //         await captureScreenshot();
  //       }
  //       if (allElementsDeleted) {
  //         const { error } = await supabase.current
  //           .from("flowdraw")
  //           .update({ image_url: "" })
  //           .eq("id", id);

  //         if (error) throw error;
  //       }

  //       queryClient.invalidateQueries({
  //         queryKey: ["draw-boards"],
  //         refetchType: "all", // refetch both active and inactive queries
  //       });

  //       toast.success("Excalidraw data saved successfully");
  //       router.refresh();
  //     } catch (error) {
  //       console.error("Error saving Excalidraw data:", error);
  //       toast.error("Error saving Excalidraw data");
  //     }
  //   };

  const captureScreenshot = async () => {
    if (excalidrawAPI) {
      const elements = excalidrawAPI.getSceneElements();
      const files = excalidrawAPI.getFiles();

      const blob = await exportToBlob({
        mimeType: "image/png",
        quality: 1,
        elements: elements,
        files: files,
        exportPadding: 100,
      });

      //   if (blob) {
      //     const filename = `${userProfile.id}-${Date.now()}.png`;
      //     const { data, error } = await supabase.current.storage
      //       .from("screenshots")
      //       .upload(filename, blob);

      //     if (error) {
      //       console.error("Error uploading screenshot:", error);
      //       return;
      //     }

      //     const screenshotUrl = supabase.current.storage
      //       .from("screenshots")
      //       .getPublicUrl(filename).data.publicUrl;
      //     await saveScreenshotUrl(screenshotUrl);
      //   }
    }
  };

  //   const saveScreenshotUrl = async (url: any) => {
  //     try {
  //       const { error } = await supabase.current
  //         .from("flowdraw")
  //         .update({ image_url: url })
  //         .eq("id", id);

  //       if (error) throw error;
  //     } catch (error) {
  //       console.error("Error saving screenshot URL:", error);
  //     }
  //   };

  if (!isMounted) {
    return (
      <div className="flex flex-col justify-center items-center flew-grow w-full h-full gap-4">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <Excalidraw
        initialData={{ elements }}
        theme={boardTheme}
        onChange={(elements) => {
          setElements(elements);
        }}
        excalidrawAPI={(api) => setExcalidrawAPI(api)}
        name={boardData.name}
        renderTopRightUI={() => {
          return <button>Save</button>;
        }}
      >
        <MainMenu>
          <div className="w-56">
            <MainMenu.DefaultItems.ChangeCanvasBackground />
            <MainMenu.DefaultItems.LoadScene />
            <div className="w-full mt-4">
              <MainMenu.Item
                onSelect={() => window.alert("Item1")}
                className="w-20"
              >
                Item1
              </MainMenu.Item>
              <MainMenu.Item onSelect={() => window.alert("Item2")}>
                Item 2
              </MainMenu.Item>
            </div>
          </div>
        </MainMenu>
        <WelcomeScreen>
          <WelcomeScreen.Center>
            <WelcomeScreen.Center.Logo>
              <span className="capitalize">
                Welcome {auth?.currentUser?.displayName}
              </span>
            </WelcomeScreen.Center.Logo>
            <WelcomeScreen.Center.Heading>
              <p>Excalidraw is now in Valens!</p>
            </WelcomeScreen.Center.Heading>
          </WelcomeScreen.Center>
        </WelcomeScreen>
      </Excalidraw>
    </div>
  );
};

export default ExcalidrawWrapper;
