import React, { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import EditorOption from "./EditorOption";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const TextEditor = ({ fileId }) => {
  // Fetch notes from database
  const notes = useQuery(api.notes.GetNotes, { fileId });

  // Initialize editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Ask anything related to PDF",
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight.configure({ multicolor: true }),
    ],
    content: notes ?? "", // Ensure notes are loaded safely
    editorProps: {
      attributes: {
        class: "focus:outline-none p-5",
      },
    },
  });

  // Update editor content when notes are loaded
  useEffect(() => {
    if (editor && notes !== undefined) {
      editor.commands.setContent(notes);
    }
  }, [editor, notes]);

  if (!editor) return <div>Loading Editor...</div>;

  return (
    <div className="h-full flex flex-col">
      <EditorOption editor={editor} />
      <div className="overflow-auto flex-1 p-2 border rounded-md max-h-[560px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default TextEditor;
