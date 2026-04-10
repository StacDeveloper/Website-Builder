import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Pricing from './pages/Pricing'
import Projects from './pages/Projects'
import MyProjects from './pages/MyProjects'
import Preview from './pages/Preview'
import Community from './pages/Community'
import View from './pages/View'
import Navbar from './components/Navbar'


const App: React.FC = () => {

  const { pathname } = useLocation()
  const hideNavBar = pathname.startsWith("/projects/") && pathname !== "/projects" || pathname.startsWith("/view/") || pathname.startsWith("/preview/")

  return (
    <div>

      <img src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/refs/heads/main/assets/hero/bg-gradient-2.png" className="absolute inset-0 -z-10 size-full opacity" alt="" />
      
      {!hideNavBar && <Navbar />}
      <Routes>
        <Route>
          <Route path='/' element={<Home />} />
          <Route path='/pricing' element={<Pricing />} />
          <Route path='/projects/:projectId' element={<Projects />} />
          <Route path='/projects' element={<MyProjects />} />
          <Route path='/preview/:projectId' element={<Preview />} />
          <Route path='/preview/:projectId/:versionId' element={<Preview />} />
          <Route path='/community' element={<Community />} />
          <Route path='/view/:projectId' element={<View />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App