import { FaSearchDollar } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";



function Header() {
const{currentUser} = useSelector((state) => state.user)
const[serachTerm , setSearchTerm] = useState('')
const navigate = useNavigate()

const handleSubmit = (e) =>{
   e.preventDefault();
   const urlParmas = new URLSearchParams(window.location.search);
   urlParmas.set('searchTerm',serachTerm);
   const searchQuery = urlParmas.toString();
   navigate(`/search?${searchQuery}`)
}

useEffect(()=>{
   const urlParmas = new URLSearchParams(location.search);
   const searchTermfromUrl = urlParmas.get('searchTerm');
   if(searchTermfromUrl){
      setSearchTerm(searchTermfromUrl)
   }
})

  return (
    <header className='bg-slate-200 shadow-md'>
       <div className='flex items-center justify-between max-w-6xl mx-auto p-4'>
       <h1 className='font-bold flex flex-wrap text-2sm sm:text-2xl'>
            <span className='text-slate-700 text-3xl '>___निवारा___</span>
            
        </h1>
     <form onSubmit={handleSubmit} className='bg-slate-100 p-2  rounded-lg flex items-center justify-between' >
        <input type="text" 
        placeholder='Serach....' 
        value={serachTerm}
        onChange={(e)=> setSearchTerm(e.target.value)}
        className='bg-transparent text-lg focus:outline-none w-44 sm:w-64'/>
        <button>
        <FaSearchDollar className="text-slate-500 text-xl " />
        </button>
     </form>
        <ul className="flex items-center gap-x-7 font-bold">
            <Link to='/'>
            <li className="hidden sm:inline text-slate-700 hover:underline " >Home</li>
            </Link>
            <Link to='/about' >
            <li className="hidden sm:inline text-slate-700 hover:underline">About</li>
            </Link>
            <Link to='/profile'>
               {currentUser ? (
                  <img className="h-7 w-7 rounded-full z-10" src={currentUser.avtar}  />
               ) : (
                  <li className=" text-slate-700 hover:underline">Sign in</li>
               )}
            </Link>
        </ul>
   </div>
    </header>
  )
}

export default Header