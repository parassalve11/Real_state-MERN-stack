import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useState } from 'react'
import { app } from '../firebase';
import {useSelector} from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CreateListing() {
    const{currentUser} = useSelector(state => state.user)
    const[files, setFiles] = useState([])
    const[formData, setFromData] = useState({
        imageUrls: [],
        name:'',
        description:'',
        address:'',
        type:'rent',
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 50,
        discountPrice: 0,
        offer: false,
        parking: false,
        furnished: false,
    });
    const[imageUploadError, setImageUploadError] = useState(false);
    const[uploading , setUploading] = useState(false);
    const[error, setError] = useState(false);
    const[loading, setLoading] = useState(false);

    
    const navigate = useNavigate()
   
    
    const handleImageSubmit = (e) =>{
        if(files.length > 0 && files.length + formData.imageUrls.length  < 7){
            setUploading(true);
            setImageUploadError(false)
            const promises = [];

            for(let i = 0; i < files.length ; i++){
                promises.push(storeImage(files[i]))
            }
            Promise.all(promises).then((urls) => {
                setFromData({...formData, imageUrls:formData.imageUrls.concat(urls) 
                
                });

                setImageUploadError(false)
                setUploading(false)
               
            }).catch((err) => {
                setImageUploadError("2 MB is max per image !");
                setUploading(false)
            })
        }else{
            setImageUploadError("You can Upload 6 images per listing !")
            setUploading(false)
        }
    };

    const storeImage = async(file) =>{
        return new Promise((resolve, reject ) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef,file)

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = 
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is ${progress}% Done`);
                },
               (error) =>{
                reject(error)
               } ,
               () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    });
               }
            )
        })
    }

    const handleRemoveImage = (index) => {
        setFromData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i)=> i !== index),
        });
    };

    const handleChange = (e) =>{
        if(e.target.id === 'sale' || e.target.id === 'rent'){
            setFromData({
                ...formData,
                type: e.target.id,
            })
        };

        if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
            setFromData({
                ...formData,
                [e.target.id]: e.target.checked
            })
        }

        if(e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea'){
            setFromData({
                ...formData,
                [e.target.id]: e.target.value,
            })
        }
    };

  const handleSubmit = async(e) =>{
    e.preventDefault();
    try {

        if(formData.imageUrls < 1) return setError("You must upload at least one image !");
        if(+formData.regularPrice <= +formData.discountPrice) return setError("Discounted Price must be lower than regular Price!!")

        const res = await fetch('/api/listing/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...formData,
              userRef: currentUser._id,
            }),
          });
          const data = await res.json();
          setLoading(false);
          if (data.success === false) {
            setError(data.message);
           
          }
          navigate(`/listing/${data._id}`)
    } catch (error) {
        setError(error.message);
        setLoading(true)
    }
  }

  return (
  <div className='w-full h-auto  ' >
     <main className='p-5 w-[50%] h-[130vh] overflow-hidden mx-auto  '>
    <h1 className='text-center font-bold my-7 text-4xl text-slate-700'>Create a Listing</h1>

    <form onSubmit={handleSubmit} className='flex gap-x-10 flex-wrap  sm:flex-row '>
        <div className='flex flex-col flex-1 gap-4 text-sm '>
            <input type="text" placeholder='Name' id='name' className='p-3 rounded-xl border' maxLength={62} minLength={10}  required onChange={handleChange} value={formData.name} />
            <input type="text" placeholder='Description' id='description' className='p-4 rounded-xl border'  required onChange={handleChange} value={formData.description} />
           <input type="text" placeholder='Address' id='address' className='p-3 rounded-xl border' required  onChange={handleChange} value={formData.address} /> 
        
           <div className='flex gap-x-10 flex-wrap'>
            <div className='flex  gap-2'>
                <input type="checkbox" id='sale' className='w-[20px]' onChange={handleChange} checked={formData.type === 'sale'} />
                <span className='text-lg'>Sell</span>
            </div>
            <div className='flex  gap-2'>
                <input type="checkbox" id='rent' className='w-[20px]' onChange={handleChange} checked={formData.type === 'rent'} />
                <span className='text-lg'>Rent</span>
            </div>
            <div className='flex gap-2'>
                <input type="checkbox" id='parking' className='w-[20px]' onChange={handleChange} checked={formData.parking} />
                <span className='text-lg'>Parking spot</span>
            </div>
            <div className='flex gap-2'>
                <input type="checkbox" id='furnished' className='w-[20px]' onChange={handleChange} checked={formData.furnished} />
                <span className='text-lg'>Furnished</span>
            </div>
            <div className='flex gap-2 my-3'>
                <input type="checkbox" id='offer' className='w-[20px]' onChange={handleChange} checked={formData.offer} />
                <span className='text-lg'>Offer</span>
            </div>
        </div>

            <div className=' flex flex-wrap  gap-8'>
                <div className='flex items-center gap-2 '>
                    <input type="number" id='bedrooms' min={1} max={10} defaultValue={1}  className='p-3 border-gray-300 rounded-xl' required onChange={handleChange} checked={formData.bedrooms} />
                    <span className='text-lg'>Beds</span>
                </div>
                <div className='flex items-center gap-2 '>
                    <input type="number" id='bathrooms' min={1} max={10} defaultValue={1}  className='p-3 border-gray-300 rounded-xl' required onChange={handleChange} checked={formData.bathrooms} />
                    <span className='text-lg'>Baths</span>
                </div>
                <div className='flex  items-center gap-2 '>
                    <input type="number" id='regularPrice' min={50} max={100000000} defaultValue={50} className='p-3 border-gray-300 rounded-xl' required onChange={handleChange} checked={formData.regularPrice}/>
                    <div className='flex flex-col items-center justify-center '>
                    <span className='text-lg'>$Regular Price</span>
                    <span className='text-xs'>($ / Mounth)</span>
                  
                    </div>
                </div>

                {formData.offer && (
                      <div className='flex items-center gap-2 '>
                      <input type="number" id='discountPrice' min={0} max={100000000} defaultValue={50}  className='p-3 border-gray-300 rounded-xl' required onChange={handleChange} checked={formData.discountPrice} />
                      <div className='flex flex-col items-center justify-center'>
                      <span className='text-lg'>$Discounted Price</span>
                      <span className='text-xs'>($ / Mounth)</span>
                      </div>
                  </div>
                )}
              
            </div>
            
     
      
        </div>

      <div className=' w-[50%] mt-5  '>
      <div className='flex  flex-1 gap-3'>
        <span className='font-semibold text-base '>Images:</span>
        <span className='font-normal text-gray-600 ml-2 text-base'>The first image will be cover (max 6)!!</span>
       </div>
        <div className='flex gap-5'> 
            <input onChange={(e) => setFiles(e.target.files)} className='p-3 border mt-6 mb-5 border-gray-300 w-full rounded-lg' type="file" id='images' accept='image/*' multiple />
            
            <button disabled={uploading} onClick={handleImageSubmit} className="border mt-6 border-green-700 mb-5 text-green-700 p-2 rounded-lg uppercase hover:shadow-xl hover:opacity-80 ${uploading ? 'uploading-class' : 'upload-class'}` ">
                { uploading ? "Uploading..." : "Upload"}</button>
            
        </div>
        <p className='text-red-700 text-sm'>
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((urls, index) => (
              <div key={urls} className='flex justify-between border items-center'>
             
                
                <img
                  src={urls}
                  alt='listing image'
                  className='w-20 h-20 object-contain   '/>
            
                <button
                  type='button'
                  onClick={() => handleRemoveImage(index)}
                  className='p-3 text-red-700 rounded-lg uppercase  hover:opacity-75 cursor-pointer '
                >
                  Delete
                </button>
              </div>
            ))}
      <button
            disabled={loading || uploading}
            className='p-3 bg-slate-700 text-white w-full rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
          >
            {loading ? 'Creating...' : 'Create listing'}
          </button>
          {error && <p className='text-red-700 text-sm'>{error}</p>}
      </div>
      
    </form>

   </main>
  </div>
  )
}
