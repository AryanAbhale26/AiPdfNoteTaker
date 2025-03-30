"use client";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import WorkspaceHeader from "../components/WorkspaceHeader";
import PdfViewer from "../components/PdfViewer";
import { useQueries, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import TextEditor from "../components/TextEditor";

const Workspace = () => {
  const { fileId } = useParams();
  const getFileInfo = useQuery(api.fileStorage.GetFileRecords, {
    fileId: fileId,
  });
  useEffect(() => {}, [getFileInfo]);

  return (
    <div>
      <WorkspaceHeader />
      <div className="grid grid-cols-2 gap-5">
        <div className="TextEditor">
          <TextEditor fileId={fileId} />
        </div>
        <div className="pdfView">
          <PdfViewer fileUrl={getFileInfo?.fileUrl} />
        </div>
      </div>
    </div>
  );
};

export default Workspace;
