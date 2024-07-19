import { FC, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";

interface UploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (label: string, file: File) => void;
}

const UploadDialog: FC<UploadDialogProps> = ({ isOpen, onClose, onUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [label, setLabel] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (file && label) {
      onUpload(label, file);
      setFile(null);
      setLabel("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
          <DialogDescription>
            Upload a file and provide a label.
          </DialogDescription>
        </DialogHeader>
        <input
          type="file"
          accept=".pdf,image/*,video/*,audio/*"
          onChange={handleFileChange}
        />
        <Input
          type="text"
          placeholder="Enter label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
        <Button onClick={handleUpload}>Upload</Button>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDialog;
