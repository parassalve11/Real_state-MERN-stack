import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper'
import { useSelector } from "react-redux"
import { Navigation } from "swiper/modules";
import 'swiper/css/bundle';
import { FaShare } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";
import { LuBedSingle } from "react-icons/lu";
import { MdOutlineBathroom } from "react-icons/md";
import { LuParkingCircle } from "react-icons/lu";
import { GiWoodenChair } from "react-icons/gi";
import Contact from "../Components/Contact"

export default function Listing() {
    SwiperCore.use([Navigation]);
    const[error,setError] = useState(false);
    const[loading,setLoading] = useState(false);
    const[listing,setListing] = useState(null)
    const[copied,setCopied] = useState(false)
    const[contact,setContact] = useState(false)
    const parmas = useParams();
    const {currentUser} = useSelector((state) => state.user)
    
    useEffect(() => {
       const fetchListing = async() =>{
      
        try {
            setLoading(true);
            const res = await fetch(`/api/listing/get/${parmas.listingId}`);
            const data = await res.json();
            if (data.success === false) {
              setError(true);
              setLoading(false);
              return;
            }
            setListing(data);
            setLoading(false);
            setError(false);
          } catch (error) {
            setError(true);
            setLoading(false);
          }
       }
       fetchListing()
    },[parmas.listingId])

  return (
   <div>
     <div>{loading && <p className="text-center pt-2 text-2xl font-semibold">Loading...</p>}</div>
     <div>{error && (<p className="text-center text-2xl text-red-700">Somthing went Wrong!!</p>)}</div>
     <div>{listing && !loading && !error && 
    (
        <div>
            <Swiper navigation>
                {listing.imageUrls.map((url) => (
                    <SwiperSlide  key={url}>
                        <div className="h-[80vh] w-[100%]" style={{background:`url(${url}) center no-repeat`,
                            backgroundSize:'cover'}}>

                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            <div className="fixed top-[13%] right-[3%] z-10 border rounded-full 
            flex items-center justify-center h-12 w-12 cursor-pointer bg-slate-100">
            <FaShare 
            className="text-slate-500"
            onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);

                setTimeout(() => {
                    setCopied(false);
                }, 2000);
            }}
             />
        </div>

            {copied && (
                <p className="fixed top-[21%] right-[1%] z-10 rounded-md bg-slate-100 p-2">Link Copied</p>
            )}

                <div className="flex flex-col max-w-7xl mx-auto p-3 my-7 gap-4 pl-5">
                    <p className="font-semibold text-2xl">
                        {listing.name } - ${''}
                        {listing.offer ? listing.discountPrice.toLocaleString('en-IN'):
                        listing.regularPrice.toLocaleString('en-IN')}
                        {listing.type ==='rent' && '/ month'}
                    </p>
                    <p className="flex items-center gap-2 text-slate-600 text-sm ">
                    <FaMapMarkerAlt className="text-green-700" />
                    {listing.address}
                    </p>
                    <div className="flex gap-4">
                        <p className="bg-red-700 w-full max-w-[200px] text-white rounded-md p-2 text-center">
                            {listing.type === 'rent' ? 'For Rent' : 'For Sale'}</p>

                            {listing.offer && (
                                <p className="bg-green-700 p-2 w-full max-w-[200px] text-white rounded-md text-center font-semibold">
                                    ${+listing.regularPrice - +listing.discountPrice} discount</p>
                            )}

                    </div>
                    {listing.description && (
                    <p className="text-black"><span className="font-semibold text-slate-950 ">
                        Description -</span>{ listing.description}</p>)} 
                        <ul className=" flex flex-wrap  items-center gap-6 text-green-700 font-semibold text-sm whitespace-nowrap">
                            <li className="flex items-center gap-1">
                            <LuBedSingle className="text-xl text-green-700" />
                            {listing.bedrooms > 1 ? `${listing.bedrooms} beds`:
                            `${listing.bedrooms} bed`}
                            </li>
                            <li className="flex items-center gap-1">
                            <MdOutlineBathroom  className="text-xl text-green-700" />
                            {listing.bathrooms > 1 ? `${listing.bathrooms} baths`:
                            `${listing.bedrooms} bath`}
                            </li>
                            <li className="flex items-center gap-1">
                            <LuParkingCircle   className="text-xl text-green-700" />
                            {listing.parking ? 'Parking spot' : 'No Parking'}
                            </li>
                            <li className="flex items-center gap-1">
                            <GiWoodenChair    className="text-xl text-green-700" />
                            {listing.furnished ? 'Furnished' : 'Unfurnished'}
                            </li>
                        </ul>
                       <div className="flex  my-7">
                        {currentUser && listing.userRef !== currentUser._id && !contact &&
                        (
                            <button onClick={() => setContact(true)} className=" bg-slate-700 text-base text-center p-3 border font-bold text-white w-full max-w-[30vw] rounded-md uppercase hover:opacity-95"
                            >Contact Landlord</button>
                        )}
                        {contact && <Contact listing={listing}/> }
                      
                       </div>
                </div>
                              
        </div>

        


    )
     
     }</div>
   
   </div>
    
  )
}
