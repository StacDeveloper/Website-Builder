import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { dummyProjects } from '../types/assets'
import { Loader2Icon } from 'lucide-react'
import ProjectPreview from '../components/ProjectPreview'
import type { Project } from '..'
import { api } from '@/configs/axios'

const View = () => {
  const { projectId } = useParams()
  const [code, SetCode] = useState<string>("")
  const [loading, SetLoading] = useState<boolean>(true)

  const fetchCode = async () => {
    try {
      const { data } = await api.get(`/api/project/published/${projectId}`)
      SetCode(data.code)
      SetLoading(false)
    } catch (error) {
      console.log(error)
    }
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

export default View