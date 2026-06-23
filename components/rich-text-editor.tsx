"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align"
import Placeholder from "@tiptap/extension-placeholder"
import { useEffect } from "react"
import {
    Bold, Italic, Underline as UnderlineIcon,
    List, ListOrdered, Heading2, Heading3,
    AlignLeft, AlignCenter, AlignRight,
    Undo, Redo, Quote
} from "lucide-react"
import { cn } from "@/lib/utils"

interface RichTextEditorProps {
    value?: string
    onChange?: (value: string) => void
    placeholder?: string
    className?: string
}

const ToolbarButton = ({
    onClick,
    active,
    title,
    children,
}: {
    onClick: () => void
    active?: boolean
    title: string
    children: React.ReactNode
}) => (
    <button
        type="button"
        onClick={onClick}
        title={title}
        className={cn(
            "p-1.5 rounded-md transition-all text-sm",
            active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "hover:bg-muted text-muted-foreground hover:text-foreground"
        )}
    >
        {children}
    </button>
)

export function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [2, 3] },
            }),
            Underline,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            Placeholder.configure({
                placeholder: placeholder || "Escribe aquí...",
                emptyEditorClass: "is-editor-empty",
            }),
        ],
        content: value || "",
        editorProps: {
            attributes: {
                class: "min-h-[360px] focus:outline-none text-sm leading-relaxed text-foreground px-4 py-3 rich-content",
            },
        },
        onUpdate({ editor }) {
            onChange?.(editor.getHTML())
        },
    })

    // Sync external value changes (e.g. when editing existing task)
    useEffect(() => {
        if (!editor) return
        const currentHtml = editor.getHTML()
        if (value !== undefined && value !== currentHtml) {
            editor.commands.setContent(value, false)
        }
    }, [value, editor])

    if (!editor) return null

    return (
        <div className={cn("border border-border/60 rounded-lg overflow-hidden bg-background/50", className)}>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-border/40 bg-muted/30">
                {/* History */}
                <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Deshacer">
                    <Undo className="h-3.5 w-3.5" />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Rehacer">
                    <Redo className="h-3.5 w-3.5" />
                </ToolbarButton>

                <div className="w-px h-4 bg-border/60 mx-1" />

                {/* Headings */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    active={editor.isActive("heading", { level: 2 })}
                    title="Título"
                >
                    <Heading2 className="h-3.5 w-3.5" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    active={editor.isActive("heading", { level: 3 })}
                    title="Subtítulo"
                >
                    <Heading3 className="h-3.5 w-3.5" />
                </ToolbarButton>

                <div className="w-px h-4 bg-border/60 mx-1" />

                {/* Text formatting */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    active={editor.isActive("bold")}
                    title="Negrita"
                >
                    <Bold className="h-3.5 w-3.5" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    active={editor.isActive("italic")}
                    title="Cursiva"
                >
                    <Italic className="h-3.5 w-3.5" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    active={editor.isActive("underline")}
                    title="Subrayado"
                >
                    <UnderlineIcon className="h-3.5 w-3.5" />
                </ToolbarButton>

                <div className="w-px h-4 bg-border/60 mx-1" />

                {/* Lists */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    active={editor.isActive("bulletList")}
                    title="Lista"
                >
                    <List className="h-3.5 w-3.5" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    active={editor.isActive("orderedList")}
                    title="Lista numerada"
                >
                    <ListOrdered className="h-3.5 w-3.5" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    active={editor.isActive("blockquote")}
                    title="Cita"
                >
                    <Quote className="h-3.5 w-3.5" />
                </ToolbarButton>

                <div className="w-px h-4 bg-border/60 mx-1" />

                {/* Alignment */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign("left").run()}
                    active={editor.isActive({ textAlign: "left" })}
                    title="Alinear izquierda"
                >
                    <AlignLeft className="h-3.5 w-3.5" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign("center").run()}
                    active={editor.isActive({ textAlign: "center" })}
                    title="Centrar"
                >
                    <AlignCenter className="h-3.5 w-3.5" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign("right").run()}
                    active={editor.isActive({ textAlign: "right" })}
                    title="Alinear derecha"
                >
                    <AlignRight className="h-3.5 w-3.5" />
                </ToolbarButton>
            </div>

            {/* Editor area */}
            <EditorContent editor={editor} />
        </div>
    )
}
