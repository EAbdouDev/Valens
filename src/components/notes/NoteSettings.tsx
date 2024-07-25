import { FC, useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
} from "@nextui-org/react";
import { Settings } from "lucide-react";
import { Switch } from "../ui/switch";
import { firestore } from "../../../firebase/client";
import {
  collection,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { toast } from "sonner";

interface NoteSettingsProps {
  note: any;
}

const NoteSettings: FC<NoteSettingsProps> = ({ note }) => {
  const [isPublic, setIsPublic] = useState<boolean>(note.isPublic || false);

  const handleChangeVisibility = async (newIsPublic: boolean) => {
    if (!firestore) return;

    try {
      // Find the document by slug
      const notesQuery = query(
        collection(firestore, "notes"),
        where("slug", "==", note.slug)
      );
      const querySnapshot = await getDocs(notesQuery);

      if (!querySnapshot.empty) {
        const batch = writeBatch(firestore);
        querySnapshot.forEach((docSnapshot) => {
          const noteRef = doc(firestore!, "notes", docSnapshot.id);
          batch.update(noteRef, {
            isPublic: newIsPublic,
          });
        });
        await batch.commit();
        toast.success("Note updated successfully.");
      } else {
        toast.error("No note found with the slug.");
      }
    } catch (error) {
      console.log(error);
      toast.error(`Failed to update note: ${error}`);
    }
  };

  const handleSwitchChange = (checked: boolean) => {
    setIsPublic(checked);
    handleChangeVisibility(checked);
  };

  return (
    <Popover placement="bottom" size="lg">
      <PopoverTrigger>
        <Button variant="light" color="default" size="md" isIconOnly>
          <Settings />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="mt-2">
        <div>
          <Switch checked={isPublic} onCheckedChange={handleSwitchChange} />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NoteSettings;
