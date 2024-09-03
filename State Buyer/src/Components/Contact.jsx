import  { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
export default function Contact({listing}) {
    const[landlord,setLandlord] = useState(null)
    const[error,setError] = useState(false)
    const[message,setMessage] = useState(null)

    const onChange = (e) =>{
        setMessage(e.target.value)
    }

    useEffect(()=>{
        const fetchLandLord = async() =>{
            try {
                const res = await fetch(`/api/user/${listing.userRef}`);
                const data = await res.json();
                if(data.success === false){
                    setError(true);
                }
                setLandlord(data)
                setError(false)
            } catch (error) {
                console.log(error)
                setError(true)
            }
        }

        fetchLandLord()
    },[listing.userRef])
  return (
    <div>
        {landlord && (
            <div className='flex flex-col gap-4'>
                <p>Contact - <span className='font-semibold'>/{landlord.username}
                </span> for <span className='font-semibold'>{listing.name}</span> </p>
                <textarea name="message" placeholder='send message...' id="message"  rows="7" 
                value={message} onChange={onChange} 
                className='w-full p-3 border rounded-lg'
                ></textarea>
                <Link to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
                className='bg-slate-700 text-center p-3 uppercase rounded-lg   text-white font-semibold
                hover:opacity-95'
                >Send to Landlord</Link>
            </div>
        )}
    </div>
  )
}
