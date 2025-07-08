import React ,{useEffect,useState} from 'react'
import { X, LogOut, User } from 'lucide-react'
import Profile from '../assets/Profile.png'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie';

import axios from 'axios';

import { useAuth } from '../context/AuthProvider';

const Sidebar = () => {
 const user=JSON.parse(localStorage.getItem('user'));
  console.log(user);  
  const[,setAuthUser]=useAuth();
  const navigate=useNavigate();


  const handleLogout=async()=>{
  try{
   const {data}= await axios.get("http://localhost:4002/api/v1/user/logout",{
    withCredentials: true,
  })
    localStorage.removeItem('user');
    localStorage.removeItem('token')
    // Cookies.remove('jwt');
    alert(data.message);
    setAuthUser(null);
    navigate('/login');   
  
  }catch(error){  
    alert(error?.response?.data?.error || "Logout failed");
    console.error("Logout error:", error);
  }

  }
  return (
    <div className='h-full flex flex-col bg-[#232327] text-white border-b '>
        {/* Header*/}
    <div className='p-4 border-b border-gray-700 flex items-center justify-between'>
        <div className='text-xl font-bold text-white'>deepSeek</div>
        <button >
        <X className='w-6 h-4 text-gray-500 bg-transparent '/></button>
    </div>
    {/* History*/}
    <div className='flex-1 overflow-y-auto px-4 py-3 space-y-2'>
     <button   className='w-full bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl mb-1  '>+New Chat</button>
     <div className='text-gray-500 text-sm mt-10 text-center'>No Chat history yet</div>
    </div>
    {/* Footer*/}
   <div className='p-4 border-t border-gray-700 '>
    <div className='flex flex-col gap-3'>
        <div className='flex flex-center gap-2 cursor-pointer'>
        <img  className='rounded-full  w-8 h-8' src={Profile} alt=" "></img>
        <span className='text-gray-300'>{user?user.firstname+" "+user.lastname:"My Profile"}</span>
       </div>
       <button onClick={handleLogout} className='flex items-center gap-2 text-white px-4 py-2 bg-transparent rounded-lg bg-gray-500 hover:bg-gray-700 duration-300 transition'>
        <LogOut  className=''/>Logout</button>
    </div>
    </div>
    </div>
  )
}

export default Sidebar