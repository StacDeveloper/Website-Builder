import React, { useEffect } from 'react'
import { useState } from 'react'
import { assets } from '../types/assets'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { api } from '@/configs/axios'
import { getToken, useClerk, UserButton, useUser } from '@clerk/react'

const Navbar: React.FC = () => {

    const [menuOpen, setMenuOpen] = useState<boolean>(false)
    const navigate = useNavigate()
    const { openSignIn } = useClerk()
    const [credits, SetCredits] = useState<number>(0)
    const { user } = useUser()
    const getCredits = async () => {
        try {
            const token = await getToken()
            const { data } = await api.get("/api/user/credits", { headers: { Authorization: `Bearer ${token}` } })
            console.log("data-credits:", data.credits)
            SetCredits(data.credits)
        } catch (error: any) {
            toast.error(error?.data?.message || error.message)
        }
    }
    useEffect(() => {
        if (user) {
            getCredits()
        }
    }, [user])



    return (
        <>
            <nav className="z-50 flex items-center justify-between w-full py-4 px-4 md:px-16 lg:px-24 xl:px-32 backdrop-blur border-b text-white border-slate-800">
                <Link to="/">
                    <img src={assets.logo} alt="logo" className='h-5 sm:h-7' />
                </Link>

                <div className="hidden md:flex items-center gap-8 transition duration-500">
                    <Link to="/" className="hover:text-slate-300 transition">Home</Link>
                    <Link to="/projects" className="hover:text-slate-300 transition">My Projects</Link>
                    <Link to="/community" className="hover:text-slate-300 transition">Community</Link>
                    <Link to="/pricing" className="hover:text-slate-300 transition">Pricing</Link>

                </div>

                {!user ? (<div className="flex items-center gap-3">
                    <button onClick={() => openSignIn()} className="px-6 py-1.5 max-sm:text-sm bg-indigo-600 active:scale-95 hover:bg-indigo-700 transition rounded">
                        Get started
                    </button>
                    <button id="open-menu" className="md:hidden active:scale-90 transition" onClick={() => setMenuOpen(true)} >
                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5h16" /><path d="M4 12h16" /><path d="M4 19h16" /></svg>
                    </button>
                </div>) : (
                    <>
                        <button className='bg-white/10 px-6 py-1.5 text-xs sm:text-sm border text-gray-200 rounded-full'>Credits:  <span className='text-indigo-300'>{credits}</span></button>
                        <UserButton />
                    </>
                )}

            </nav>
            {menuOpen && (
                <div className="fixed inset-0 z-[100] bg-black/60 text-white backdrop-blur flex flex-col items-center justify-center text-lg gap-8 md:hidden transition-transform duration-300">
                    <Link to="/" onClick={() => setMenuOpen(false)}>Products</Link>
                    <Link to="/projects" onClick={() => setMenuOpen(false)}>My Projects</Link>
                    <Link to="/community" onClick={() => setMenuOpen(false)}>Community</Link>
                    <Link to="/pricing" onClick={() => setMenuOpen(false)}>Pricing</Link>

                    <button className="active:ring-3 active:ring-white aspect-square size-10 p-1 items-center justify-center bg-slate-100 hover:bg-slate-200 transition text-black rounded-md flex" onClick={() => setMenuOpen(false)} >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                    </button>
                </div>
            )}
        </>
    )
}

export default Navbar