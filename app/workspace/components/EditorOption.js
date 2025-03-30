import React from "react";
import {
  BoldIcon,
  Italic,
  List,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Sparkle,
  Save,
} from "lucide-react";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

const EditorOption = ({ editor }) => {
  if (!editor) {
    return <div>Loading Editor...</div>;
  }
  const { user } = useUser();

  const SearchAi = useAction(api.myActions.search);
  const { fileId } = useParams();
  const addNotes = useMutation(api.notes.AddNotes);

  // AI Button Click
  const onAiClick = async () => {
    toast("AI is working...");

    const selectedText = editor.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to,
      " "
    );

    console.log("Selected Text:", selectedText);

    try {
      const result = await SearchAi({
        query: selectedText,
        fileId: fileId,
      });

      console.log("Search Result:", result);

      const formattedResult = `
        <p><strong>Answer:</strong></p>
        <p>${result.replace(/\n/g, "<br>")}</p>
      `;

      editor
        .chain()
        .focus()
        .insertContentAt(editor.state.selection.to, formattedResult)
        .run();

      toast.success("AI Response added!");
    } catch (error) {
      console.error("Error fetching AI response:", error);

      editor
        .chain()
        .focus()
        .insertContentAt(
          editor.state.selection.to,
          `<p style="color: red;">Error fetching AI response. Please try again.</p>`
        )
        .run();
    }
  };

  // Save Notes Button Click
  const onSaveNotes = async () => {
    try {
      const fullText = editor.getHTML();

      await addNotes({
        notes: fullText,
        fileId: fileId,
        createdBy: user?.primaryEmailAddress?.emailAddress,
      });

      toast.success("Notes saved successfully!");
    } catch (error) {
      console.error("Error saving notes:", error);
      toast.error("Failed to save notes. Please try again.");
    }
  };

  return (
    <div className="control-group p-3 flex gap-2 flex-wrap md:flex-nowrap">
      {/* Bold */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className="hover:bg-gray-200 p-2 rounded-md"
      >
        <BoldIcon />
      </button>

      {/* Italic */}
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className="hover:bg-gray-200 p-2 rounded-md"
      >
        <Italic />
      </button>

      {/* Underline */}
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className="hover:bg-gray-200 p-2 rounded-md"
      >
        <Underline />
      </button>

      {/* Bullet List */}
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className="hover:bg-gray-200 p-2 rounded-md"
      >
        <List />
      </button>

      {/* Align Left */}
      <button
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className="hover:bg-gray-200 p-2 rounded-md"
      >
        <AlignLeft />
      </button>

      {/* Align Center */}
      <button
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className="hover:bg-gray-200 p-2 rounded-md"
      >
        <AlignCenter />
      </button>

      {/* Align Right */}
      <button
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className="hover:bg-gray-200 p-2 rounded-md"
      >
        <AlignRight />
      </button>

      {/* Justify */}
      <button
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        className="hover:bg-gray-200 p-2 rounded-md"
      >
        <AlignJustify />
      </button>

      {/* AI Button */}
      <button onClick={onAiClick} className="hover:bg-gray-200 p-2 rounded-md">
        <Sparkle />
      </button>

      {/* Save Notes Button */}
      <button
        onClick={onSaveNotes}
        className="hover:bg-green-200 p-2 rounded-md flex items-center gap-1"
      >
        <Save />
        <span>Save Notes</span>
      </button>
    </div>
  );
};

export default EditorOption;
