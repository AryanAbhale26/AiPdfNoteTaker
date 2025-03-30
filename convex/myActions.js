import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";
import { action } from "./_generated/server.js";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { v } from "convex/values";
import axios from "axios";

// Ingest Action
export const ingest = action({
  args: {
    splitText: v.any(),
    fileId: v.string(),
  },
  handler: async (ctx, args) => {
    const documents = args.splitText.map((text, index) => ({
      pageContent: text,
      metadata: { fileId: args.fileId },
      id: `${args.fileId}-${index}`, // Ensure the ID is unique per document
    }));

    // Store documents with embeddings in Convex VectorStore
    await ConvexVectorStore.fromDocuments(
      documents,
      new GoogleGenerativeAIEmbeddings({
        apiKey: "AIzaSyCztjmipRapoDY1gp-VcMD0WF0YkO6fTiY",
        model: "text-embedding-004", // 768 dimensions
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document title",
      }),
      { ctx }
    );

    return "Stored successfully";
  },
});

// Search Action
// export const search = action({
//   args: {
//     query: v.string(),
//     fileId: v.string(),
//   },
//   handler: async (ctx, args) => {
//     // Initialize VectorStore with embeddings
//     const vectorStore = new ConvexVectorStore(
//       new GoogleGenerativeAIEmbeddings({
//         apiKey: "AIzaSyCztjmipRapoDY1gp-VcMD0WF0YkO6fTiY",
//         model: "text-embedding-004",
//         taskType: TaskType.RETRIEVAL_DOCUMENT,
//       }),
//       { ctx }
//     );

//     // Perform the similarity search
//     const results = await vectorStore.similaritySearch(args.query, 1);

//     console.log("Raw search results:", results); // Log raw results for debugging

//     // Filter based on the fileId in the metadata
//     const filteredResults = results.filter(
//       (result) => result.metadata?.fileId === args.fileId
//     );

//     console.log("Filtered results:", filteredResults); // Log filtered results for debugging

//     // Return filtered results or "No results found"
//     return filteredResults.length ?
//         JSON.stringify(filteredResults)
//       : "No results found.";
//   },
// });

// Search Action with API integration
const API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
const API_KEY = "AIzaSyCztjmipRapoDY1gp-VcMD0WF0YkO6fTiY"; // Replace with actual API Key

export const search = action({
  args: {
    query: v.string(),
    fileId: v.string(),
  },
  handler: async (ctx, args) => {
    // Initialize Convex VectorStore with embeddings
    const vectorStore = new ConvexVectorStore(
      new GoogleGenerativeAIEmbeddings({
        apiKey: "AIzaSyCztjmipRapoDY1gp-VcMD0WF0YkO6fTiY",
        model: "text-embedding-004", // 768 dimensions
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document title",
      }),
      { ctx }
    );

    // Perform similarity search with the query to get the top 3 results
    const searchResults = await vectorStore.similaritySearch(args.query, 3); // Fetch top 3 results

    // Log search results

    // Filter results based on fileId in metadata
    const filteredResults = searchResults.filter(
      (result) => result.metadata?.fileId === args.fileId
    );

    // Log filtered results

    // If no relevant results, return early
    if (filteredResults.length === 0) {
      return "No relevant content found for the given fileId.";
    }

    // Prepare the combined content from filtered results
    const combinedContent = filteredResults
      .map((result) => result.pageContent)
      .join("\n\n");

    // Log the combined content

    // Prepare the question for Gemini based on the user's query
    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Based on the following content, please provide an answer to the question:

              Content: 
              ${combinedContent}
              
              Question: 
              ${args.query}
              
              Answer only using this information. If no answer is available based on this content, reply with "No answer available."`,
            },
          ],
        },
      ],
    };

    try {
      // Send the document content to Gemini API
      const response = await axios.post(
        `${API_URL}?key=${API_KEY}`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Log the full response data

      const geminiResponse = response.data; // Gemini response

      // Check if the response contains valid content
      if (geminiResponse?.candidates && geminiResponse.candidates.length > 0) {
        const contentParts = geminiResponse.candidates[0]?.content?.parts;
        if (contentParts && contentParts.length > 0) {
          const responseText = contentParts[0]?.text; // Extract the actual response text
          // Log the response text
          return responseText || "No answer found.";
        }
      }

      return "No relevant answer found from Gemini.";
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      return "There was an error processing your request.";
    }
  },
});
