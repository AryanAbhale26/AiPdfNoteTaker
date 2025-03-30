import { NextResponse } from "next/server";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Result } from "postcss";

// const pdfUrl =
//   "https://prestigious-mallard-263.convex.cloud/api/storage/6fcbdede-8f29-4dd9-a760-b2f3d577d328";
export async function GET(req) {
  try {
    const reqUrl = req.url;
    const { searchParams } = new URL(reqUrl);
    const pdfUrl = searchParams.get("pdfUrl");

    if (!pdfUrl) {
      return NextResponse.json(
        { error: "Missing pdfUrl parameter" },
        { status: 400 }
      );
    }

    console.log("PDF URL:", pdfUrl);

    // Fetch the PDF
    const resp = await fetch(pdfUrl);
    if (!resp.ok) {
      throw new Error(`Failed to fetch PDF: ${resp.statusText}`);
    }

    const data = await resp.blob();
    const loader = new WebPDFLoader(data);
    const docs = await loader.load();

    // Extract the text
    let pdfTextContent = docs.map((doc) => doc.pageContent).join(" ");
    console.log("Extracted PDF Content Length:", pdfTextContent.length);

    // Clean and split the text
    const cleanText = pdfTextContent
      .replace(/\n+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 2000,
      chunkOverlap: 20,
    });

    const output = await splitter.createDocuments([cleanText]);
    const splitterList = output.map((doc) => doc.pageContent);

    return NextResponse.json({ Result: splitterList });
  } catch (error) {
    console.error("Error in PDF Loader:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
