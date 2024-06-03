import axios from "axios"
import { useEffect, useState } from "react"
import { Link } from 'react-router-dom'

const IndexPage = () => {
    const [places, setPlaces] = useState([]);

    useEffect(() => {
        axios.get('/places').then(res => {
            setPlaces(res.data);
        });
    }, []);

    if (places.length === 0) {
        return (
            <div className="w-full h-[80vh] flex justify-center items-center">
                <img src="/loading.gif" width={100} />
            </div>
        )
    }

    return (
        <div className="mt-8 grid sm:grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-3 lg:grid-cols-4 max-w-6xl mx-auto">
            {places.length && places.map((place, index) => (
                <Link to={`/place/${place._id}`} key={index}>
                    <div className="bg-gray-500 mb-2 sm:w-auto rounded-2xl flex">
                        {place.photos?.[0] && (
                            <img className="rounded-2xl w-full h-full object-cover aspect-square" src={place.photos?.[0]} alt="" />
                        )}
                    </div>
                    <h2 className="font-bold truncate text-xs sm:text-base">{place.address}</h2>
                    <h3 className="text-sm leading-4 text-gray-500">{place.title}</h3>
                    <div className="mt-1">
                        <span className="font-bold">${place.price}</span>/night
                    </div>
                </Link>
            ))}
        </div>
    )
}

export default IndexPage