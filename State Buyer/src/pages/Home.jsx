import React, { useEffect, useState } from 'react'
import ListingItem from '../Components/ListingItem';
import { Link } from 'react-router-dom'
import {Swiper ,SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';


function Home() {
  const[offerListing, setOfferListing] = useState([]);
  const[rentListing , setRentListing] = useState([]);
  const[saleListing , setSaleListing] = useState([]);
  SwiperCore.use([Navigation]);
console.log(saleListing);
  useEffect(()=>{
    const fetchOfferListings = async() =>{
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListing(data)
        fetchRentListings()
      } catch (error) {
        console.log(error);
      }
    }

    const fetchRentListings = async() =>{
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListing(data);
        fetchSaleListings()
      } catch (error) {
        console.log(error);
      }
    }

    const fetchSaleListings = async() =>{
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setSaleListing(data);

      } catch (error) {
        console.log(error);
      }
    }
    fetchOfferListings()
  },[])
  return (
    <div>
      <div className='top flex flex-col gap-6 p-28 px-3 mx-auto max-w-7xl '>
        <h1 className='text-4xl font-bold text-slate-600 '>Find your next <span className='text-slate-500'>perfect</span> 
        <br />place with ease</h1>
        <div className='text-base font-semibold text-slate-400'>
        निवारा_ Estate will help you to find your home Fast, easy and comfortable
        <br />Our expert support are always available.
        </div>
        <Link className='text-blue-700 text-base hover:underline font-semibold' to={'/search'}>
          Let's get started...
        </Link>
      </div>
    <Swiper navigation>

      {offerListing && offerListing.length > 0 
      && offerListing.map((listing) => (
       <SwiperSlide>
          <div style={{ background : `url(${listing.imageUrls[0]}) center no-repeat`, backgroundSize:'cover'}} 
          className='h-[500px] w-full' key={listing.id}></div>
       </SwiperSlide>
      ))}
    </Swiper>

    <div className='max-w-8xl mx-auto  p-5 flex flex-col items-center justify-center gap-8 my-10'>
      {offerListing && offerListing.length > 0 &&(
        <div>
          <div className='my-3'>
            <h1 className='font-semibold text-slate-600 text-2xl'>Recent Offers </h1>
            <Link className='text-blue-700 font-semibold text-sm underline' to={'/search?offer=true'}>
              Show more offers
            </Link>
          </div>
          <div className='flex flex-wrap p-3 gap-4'>
            
              {offerListing.map((listing)=>(
                  <ListingItem listing={listing} key={listing._id} />
              ))}
          </div>
        </div>
      ) 
      }
      {rentListing && rentListing.length > 0 &&(
        <div>
          <div className='my-3'>
            <h1 className='font-semibold text-slate-600 text-2xl'>Recent palces for Rent </h1>
            <Link className='text-blue-700 font-semibold text-sm underline' to={'/search?type=rent'}>
              Show more palces for Rent
            </Link>
          </div>
          <div className='flex flex-wrap p-3 gap-4'>
            
              {rentListing.map((listing)=>(
                  <ListingItem listing={listing} key={listing._id} />
              ))}
          </div>
        </div>
      ) 
      }
      {saleListing && saleListing.length > 0 &&(
        <div>
          <div className='my-3'>
            <h1 className='font-semibold text-slate-600 text-2xl'>recent places for Sale</h1>
            <Link className='text-blue-700 font-semibold text-sm underline' to={'/search?type=sale'}>
             Show more Places for Sale
            </Link>
          </div>
          <div className='flex flex-wrap p-3 gap-4'>
            
              {saleListing.map((listing)=>(
                  <ListingItem listing={listing} key={listing._id} />
              ))}
          </div>
        </div>
      ) 
      }

    </div>



    </div>
  )
}

export default Home