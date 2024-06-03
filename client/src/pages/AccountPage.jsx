import { useContext, useState } from "react"
import { UserContext } from "../context/UserContext"
import { Navigate, useParams } from "react-router-dom";
import axios from 'axios';
import PlacesPage from "./PlacesPage";
import AccountNav from "../components/AccountNav";

const AccountPage = () => {

    const [redirectToHomepage, setRedirectToHomepage] = useState(false);
    const { ready, user, setUser } = useContext(UserContext);
    const { subpage } = useParams();

    

    async function logOut() {
        await axios.post('/logout');
        setRedirectToHomepage(true)
        setUser(null);
    }

    if (!ready) {
        return (
            <div className="w-full h-[80vh] flex justify-center items-center">
                <img src="/loading.gif" width={100} />
            </div>
        )
    }

    if (ready && !user && !redirectToHomepage) {
        return <Navigate to={'/login'} />
    }

    if (redirectToHomepage) {
        return <Navigate to={'/'} />
    }

    return (
        <div>
            <AccountNav />
            {subpage === undefined && (
                <div className="text-center">
                    Logged in as {user.name} ({user.email}) <br />
                    <button onClick={logOut} className="primary max-w-xs mt-2">Logout</button>
                </div>
            )}
            {subpage === 'places' && (
                <PlacesPage />
            )}
        </div>
    )
}

export default AccountPage