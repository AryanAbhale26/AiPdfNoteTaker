import React from "react";

const PdfViewer = ({ fileUrl }) => {
  if (!fileUrl) {
    return (
      <p className="text-center">
        No PDF selected. Please upload a PDF to view.
      </p>
    );
  }

  return (
    <div className="w-full">
      <iframe
        src={`${fileUrl}#toolbar=0`}
        title="PDF Viewer"
        height="100%"
        width="100%"
        className="h-[90vh] border rounded-lg shadow-lg"
      />
    </div>
  );
};

export default PdfViewer;
