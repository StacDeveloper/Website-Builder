import React, { useEffect, useState } from 'react'
import type { Project } from '..'
import { Loader2Icon, TrashIcon } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { dummyProjects } from '../types/assets'
import Footer from '../components/Footer'
import { api } from '@/configs/axios'
import { authClient } from '@/lib/auth-client'

const Community = () => {
  const { data: session } = authClient.useSession()
  const [loading, SetLoading] = useState<boolean>(true)
  const [projects, SetProjects] = useState<Project[]>([])
  const navigate = useNavigate()

  const fetchProjects = async () => {
    try {
      const { data } = await api.get("/api/project/published")
      
      SetProjects(data.projects)
      SetLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [session?.user])

  return (
    <div className='px-4 md:px-16 lg:px-24 xl:px-32'>
      {loading ? (
        <div className='flex items-center justify-center h-[80vh]'>
          <Loader2Icon className='size-7 animate-spin text-indigo-200' />
        </div>
      ) : projects.length > 0 ? (
        <div className='py-10 min-h-[80vh]'>
          <div className='flex items-center justify-between mb-12'>
            <h1 className='text-2xl font-medium text-white'>Published Projects</h1>
          </div>

          <div className='flex flex-wrap gap-3.5'>
            {projects.map((proj) => (
              <Link
                to={`/view/${proj.id}`}
                key={proj.id} target='_blank' className='w-72 max-sm:max-auto cursor-pointer bg-gray-900/60 border border-gray-700 rounded-lg overflow-hidden hover:border-indigo-800/80 transition-all duration-300 hover:opacity-50'>
                <div className='relative w-full h-40 bg-gray-900 overflow-hidden border-b border-gray-800'>
                  {proj.current_code ? (
                    <iframe
                      srcDoc={proj.current_code}
                      className='absolute top-0 left-0 w-[1200px] h-[800px] origin-top-left pointer-events-none'
                      sandbox='allow-scripts allow-same-origin'
                      style={{ transform: 'scale(0.25)' }}
                    />
                  ) : (
                    <div className='flex items-center justify-center h-full text-gray-500'>
                      No Preview
                    </div>
                  )}
                </div>
                <div className='p-4 text-white bg-linear-180 from-transparent group-hover:from-indigo-950 to-transparent transition-colors'>
                  <div className='flex items-start justify-between'>
                    <h2 className='text-lg font-medium line-clamp-2'>{proj.name}</h2>
                    <button className='px-2.5 py-0.5 mt-1 ml-2 text-xs bg-gray-800 border border-gray-700 rounded-full'>Website</button>
                  </div>
                  <p className='text-gray-400 mt-1 text-sm line-clamp-1'>{proj.initial_prompt}</p>
                  <div className='flex justify-between items-center mt-6'>
                    <span className='text-xs text-gray-500'>{new Date(proj.createdAt).toLocaleDateString()}</span>
                    <div className='flex gap-3 text-white text-sm'>
                      <button className='px-3 py-1.5 bg-white/10 hover:bg-white/15 rounded-md  transition-colors flex items-center gap-2 '><span className='bg-gray-200 size-4.5 rounded-full text-black font-semibold flex items-center justify-center'>{proj?.user?.name?.slice(0, 1)}</span>{proj?.user?.name}</button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center h-[80vh]'>
          <h1 className='text-3xl font-medium text-gray-300'>You have no projects yet</h1>
          <button onClick={() => navigate("/")} className='text-white px-5 py-2 mt-5 rounded-md bg-indigo-500 hover:bg-indigo-600 active:scale-95 transition-all'>
            Create New
          </button>
        </div>
      )}
      <Footer />
    </div>
  )
}

export default Community