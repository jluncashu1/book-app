import { Link } from "react-router-dom";
import AccountNav from "../components/AccountNav";
import { useEffect, useState } from "react";
import axios from "axios";


const PlacesPage = () => {

    const [places, setPlaces] = useState([]);

    useEffect(() => {
        axios.get('/user-places').then(({ data }) => {
            setPlaces(data);
        })
    }, [])

    if (places.length === 0) {
        return (
            <div className="w-full h-[80vh] flex justify-center items-center">
                <img src="/loading.gif" width={100} />
            </div>
        )
    }

    return (
        <div>
            <AccountNav />
            <div className="text-center">
                <Link className="inline-flex gap-1 items-center bg-primary text-white py-2 px-4 rounded-full" to={'/account/places/new'} >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                        <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
                    </svg>
                    Add New Place
                </Link>
                <div className="mt-4">
                    {places.length > 0 && places.map((place, index) => (
                        <Link to={`/account/places/${place._id}`} className="shadow-md mb-5 p-4 rounded-2xl gap-2 flex cursor-pointer" key={index}>
                            <div className="flex w-32 h-32 bg-gray-300 grow shrink-0">
                                {place.photos.length && (
                                    <img className="object-cover w-full" src={place.photos[0]} alt="Cover Image" />
                                )}
                            </div>
                            <div className="grow-0 shrink w-full max-h-11">
                                <h2 className="text-xl">
                                    {place.title}
                                </h2>
                                <p className="text-sm mt-2 line-clamp-3">
                                    {place.description}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default PlacesPage