import { useUser } from '@clerk/react'
import { Loader2Icon } from 'lucide-react'
import { useEffect, useState } from 'react'

const Loading = () => {
    const [loading, SetLoading] = useState<boolean>(false)
    const {user} = useUser()
    const effect = () => {
        SetLoading(true)
        window.location.href = "/"
        SetLoading(false)
    }
    useEffect(() => {
        effect()
    }, [user])

    return !loading ? (
        <div className='h-screen flex flex-col'>
            <div className='flex items-center justify-center flex-1'>
                <Loader2Icon className='size-7 animate-spin text-indigo-200' />
            </div>
        </div>
    ) : (
        <div>
            Loading...
        </div>
    )
}

export default Loading