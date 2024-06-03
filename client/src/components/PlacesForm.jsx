import { useEffect, useState } from "react";
import PhotosUploaderSection from "./PhotosUploaderSection";
import PerksSection from "./PerksSection";
import AccountNav from "./AccountNav";

import axios from "axios";
import { Navigate, useParams } from "react-router-dom";

const PlacesForm = () => {

    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');
    const [perks, setPerks] = useState([]);
    const [extraInfo, setExtraInfo] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [maxGuests, setMaxGuests] = useState(1);
    const [addedPhotos, setAddedPhotos] = useState([]);
    const [redirect, setRedirect] = useState(false);
    const [price, setPrice] = useState(100);

    const { id } = useParams();

    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get(`/places/${id}`).then(response => {
            const { data } = response;

            setTitle(data.title)
            setAddress(data.address)
            setAddedPhotos(data.photos)
            setDescription(data.description)
            setPerks(data.perks)
            setExtraInfo(data.extraInfo)
            setCheckIn(data.checkIn)
            setCheckOut(data.checkOut)
            setMaxGuests(data.maxGuests)
            setPrice(data.price)
        })
    }, [id])

    function preInput(title, desc) {
        return (
            <>
                <h2 className="text-lg font-bold mt-4" htmlFor="title">{title}</h2>
                <p className="text-sm text-gray-500">{desc}</p>
            </>
        )
    }

    async function savePlace(ev) {
        ev.preventDefault();

        const placeData = {
            title,
            address,
            addedPhotos,
            description,
            perks,
            extraInfo,
            checkIn,
            checkOut,
            maxGuests,
            price
        }

        if (id) {
            await axios.put('/places', { id, ...placeData });
            setRedirect(true)
        } else {
            await axios.post('/places', placeData);
            setRedirect(true);
        }
    }

    if (redirect) {
        return <Navigate to={'/account/places'} />
    }

    return (
        <div>
            <AccountNav />
            <form onSubmit={savePlace}>
                {preInput(
                    'Title',
                    'Title for your place. Make it simple and short'
                )}
                <input value={title} onChange={ev => setTitle(ev.target.value)} type="text" placeholder="Title, for example: 'My lovely apartment'" />
                {preInput(
                    'Address',
                    'Address of the place'
                )}
                <input value={address} onChange={ev => setAddress(ev.target.value)} type="text" placeholder="Address" />
                {preInput(
                    'Photos',
                    'More equals better'
                )}
                <PhotosUploaderSection addedPhotos={addedPhotos} onChange={setAddedPhotos} />
                {preInput(
                    'Description',
                    'Description of the place'
                )}
                <textarea value={description} onChange={ev => setDescription(ev.target.value)} />
                {preInput(
                    'Perks',
                    'Select all perks for your place'
                )}
                <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-6 mt-2">
                    <PerksSection selected={perks} onChange={setPerks} />
                </div>
                {preInput(
                    'Extra info',
                    'House rules, etc.'
                )}
                <textarea value={extraInfo} onChange={ev => setExtraInfo(ev.target.value)} />
                {preInput(
                    'Check in & out time, Max guests',
                    'Add check in and out time, remember that the checkout is made at 12:00 local time'
                )}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div>
                        <h3 className="mt-2 -mb-1">Check in time</h3>
                        <input value={checkIn} onChange={ev => setCheckIn(ev.target.value)} type="text" placeholder="11" />
                    </div>
                    <div>
                        <h3 className="mt-2 -mb-1">Check out time</h3>
                        <input value={checkOut} onChange={ev => setCheckOut(ev.target.value)} type="text" placeholder="14" />
                    </div>
                    <div>
                        <h3 className="mt-2 -mb-1">Max nr. of guests</h3>
                        <input value={maxGuests} onChange={ev => setMaxGuests(ev.target.value)} type="number" />
                    </div>
                    <div>
                        <h3 className="mt-2 -mb-1">Price per night</h3>
                        <input value={price} onChange={ev => setPrice(ev.target.value)} type="number" />
                    </div>
                </div>
                <button className="primary my-4">Save</button>
            </form>
        </div>
    )
}

export default PlacesForm