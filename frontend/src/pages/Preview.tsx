import { Loader2Icon } from 'lucide-react'
import  { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ProjectPreview from '../components/ProjectPreview'
import type { Project, Version } from '..'
import { toast } from 'sonner'
import { api } from '@/configs/axios'
import { useUser } from '@clerk/react'

const Preview = () => {
  const { projectId, versionId } = useParams()
  const [code, SetCode] = useState<string>("")
  const [loading, SetLoading] = useState<boolean>(true)
  const {user} = useUser()

  const fetchCode = async () => {
    try {
      const { data } = await api.get(`/api/project/preview/${projectId}`)
      SetCode(data.project.current_code)
      if (versionId) {
        data.project.versions.forEach((ver: Version) => {
          if (ver.id === versionId) {
            SetCode(ver.code)
          }
        })
      }
      SetLoading(false)
    } catch (error: any) {
      console.log(error.message)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (user) {
      fetchCode()
    }
  }, [user])

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