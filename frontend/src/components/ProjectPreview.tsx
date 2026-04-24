import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import type { Project } from '..'
import { iframeScript } from '../types/assets'
import EditorPanel from './EditorPanel'
import LoaderSteps from './LoaderSteps'

interface ProjectPreviewProps {
    project: Project
    isGenerating: boolean
    device?: "dekstop" | "phone" | "tablet"
    showEditorPanel?: boolean
}
type selectedElement = {
    tagName: string;
    className: string;
    text: string;
    styles: {
        padding: string;
        margin: string;
        backgroundColor: string;
        color: string;
        fontSize: string;
    };
}

export interface ProjectPreviewRef {
    getCode: () => string | undefined
}

const ProjectPreview = forwardRef<ProjectPreviewRef, ProjectPreviewProps>(({ project, isGenerating, device = "dekstop", showEditorPanel = true }, ref) => {

    const [selectedElement, SetSelectedElement] = useState<selectedElement | null>(null)

    const iframeRef = useRef<HTMLIFrameElement | null>(null)

    const injectPreview = (html: string) => {
        if (!html) return ""
        if (!showEditorPanel) return html

        if (html.includes("</body>")) {
            return html.replace("</body>", iframeScript + "</body>")
        } else {
            return html + iframeScript
        }
    }

    useImperativeHandle(ref, () => ({
        getCode: () => {
            const doc = iframeRef.current?.contentDocument;
            if (!doc) return undefined
            // Remvoe our selection class/ attributes /outline from all elements
            doc.querySelectorAll(".ai-selected-element,[data-ai-selected]").forEach((e) => {
                e.classList.remove(".ai-selected-element");
                e.removeAttribute("data-ai-selected");
                (e as HTMLElement).style.outline = ""
            })
            // Remove injected Style and script from the document
            const previewStyle = doc.getElementById("ai-preview-style")
            if (previewStyle) previewStyle.remove()
            const previewScript = doc.getElementById("ai-preview-script")
            if (previewScript) previewScript.remove()
            // Serialize clean HTML
            const html = doc.documentElement.outerHTML
            return html

        }
    }))

    const resolution = {
        phone: "w-[412px]",
        tablet: "w-[768px]",
        dekstop: "w-full"
    }

    const handleUpdate = (updates: MessageEvent) => {
        if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage({
                type: "UPDATE_ELEMENT",
                payload: updates
            }, "*")
        }
    }

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data.type === "ELEMENT_SELECTED") {
                SetSelectedElement(event.data.payload)
            } else if (event.data.type === "CLEAR_SELECTION") {
                SetSelectedElement(null)
            }
        }
        window.addEventListener("message", handleMessage)
        return () => window.removeEventListener("message", handleMessage)
    }, [])

    return (
        <div className='relative h-full bg-gray-900 flex-1 rounded-xl overflow-hidden max-sm:ml-2'>
            {project.current_code ? (
                <>
                    <iframe
                        srcDoc={injectPreview(project.current_code)}
                        ref={iframeRef}
                        className={`h-full max-sm:w-full ${resolution[device]} mx-auto transition-all`}
                    />
                    {showEditorPanel && selectedElement && (
                        <EditorPanel
                            onUpdate={handleUpdate}
                            selectedElement={selectedElement}
                            onClose={() => {
                                SetSelectedElement(null)
                                if (iframeRef.current?.contentWindow) {
                                    iframeRef.current.contentWindow.postMessage({ type: "CLEAR_SELECTION_REQUEST" }, "*")
                                }
                            }

                            } />
                    )}
                </>
            ) : isGenerating && (
                <LoaderSteps />
            )}
        </div>
    )
})

export default ProjectPreview