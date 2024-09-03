import React, { useState } from 'react'
import { Link , useNavigate } from 'react-router-dom'
import {useDispatch, useSelector } from 'react-redux';
import { signInStart , signInSuccess , signInFailure } from '../redux/User/user.Slice';
import OAuth from '../Components/OAuth';

function SignIn() {

const[fromData , setFromData] = useState({});
const{ loading , error} = useSelector((state) => state.user)
const navigate = useNavigate()
const disPatch = useDispatch()
const handleChange = (e) => {
  setFromData({
    ...fromData,
    [e.target.id]: e.target.value,
    
  })

};
const handleSubmit = async (e) =>{
  e.preventDefault();
 try {
   disPatch(signInStart())
   const res = await fetch("api/auth/signin",{
     method:'POST',
     headers: {
       'Content-Type' : 'application/json',
     },
     body: JSON.stringify(fromData),
     
   });
 
   
   const data = await res.json();
   
   if(data.success === false){
     disPatch(signInFailure(data.message));
     return
   }
   disPatch(signInSuccess(data))
   navigate('/')
 
 } catch (error) {
 disPatch(signInFailure(error.message))
 }
};



  return (
    <div className='p-3 max-w-lg m-auto'>
  <h1 className='text-3xl text-center font-bold my-7 '>Sign-Up</h1>

  <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
   
    <input type="text" placeholder='email' id='email' className='border-2 px-11 p-2 rounded-xl' onChange={handleChange} />
    <input type="text" placeholder='password' id='password' className='border-2 px-11 p-2 rounded-xl' onChange={handleChange} />
    <button disabled={loading}  className='bg-slate-700 text-white rounded-xl p-2 hover:opacity-95 uppercase font-semibold '>{loading ? 'Sign Up...' : 'Sign Up'}</button>
    <OAuth/>
  </form>
  <div className='flex gap-x-2 mt-4 '>
    <h3>Don't Have An Account ?</h3>
    <Link to={'/signup'}>
      <span className='text-blue-700'>Sign Up</span>
    </Link>
  </div>
  {error && <p className='text-red-500 mt-5 '>{error}</p>}
  </div>
  )
}

export default SignIn