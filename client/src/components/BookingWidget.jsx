import { useState, useContext, useEffect } from "react"
import { differenceInCalendarDays } from 'date-fns'
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext"


// eslint-disable-next-line react/prop-types
const BookingWidget = ({ place = {} }) => {

    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [numberOfGuests, setNumberOfGuests] = useState(1);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [redirect, setRedirect] = useState('');
    let numberOfNights = 0;

    if (checkIn && checkOut) {
        numberOfNights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn))
    }

    useEffect(() => {
        if(user) {
            setName(user.name)
        }
    }, [user])

    async function handleBooking() {

        if (!user) {
            return navigate('/login')
        } else {
            const data = {
                checkIn,
                checkOut,
                numberOfGuests,
                name,
                phone,
                price: numberOfNights * place.price,
                place: place._id
            }

            const response = await axios.post('/booking', data);
            const bookingId = response.data._id;

            setRedirect(`/account/bookings/${bookingId}`)
        }


    }

    if (redirect) {
        return <Navigate to={redirect} />
    }

    return (
        <div className='bg-white shadow p-4 rounded-2xl'>
            <div className='text-2xl text-center mb-2'>
                Price: ${place?.price} / per Night
            </div>
            <div className='border rounded-2xl'>
                <div className='flex'>
                    <div className='p-2 border-r items-center'>
                        <label htmlFor="">Check In:</label>
                        <input value={checkIn} className="w-[80%]" onChange={ev => setCheckIn(ev.target.value)} type="date" />
                    </div>
                    <div className='p-2'>
                        <label htmlFor="">Check Out:</label>
                        <input value={checkOut} onChange={ev => setCheckOut(ev.target.value)} className='cursor-pointer w-[80%]' type="date" />
                    </div>
                </div>
                <div className='p-2 border-t items-center'>
                    <label>Number of Guests:</label>
                    <input value={numberOfGuests} onChange={ev => setNumberOfGuests(ev.target.value)} type="number" />
                </div>
                {checkIn && checkOut && (
                    <div className='p-2 border-t items-center'>
                        <label>Your Full Name:</label>
                        <input value={name} placeholder="John Doe" onChange={ev => setName(ev.target.value)} type="text" />
                        <label>Phone Number:</label>
                        <input value={phone} placeholder="" onChange={ev => setPhone(ev.target.value)} type="tel" />
                    </div>
                )}
            </div>
            <button onClick={handleBooking} className='primary mt-4'>
                Book this place
                {numberOfNights > 0 && (
                    <span> ${numberOfNights * place.price}</span>
                )}
            </button>
        </div>
    )
}

export default BookingWidget