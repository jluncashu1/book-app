import { useEffect, useState } from "react"
import AccountNav from "../components/AccountNav"
import axios from "axios"

import BookingDates from "../components/BookingDates";
import { Link } from "react-router-dom";
// import { differenceInCalendarDays, format } from "date-fns";

const BookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    useEffect(() => {
        axios.get('/bookings').then(res => {
            setBookings(res.data)
        })
    }, [])

    if (bookings.length === 0) {
        return (
            <div className="w-full h-[80vh] flex justify-center items-center">
                <img src="/loading.gif" width={100} />
            </div>
        )
    }

    return (
        <div>
            <AccountNav />
            <div>
                {bookings?.length > 0 && bookings.map((booking, idx) => (
                    <Link to={`/account/bookings/${booking._id}`} className="flex gap-4 rounded-xl overflow-hidden shadow-md mb-4" key={idx}>
                        {booking.place.photos?.length > 0 && (
                            <div className="hidden sm:block sm:w-48 sm:h-48">
                                <img className="object-cover h-full w-full" src={booking.place.photos[idx]} alt="" />
                            </div>
                        )}
                        <div className="py-3 pr-3 grow flex flex-col items-center sm:block">
                            <h2 className="text-xl">{booking.place.title}</h2>
                            <div className="text-xl">
                                <BookingDates booking={booking} className="mb-2 mt-4 text-gray-500" />
                                <div className="flex gap-1 w-fit sm:w-auto mx-auto">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                                    </svg>
                                    <span className="text-xl">
                                        Total price: ${booking.price}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default BookingsPage