import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import PlaceGallery from "../components/PlaceGallery";
import BookingDates from "../components/BookingDates";

const BookingPage = () => {

    const { id } = useParams();
    const [booking, setBooking] = useState(null);

    useEffect(() => {
        if (id) {
            axios.get('/bookings').then(response => {
                const foundBooking = response.data.find(({ _id }) => _id === id)
                if (foundBooking) {
                    setBooking(foundBooking);
                }
            })
        }
    }, [id])


    if (!booking) {
        return ''
    }

    return (
        <div className="my-8">
            <h1 className="text-3xl">{booking.place.title}</h1>
            <a className='my-2 font-semibold underline flex gap-2 hover:text-primary' target='blank' href={`https://maps.google.com/?q=${booking.place.address}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                {booking.place?.address}
            </a>
            <div className="bg-gray-200 p-6 my-6 rounded-2xl sm:flex items-center justify-between">
                <div className="flex flex-col items-center sm:block">
                    <h2 className="text-2xl mb-4">Your booking information:</h2>
                    <BookingDates booking={booking} />
                </div>
                <div className="bg-primary p-6 flex justify-between mt-5 sm:mt-0 items-center sm:block text-white rounded-2xl">
                    <div>Total price</div>
                    <div className="text-3xl">${booking.price}</div>
                </div>
            </div>
            <PlaceGallery place={booking.place} />
        </div>
    )
}

export default BookingPage