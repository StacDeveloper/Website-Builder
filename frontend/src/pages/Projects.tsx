import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { Project } from '..'
import { ArrowBigDownDashIcon, EyeIcon, EyeOff, EyeOffIcon, FullscreenIcon, LaptopIcon, Loader2Icon, MessageSquareIcon, SaveIcon, SmartphoneIcon, TabletIcon, XIcon } from 'lucide-react'
import { dummyConversations, dummyProjects, dummyVersion } from '../types/assets'
import Sidebar from '../components/Sidebar'
import ProjectPreview, { type ProjectPreviewRef } from '../components/ProjectPreview'

const Projects = () => {
  const { projectId } = useParams()
  const navigate = useNavigate()

  const [project, SetProject] = useState<Project | null>(null)

  const [loading, SetLoading] = useState<boolean>(true)
  const [isGenerating, SetIsGenerating] = useState<boolean>(true)

  const [device, SetDevice] = useState<'phone' | 'tablet' | 'dekstop'>("dekstop")
  const [isMenuOpen, SetIsMenuOpen] = useState<boolean>(false)
  const [isSaving, SetIsSaving] = useState<boolean>(false)

  const previewRef = useRef<ProjectPreviewRef>(null)

  const fetchProject = async () => {
    const project = dummyProjects.find((project) => project.id === projectId)
    setTimeout(() => {
      if (project) {
        SetProject({ ...project, conversation: dummyConversations, versions: dummyVersion })
        SetLoading(false)
        SetIsGenerating(project.current_code ? false : true)
      }
    }, 2000);
  }

  useEffect(() => {
    fetchProject()
  }, [])

  if (loading) {
    return <>
      <div className='flex items-center justify-center h-screen'>
        <Loader2Icon className='size-7 animate-spin text-violet-200' />
      </div>
    </>
  }
  return project ? (
    <div className='flex flex-col h-screen w-full bg-gray-900 text-white'>
      {/* builder navbar */}
      <div className='flex max-sm:flex-col sm:items-center gap-4 px-4 py-2 no-scrollbar'>
        {/* left */}
        <div className='flex items-center gap-2 sm:min-w-90 text-nowrap'>
          <img src="../favicon.svg" alt="logo" className='h-6 cursor-pointer' onClick={() => navigate("/")} />
          <div className='max-w-64 sm:max-w-xs'>
            <p className='text-sm capitalize truncate text-medium'>{project.name}</p>
            <p className='text-xs text-gray-400 -mt-0.5'>Previewing last saved version</p>
          </div>
          <div className='sm:hidden flex-1 flex justify-end'>
            {isMenuOpen ? <MessageSquareIcon onClick={() => SetIsMenuOpen(false)} className='size-6 cursor-pointer' /> : <XIcon onClick={() => SetIsMenuOpen(true)} className='size-6 cursor-pointer' />}
          </div>
        </div>
        {/* middle */}
        <div className='hidden sm:flex gap-2 bg-gray-950 p-1.5 rounded-md'>
          <SmartphoneIcon onClick={() => SetDevice('phone')} className={`size-6 p-1 rounded cursor-pointer ${device === "phone" ? "bg-gray-700" : ""}`} />

          <TabletIcon onClick={() => SetDevice('tablet')} className={`size-6 p-1 rounded cursor-pointer ${device === "tablet" ? "bg-gray-700" : ""}`} />

          <LaptopIcon onClick={() => SetDevice('dekstop')} className={`size-6 p-1 rounded cursor-pointer ${device === "dekstop" ? "bg-gray-700" : ""}`} />
        </div>
        {/* right */}
        <div className='flex items-center justify-end gap-3 flex-1 text-xs sm:text-sm'>
          <button disabled={isSaving} className='max-sm:hidden bg-gray-800 hover:bg-gray-700 text-white px-3.5 py-1 flex items-center gap-2 rounded sm:rounded-sm transition-colors border border-gray-700'>
            {isSaving ? <Loader2Icon className='animate-spin' size={16} /> : <SaveIcon size={16} />}
            Save
          </button>
          <Link className='flex items-center gap-2 px-4 py-1 rounded sm:rounded-sm border border-gray-700 hover:border-gray-500 transition-colors' to={`/preview/${projectId}`} target='_blank'> <FullscreenIcon size={16} /> Preview</Link>
          <button className='bg-linear-to-br from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white px-3.5 py-1 flex items-center gap-2 rounded sm:rounded-sm transition-colors'> <ArrowBigDownDashIcon size={16} /> Download</button>
          <button className='bg-linear-to-br from-indigo-700 to-indigo-600 hover:to-indigo-500 text-white px-3.5 py-1 flex items-center gap-2 rouded sm:rounded-sm transition-colors'> {project.isPublished ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />} {project.isPublished ? "Unpublish" : "Publish"}</button>
        </div>
      </div>
      <div className='flex-1 flex overflow-auto'>
        <Sidebar isMenuOpen={isMenuOpen} project={project} setProject={(p) => SetProject(p)} isGenerating={isGenerating} SetIsGenerating={SetIsGenerating} />
        <div className='flex-1 p-2 pl-0'>
          <ProjectPreview ref={previewRef} isGenerating={isGenerating} project={project} device={device} />
        </div>
      </div>
    </div>
  ) : (
    <div className='flex items-center justify-center h-screen'>
      <p className='text-2xl font-medium text-gray-200'>Unable to load project!</p>
    </div>
  )
}

export default Projects