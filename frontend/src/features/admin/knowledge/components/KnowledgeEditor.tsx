import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Heading2,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Undo2,
} from "lucide-react";
import { useEffect } from "react";

type KnowledgeEditorProps = {
  value: string;
  onChange: (content: { contentHtml: string; contentText: string }) => void;
  disabled?: boolean;
};

const KnowledgeEditor = ({ value, onChange, disabled = false }: KnowledgeEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Write the public information the chatbot should know…",
      }),
    ],
    content: value,
    editable: !disabled,
    editorProps: {
      attributes: {
        class:
          "min-h-[420px] px-6 py-5 text-[15px] leading-7 outline-none [&_h1]:mb-4 [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:mt-5 [&_h3]:text-xl [&_h3]:font-semibold [&_p]:mb-3 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-primary/30 [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground",
      },
    },
    onUpdate: ({ editor: current }) =>
      onChange({
        contentHtml: current.getHTML(),
        contentText: current.getText(),
      }),
  });

  useEffect(() => {
    if (!editor || editor.isDestroyed || editor.getHTML() === value) return;
    editor.commands.setContent(value || "<p></p>", { emitUpdate: false });
  }, [editor, value]);

  useEffect(() => {
    if (!editor || editor.isDestroyed) return;
    editor.setEditable(!disabled);
  }, [disabled, editor]);

  if (!editor || editor.isDestroyed) {
    return <div className="min-h-[470px] animate-pulse rounded-lg bg-muted/40" />;
  }

  const tool = (label: string, active: boolean, action: () => void, icon: React.ReactNode) => (
    <Button
      key={label}
      type="button"
      variant={active ? "secondary" : "ghost"}
      size="icon-sm"
      title={label}
      aria-label={label}
      onClick={action}
      disabled={disabled}
    >
      {icon}
    </Button>
  );

  return (
    <div className={cn("overflow-hidden rounded-xl border bg-background", disabled && "opacity-75")}>
      <div className="flex flex-wrap items-center gap-1 border-b bg-muted/30 px-3 py-2">
        {tool("Bold", editor.isActive("bold"), () => editor.chain().focus().toggleBold().run(), <Bold />)}
        {tool("Italic", editor.isActive("italic"), () => editor.chain().focus().toggleItalic().run(), <Italic />)}
        {tool(
          "Heading",
          editor.isActive("heading", { level: 2 }),
          () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
          <Heading2 />,
        )}
        {tool("Bulleted list", editor.isActive("bulletList"), () => editor.chain().focus().toggleBulletList().run(), <List />)}
        {tool("Numbered list", editor.isActive("orderedList"), () => editor.chain().focus().toggleOrderedList().run(), <ListOrdered />)}
        {tool("Quote", editor.isActive("blockquote"), () => editor.chain().focus().toggleBlockquote().run(), <Quote />)}
        <span className="mx-1 h-5 w-px bg-border" />
        {tool("Undo", false, () => editor.chain().focus().undo().run(), <Undo2 />)}
        {tool("Redo", false, () => editor.chain().focus().redo().run(), <Redo2 />)}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default KnowledgeEditor;
