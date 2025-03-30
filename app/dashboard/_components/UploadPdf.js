"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { AddFileEntryToDb } from "@/convex/fileStorage";
import { useUser } from "@clerk/nextjs";
import { DialogClose } from "@radix-ui/react-dialog";
import axios from "axios";
import { useAction, useMutation } from "convex/react";
import { Loader2Icon } from "lucide-react";
import React, { useState } from "react";
import uuid4 from "uuid4";

const UploadPdf = ({ children }) => {
  const { user } = useUser();
  const generateUploadUrl = useMutation(api.fileStorage.generateUploadUrl);
  const addFile = useMutation(api.fileStorage.AddFileEntryToDb);
  const getFileUrl = useMutation(api.fileStorage.getFileUrl);
  const [file, setFile] = useState();
  const [fileName, setFileName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const embeddDocument = useAction(api.myActions.ingest);

  const onFileSelect = (e) => {
    setFile(e.target.files[0]);
  };

  const onUpload = async () => {
    setLoading(true);
    try {
      // Step 1: Get a short-lived upload URL
      const postUrl = await generateUploadUrl();
      // Step 2: POST the file to the URL
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file?.type },
        body: file,
      });
      const { storageId } = await result.json();
      console.log(storageId);
      const fileId = uuid4();
      const fileUrl = await getFileUrl({ storageId: storageId });
      //step 3 :Save User
      const resp = await addFile({
        fileId: fileId,
        storageId: storageId,
        fileName: fileName || "Untitled File",
        fileUrl: fileUrl,
        createdBy: user?.primaryEmailAddress?.emailAddress,
      });
      // Api call to fetch pdf
      const ApiResp = await axios.get("/api/pdf-loader?pdfUrl=" + fileUrl);
      await embeddDocument({
        splitText: ApiResp.data.Result,
        fileId: fileId,
      });

      setIsDialogOpen(false);
    } catch (error) {
      console.log("error in Upload", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Pdf File</DialogTitle>
          <DialogDescription>
            Please select a PDF file to upload and provide a name.
          </DialogDescription>
        </DialogHeader>
        {/* File Upload Section */}
        <div className="mt-5">
          <label>
            <h2 className="text-lg font-semibold">Select a file to Upload</h2>
          </label>
          <input
            type="file"
            accept="application/pdf"
            className="border-2 p-3 rounded-md w-full"
            onChange={(e) => onFileSelect(e)}
          />
          <div className="mt-2">
            <label>File Name *</label>
            <Input
              placeholder="File Name"
              onChange={(e) => setFileName(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsDialogOpen(false)}
          >
            Close
          </Button>
          <Button onClick={onUpload} type="button">
            {loading ?
              <Loader2Icon className="animate-spin" />
            : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadPdf;
