import { Loader2Icon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { dummyProjects } from '../types/assets'
import ProjectPreview from '../components/ProjectPreview'
import type { Project } from '..'

const Preview = () => {
  const { projectId, versionId } = useParams()
  const [code, SetCode] = useState<string>("")
  const [loading, SetLoading] = useState<boolean>(true)


  const fetchCode = async () => {
    const code = dummyProjects.find((proj) => proj.id === projectId)?.current_code
    setTimeout(() => {
      if (code) {
        SetCode(code)
        SetLoading(false)
      }
    }, 2000);
  }

  useEffect(() => {
    fetchCode()
  }, [])

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader2Icon className='size-7 animate-spin text-indigo-200' />
      </div>
    )
  }
  return (
    <div className='h-screen'>
      {code && <ProjectPreview project={{ current_code: code } as Project} isGenerating={false} showEditorPanel={false} />}
    </div>
  )
}

export default Preview