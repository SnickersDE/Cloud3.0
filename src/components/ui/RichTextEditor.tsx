"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Underline from "@tiptap/extension-underline";
import { 
  Bold, Italic, Underline as UnderlineIcon, 
  AlignLeft, AlignCenter, AlignRight, 
  Heading1, Heading2, Type, 
  Palette
} from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyle,
      Color,
    ],
    content: content,
    editorProps: {
      attributes: {
        class: "prose max-w-none focus:outline-none min-h-[12rem] p-4 text-gray-700 leading-relaxed",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const setLink = () => {
    // Basic link implementation if needed, skipping for now based on prompt
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      {/* Sticky Toolbar */}
      <div className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap gap-1 items-center">
        
        {/* Text Style Group */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-1">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${editor.isActive("bold") ? "bg-gray-200 text-primary" : "text-gray-600"}`}
            title="Fett"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${editor.isActive("italic") ? "bg-gray-200 text-primary" : "text-gray-600"}`}
            title="Kursiv"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${editor.isActive("underline") ? "bg-gray-200 text-primary" : "text-gray-600"}`}
            title="Unterstrichen"
          >
            <UnderlineIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Alignment Group */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-1">
          <button
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${editor.isActive({ textAlign: "left" }) ? "bg-gray-200 text-primary" : "text-gray-600"}`}
            title="Linksbündig"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${editor.isActive({ textAlign: "center" }) ? "bg-gray-200 text-primary" : "text-gray-600"}`}
            title="Zentriert"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${editor.isActive({ textAlign: "right" }) ? "bg-gray-200 text-primary" : "text-gray-600"}`}
            title="Rechtsbündig"
          >
            <AlignRight className="w-4 h-4" />
          </button>
        </div>

        {/* Heading/Size Group */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-1">
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${editor.isActive("heading", { level: 1 }) ? "bg-gray-200 text-primary" : "text-gray-600"}`}
            title="Überschrift 1"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${editor.isActive("heading", { level: 2 }) ? "bg-gray-200 text-primary" : "text-gray-600"}`}
            title="Überschrift 2"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${editor.isActive("paragraph") ? "bg-gray-200 text-primary" : "text-gray-600"}`}
            title="Normaler Text"
          >
            <Type className="w-4 h-4" />
          </button>
        </div>

        {/* Color Group */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => editor.chain().focus().setColor("#000000").run()}
            className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${editor.isActive("textStyle", { color: "#000000" }) ? "bg-gray-200" : ""}`}
            title="Schwarz"
          >
            <div className="w-4 h-4 bg-black rounded-full border border-gray-300"></div>
          </button>
          <button
            onClick={() => editor.chain().focus().setColor("#ef4444").run()}
            className="p-1.5 rounded hover:bg-gray-200 transition-colors"
            title="Rot"
          >
             <div className="w-4 h-4 bg-red-500 rounded-full border border-gray-300"></div>
          </button>
          <button
            onClick={() => editor.chain().focus().setColor("#22c55e").run()}
            className="p-1.5 rounded hover:bg-gray-200 transition-colors"
            title="Grün"
          >
             <div className="w-4 h-4 bg-green-500 rounded-full border border-gray-300"></div>
          </button>
          <button
            onClick={() => editor.chain().focus().setColor("#3b82f6").run()}
            className="p-1.5 rounded hover:bg-gray-200 transition-colors"
            title="Blau"
          >
             <div className="w-4 h-4 bg-blue-500 rounded-full border border-gray-300"></div>
          </button>
        </div>

      </div>

      {/* Editor Area */}
      <EditorContent editor={editor} />
    </div>
  );
}