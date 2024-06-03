import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";


const Search = () => {
    const [places, setPlaces] = useState([]);
    const [filteredPlaces, setFilteredPlaces] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const divRef = useRef(null);
    const navigate = useNavigate();


    async function openSearch(ev) {
        const { data } = await axios.get('/places');
        if (ev.target.value !== '') {
            handleSearch(ev)
            setShowSearchResults(true)
        } else {
            setPlaces(data);
            setFilteredPlaces(data);
            setShowSearchResults(true);
        }
    }

    function handleSearch(ev) {
        setSearchValue(ev.target.value)
        setFilteredPlaces(places.filter(r => r.title.toLowerCase().includes(ev.target.value)))
    }

    function handleClickOutside(event) {
        if (divRef.current && !divRef.current.contains(event.target)) {
            setShowSearchResults(false);
        }
    }

    function handleRedirectToPlace(placeId) {
        navigate(`/place/${placeId}`)
        setShowSearchResults(false)
        setSearchValue('')
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div ref={divRef} className="flex border border-gray-300 rounded-full py-2 px-4 gap-2 shadow-md shadow-gray-300 relative">
            <input value={searchValue} onChange={(ev) => handleSearch(ev)} onClick={(ev) => openSearch(ev)} placeholder="Search a specific place" className="h-2 border-none focus:outline-none" type="text" />
            <button className="bg-primary text-white p-1 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
            </button>
            {showSearchResults && (
                <div className="z-10 absolute max-h-[550px] overflow-y-auto top-12 sm:left-[-50%] bg-white w-full left-0 shadow-sm border sm:w-[200%] h-auto rounded-xl my-4 cursor-pointer">
                    {places.length > 0 && filteredPlaces.map((r, idx) => (
                        <div onClick={() => handleRedirectToPlace(r._id)} className="flex items-center gap-3 hover:bg-gray-200 px-4" key={idx}>
                            <img className="hidden sm:block w-14 my-2 h-14 object-cover" src={r.photos?.[0]} alt="" />
                            <div>
                                <h1 className="font-bold">{r.title}</h1>
                                <h2 className="text-gray-400">{r.address}</h2>
                            </div>
                        </div>
                    ))}
                    {filteredPlaces.length === 0 && (
                        <div>
                            <h1 className="flex justify-center items-center gap-3 p-8">
                                No Search Results
                            </h1>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default Search;