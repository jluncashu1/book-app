import { useState } from "react";
// eslint-disable-next-line react/prop-types
const PlaceGallery = ({ place = {} }) => {

    const [showAllPhotos, setShowAllPhotos] = useState(false);


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
        <div className='max-w-6xl inset-0 mt-8 my-auto min-h-full'>
            <div className='p-8 w-full grid gap-4 justify-items-center'>
                {place?.photos?.length > 0 && place.photos.map((photo, index) => (
                    <div key={index}>
                        <img src={place.photos[index]} alt="" />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PlaceGallery