import { Route, Routes } from "react-router-dom"
import IndexPage from "./pages/IndexPage"
import LoginPage from "./pages/LoginPage"
import Layout from "./components/Layout"
import RegisterPage from "./pages/RegisterPage"
import axios from "axios"
import { UserContextProvider } from "./context/UserContext"
import AccountPage from "./pages/AccountPage"
import PlacesPage from "./pages/PlacesPage"
import PlacesForm from "./components/PlacesForm"
import PlacePage from "./pages/PlacePage"
import BookingsPage from "./pages/BookingsPage"
import BookingPage from "./pages/BookingPage"

function App() {

  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
  axios.defaults.withCredentials = true;
  

  return (
    <UserContextProvider>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<IndexPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/account/places" element={<PlacesPage />} />
        <Route path="/account/places/new" element={<PlacesForm />} />
        <Route path="/account/places/:id" element={<PlacesForm />} />
        <Route path="/place/:id" element={<PlacePage />} />
        <Route path="/account/bookings" element={<BookingsPage />} />
        <Route path="/account/bookings/:id" element={<BookingPage /> } />
      </Route>
    </Routes>
    </UserContextProvider>
  )
}

export default App
