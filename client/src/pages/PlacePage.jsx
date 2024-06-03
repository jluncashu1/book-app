import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import BookingWidget from '../components/BookingWidget';

const PlacePage = () => {
    const { id } = useParams();
    const [place, setPlace] = useState(null);
    const [showAllPhotos, setShowAllPhotos] = useState(false);

    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get(`/places/${id}`).then(response => {
            setPlace(response.data);
        })
    }, [id]);

    if (!place) return ''

    if (showAllPhotos) {
        return (
            <div className='max-w-6xl inset-0 mt-8 my-auto min-h-full'>
                <div className='p-8 w-full grid gap-4 justify-items-center'>
                    <div>
                        <button onClick={() => setShowAllPhotos(false)} className='flex left-[50%] -translate-x-1/2 top-24 gap-1 py-2 px-4 rounded-2xl bg-white shadow-md text-gray-500 fixed hover:text-primary'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" />
                            </svg>
                            Close Photos
                        </button>
                    </div>
                    {place?.photos?.length > 0 && place.photos.map((photo, index) => (
                        <div key={index}>
                            <img src={place.photos[index]} alt="" />
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className='mt-8 bg-gray-100 -m-8 px-8 pt-8'>
            <h1 className='text-3xl'>{place?.title}</h1>
            <a className='my-2 font-semibold underline flex gap-2 hover:text-primary' target='blank' href={`https://maps.google.com/?q=${place.address}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                {place.address}
            </a>
            <div className="relative">
                <div className='grid gap-2 grid-cols-[2fr_1fr] relative rounded-xl overflow-hidden'>
                    <div>
                        {place.photos?.[0] && (
                            <div className=''>
                                <img onClick={() => setShowAllPhotos(true)} className='aspect-square object-cover max-h-[720px] cursor-pointer' src={place.photos[0]} />
                            </div>
                        )}
                    </div>
                    <div className='grid'>
                        {place.photos?.[1] && (
                            <img onClick={() => setShowAllPhotos(true)} className='aspect-square object-cover cursor-pointer' src={place.photos[1]} />
                        )}
                        <div className='overflow-hidden'>
                            {place.photos?.[2] && (
                                <img onClick={() => setShowAllPhotos(true)} className='aspect-square object-cover relative top-2 cursor-pointer' src={place.photos[2]} />
                            )}
                        </div>
                    </div>
                </div>
                <button onClick={() => setShowAllPhotos(true)} className='flex gap-1 absolute bottom-2 right-2 py-2 px-4 bg-white rounded-2xl shadow-md shadow-gray-500 hover:text-primary'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clipRule="evenodd" />
                    </svg>
                    Show more photos
                </button>
            </div>
            <div className='grid gap-8 my-8 grid-cols-1 md:grid-cols-[2fr_1fr]'>
                <div>
                    <div className='my-4'>
                        <h2 className='font-semibold text-2xl'>Description</h2>
                        {place.description}
                    </div>
                    <b>Check-in:</b> {place.checkIn}:00
                    <br />
                    <b>Check-out:</b> {place.checkOut}:00
                    <br />
                    <b>Max number of guests:</b> {place.maxGuests} persons
                </div>
                <div>
                    <BookingWidget place={place} />
                </div>
            </div>
            <div className='bg-white -mx-8 p-8 border-t'>
                <div>
                    <h2 className='font-semibold text-2xl mt-4'>Extra Info</h2>
                </div>
                <div className='text-sm text-gray-700 leading-4 mb-4 mt-1'>{place?.extraInfo}</div>
            </div>
        </div>
    )
}

export default PlacePage