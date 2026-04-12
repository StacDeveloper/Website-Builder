import React, { useState } from 'react'
import { useParams } from 'react-router-dom'

const View = () => {
  const {projectId} = useParams()
  const [code, SetCode] = useState<string>("")
  const [loading, SetLoading] = useState<boolean>(true) 
  return (
    <div>View</div>
  )
}

export default View