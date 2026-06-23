"use client"

import { useEditor, EditorContent, type Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align"
import Placeholder from "@tiptap/extension-placeholder"
import { useEffect, useRef, useState, type RefObject } from "react"
import { createPortal } from "react-dom"
import {
    Bold, Italic, Underline as UnderlineIcon,
    List, ListOrdered, Heading2, Heading3,
    AlignLeft, AlignCenter, AlignRight,
    Undo, Redo, Quote
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useFontZoom } from "@/hooks/use-font-zoom"
import { FontZoomControls } from "@/components/font-zoom-controls"

const EDITOR_BASE_FONT_PX = 17
const EDITOR_ZOOM_KEY = "editor-font-zoom"

interface RichTextEditorProps {
    value?: string
    onChange?: (value: string) => void
    placeholder?: string
    className?: string
    bottomAvoidRef?: RefObject<HTMLElement | null>
    onFloatingChange?: (visible: boolean) => void
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
        onMouseDown={(e) => e.preventDefault()}
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

function EditorToolbar({ editor, className }: { editor: Editor; className?: string }) {
    return (
        <div className={cn("flex flex-wrap items-center justify-center gap-0.5 px-2 py-1.5 flex-1 min-w-0", className)}>
            <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Deshacer">
                <Undo className="h-3.5 w-3.5" />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Rehacer">
                <Redo className="h-3.5 w-3.5" />
            </ToolbarButton>

            <div className="w-px h-4 bg-border/60 mx-1" />

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
    )
}

export function RichTextEditor({
    value,
    onChange,
    placeholder,
    className,
    bottomAvoidRef,
    onFloatingChange,
}: RichTextEditorProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const inlineToolbarRef = useRef<HTMLDivElement>(null)
    const [inlineToolbarVisible, setInlineToolbarVisible] = useState(true)
    const [editorInView, setEditorInView] = useState(true)
    const [bottomSectionVisible, setBottomSectionVisible] = useState(false)
    const { zoom, zoomIn, zoomOut, resetZoom } = useFontZoom(EDITOR_ZOOM_KEY, 1.1)

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
                class: "min-h-[360px] focus:outline-none leading-relaxed text-foreground px-3 sm:px-4 py-3 rich-content editor-content w-full max-w-full break-words",
                style: `font-size: ${EDITOR_BASE_FONT_PX * zoom}px`,
            },
        },
        onUpdate({ editor }) {
            onChange?.(editor.getHTML())
        },
    })

    useEffect(() => {
        if (!editor) return
        const currentHtml = editor.getHTML()
        if (value !== undefined && value !== currentHtml) {
            editor.commands.setContent(value, { emitUpdate: false })
        }
    }, [value, editor])

    useEffect(() => {
        if (!editor) return
        editor.setOptions({
            editorProps: {
                attributes: {
                    class: "min-h-[360px] focus:outline-none leading-relaxed text-foreground px-3 sm:px-4 py-3 rich-content editor-content w-full max-w-full break-words",
                    style: `font-size: ${EDITOR_BASE_FONT_PX * zoom}px`,
                },
            },
        })
    }, [editor, zoom])

    useEffect(() => {
        const toolbar = inlineToolbarRef.current
        const container = containerRef.current
        if (!toolbar || !container) return

        const toolbarObserver = new IntersectionObserver(
            ([entry]) => setInlineToolbarVisible(entry.isIntersecting),
            { threshold: 0 }
        )
        const containerObserver = new IntersectionObserver(
            ([entry]) => setEditorInView(entry.isIntersecting),
            { threshold: 0 }
        )

        toolbarObserver.observe(toolbar)
        containerObserver.observe(container)

        return () => {
            toolbarObserver.disconnect()
            containerObserver.disconnect()
        }
    }, [editor])

    useEffect(() => {
        const bottomEl = bottomAvoidRef?.current
        if (!bottomEl) return

        const observer = new IntersectionObserver(
            ([entry]) => setBottomSectionVisible(entry.isIntersecting),
            { threshold: 0.1 }
        )
        observer.observe(bottomEl)
        return () => observer.disconnect()
    }, [bottomAvoidRef, editor])

    const floatingVisible = !inlineToolbarVisible && editorInView && !bottomSectionVisible

    useEffect(() => {
        onFloatingChange?.(floatingVisible)
    }, [floatingVisible, onFloatingChange])

    if (!editor) return null

    const toolbarRow = (compact = false) => (
        <div className="flex items-center gap-1 w-full">
            <EditorToolbar editor={editor} />
            <div className="flex-shrink-0 border-l border-border/40 pl-1 ml-0.5">
                <FontZoomControls
                    zoom={zoom}
                    onZoomIn={zoomIn}
                    onZoomOut={zoomOut}
                    onReset={resetZoom}
                    compact={compact}
                />
            </div>
        </div>
    )

    return (
        <>
            <div ref={containerRef} className={cn("border border-border/60 rounded-lg bg-background/50 w-full max-w-full overflow-x-hidden", className)}>
                <div
                    ref={inlineToolbarRef}
                    className="border-b border-border/40 bg-muted/30 rounded-t-lg"
                >
                    {toolbarRow(false)}
                </div>

                <div className="rounded-b-lg">
                    <EditorContent editor={editor} />
                </div>
            </div>

            {floatingVisible && typeof document !== "undefined" && createPortal(
                <div
                    className="fixed left-0 right-0 z-40 px-2 pointer-events-none"
                    style={{ top: "max(0.5rem, env(safe-area-inset-top))" }}
                >
                    <div className="mx-auto max-w-3xl pointer-events-auto rounded-xl border border-border/60 bg-background/95 backdrop-blur-md shadow-lg">
                        {toolbarRow(true)}
                    </div>
                </div>,
                document.body
            )}
        </>
    )
}
