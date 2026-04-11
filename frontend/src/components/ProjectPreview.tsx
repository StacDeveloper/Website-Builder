import { forwardRef, useRef } from 'react'
import type { Project } from '..'
import { iframeScript } from '../types/assets'

interface ProjectPreviewProps {
    project: Project
    isGenerating: boolean
    device?: "dekstop" | "phone" | "tablet"
    showEditorPanel?: boolean
}

export interface ProjectPreviewRef {
    getCode: () => string | undefined
}

const ProjectPreview = forwardRef<ProjectPreviewRef, ProjectPreviewProps>(({ project, isGenerating, device = "dekstop", showEditorPanel = true }, ref) => {

    const iframeRef = useRef<HTMLFrameElement>(null)
    
    const injectPreview = (html: string) => {
        if (!html) return ""
        if (!showEditorPanel) return html

        if (html.includes("</body>")) {
            return html.replace("</body>", iframeScript + "</body>")
        } else {
            return html + iframeScript
        }
    }

    const resolution = {
        phone: "w-[412px]",
        tablet: "w-[768px]",
        dekstop: "w-full"
    }
    return (
        <div className='relative h-full bg-gray-900 flex-1 rounded-xl overflow-hidden max-sm:ml-2'>
            {project.current_code ? (
                <>
                    <iframe
                        srcDoc={injectPreview(project.current_code)}
                        ref={iframeRef}
                        className={`h-full max-sm:w-full ${resolution[device]} mx-auto transition-all`}
                    />
                </>
            ) : isGenerating && (
                <div>loading</div>
            )}
        </div>
    )
})

export default ProjectPreview