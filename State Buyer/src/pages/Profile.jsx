
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import { app } from '../firebase'
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserFailure, deleteUserStart , deleteUserSuccess, signOutUserStart,  signOutUserSuccess, signOutUserFailure} from '../redux/User/user.Slice'
import { Link } from 'react-router-dom'
import Listing from '../../../api/models/listing.model'

function Profile() {
  const{currentUser , lodading , error} = useSelector(state => state.user)
  const fileRef = useRef(null)
  const[file , setFile] = useState(undefined)
  const[filePerc,setfilePerc] = useState(0)
  const[fileUploadErr,setFileUploadErr] = useState(false)
  const[fromData,setFromData] = useState({})
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingError, setShowListingError] = useState(false);
  const[deleteListingError, setDeleteListingError] = useState(false);
  const[userListing , setUserListing] = useState([]);

  const dispatch = useDispatch();
  
  useEffect(() => {
    if(file){
      handleFileUpload(file);
    }
  },[file])

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef , file);

    uploadTask.on('state_changed',
    (snapshot) =>{
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes ) * 100;
     setfilePerc(Math.round(progress))
    },
    (error)=>{
      setFileUploadErr(true);
    },
    () =>{
      getDownloadURL(uploadTask.snapshot.ref).then
      ((downloadURL) => setFromData({ ...fromData, avtar: downloadURL})
      );
    }
    );
  };

  const handleChange = (e) => {
    setFromData({ ...fromData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fromData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOutUser = async() =>{
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout',{
        method:'GET',
      })
      const data = await res.json();
      if(data.success === false){
        dispatch(signOutUserFailure(data.message));
      }
      dispatch(signOutUserSuccess(data))
      return;
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }

  const handleShowListings = async() =>{
    try {
      setShowListingError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();

      if(data.success === false){
        setShowListingError(true)
        return;
      }
      setUserListing(data)
    } catch (error) {
      setShowListingError(true);
    }
  };

  const handleListingDelete = async(listingId) =>{
    try {
      setDeleteListingError(false);
      const res = await fetch(`/api/listing/delete/${listingId}`,{
        method:'DELETE',
      })
      const data = await res.json();
      if(data.success === false){
        setDeleteListingError(true);
      }

      setUserListing((prev)=>prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      setDeleteListingError(true)
    }
  }

  return (
    <div className='p-3 max-w-lg m-auto'>
      <h1 className='text-3xl text-center my-7 font-semibold'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-y-4'> 
      <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept='image/.*' />
        <img onClick={() => fileRef.current.click()} className='rounded-full h-24 w-24 object-cover mt-2 self-center' src={fromData.avtar || currentUser.avtar} alt="profile" />
        <p className='text-sm self-center'>
          {fileUploadErr ? (
            <span className='text-red-500'>Error while Image 
            Upload(Image must be less than 2MB )!!</span>
          ) : filePerc > 0 && filePerc === 90 ? (
            <span className='text-slate-500'>{`Uploading ${filePerc}%`}</span>
          ) : filePerc > 90 && filePerc === 100 ? (
            <span className='text-green-500'>Image Uploaded successfully!!</span>
          ) : (
            ""
          )}
          </p>
      <input type="text" placeholder='username' defaultValue={currentUser.username} className='border p-3 rounded-xl ' id='username' onChange={handleChange}/>
      <input type="email" placeholder='email' defaultValue={currentUser.email} className='border p-3 rounded-xl ' id='email' onChange={handleChange} />
      <input type="password" placeholder='password' className='border p-3 rounded-xl ' id='password' onChange={handleChange} />
      <button disabled={lodading} className='bg-slate-700 p-3 text-white uppercase rounded-xl hover:opacity-95 disabled:opacity-80'>{lodading ? "UPDATE..." : "UPDATE"}</button>
      <Link to={'/create-listing'} disabled={lodading} className='bg-green-700 p-3 text-white uppercase text-center rounded-xl hover:opacity-95 disabled:opacity-80'>{lodading ? "create Listing..." : "Create Listing"}</Link>
      </form>
      <div className='flex items-center justify-between p-3 text-red-700 font-medium cursor-pointer'>
        <span onClick={handleDeleteUser} >Delete Account ?</span>
        <span onClick={handleSignOutUser}>SignOut Account ?</span>
      </div>


      <p className='text-red-700 font-semibold'>{error ? error : " "}</p>
      <p className='text-green-700 font-semibold'>{updateSuccess ? 'User updated Successfully!!' : " "}</p>
      <button onClick={handleShowListings} className='text-green-700 text-xl font-semibold w-full'>Show Listings</button>
      <p className='text-red-700 text-sm'>{showListingError ? "Error while show Listing !" : ""}</p>
         {userListing && userListing.length > 0 && 
       <div className='flex flex-col '>
          <h1 className='capitalize text-2xl font-semibold my-12 mb-7 text-center'>__Your listings__</h1>
          {userListing.map((listing)=>(
          <div key={listing._id} className=' flex items-center justify-between box-border m-0 p-3 border '>
            <Link to={`/listing/${listing._id}`}>
           <div className='h-30 w-30 object-contain rounded-lg '>
           <img  src={listing.imageUrls[0]} alt="" className='h-20 w-20 object-contain'  />
           </div>
            </Link>
            <Link className='text-slate-700 font-semibold hover:underline truncate flex-1 p-2' to={`/listing/${listing._id}`} >
              <p >{listing.name}</p>
            </Link>
            <div className="flex flex-col ">
              <button onClick={() => handleListingDelete(listing._id)} className='text-red-700 uppercase '>Delete</button>
             <Link to={`/update-listing/${listing._id}`}>
             <button className='uppercase'>Edit</button>
             </Link>
            </div>

          </div>
         ))}
       </div>}
    </div>
  )
}

export default Profile