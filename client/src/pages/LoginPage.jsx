import axios from "axios";
import { useContext, useState } from "react"
import toast from "react-hot-toast";
import { Link, Navigate } from "react-router-dom"
import { UserContext } from "../context/UserContext";

const LoginPage = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const { setUser } = useContext(UserContext);

    async function handleLogin(ev) {
        ev.preventDefault();

        try {
            const { data } = await axios.post('/login', {
                email,
                password
            })
            setUser(data);
            toast.success('Logged in!');
            setRedirect(true);
        } catch (err) {
            toast.error('Login failed!');
        }
    }

    if (redirect) {
        return <Navigate to={'/'} />
    }

    return (
        <div className="mt-4 grow flex items-center justify-center">
            <div className="-mt-64">
                <h1 className="text-4xl text-center mb-4">Login</h1>
                <form onSubmit={handleLogin} className="max-w-md mx-auto">
                    <input
                        value={email}
                        onChange={(ev) => setEmail(ev.target.value)}
                        type="email"
                        placeholder="your@email.com"
                    />
                    <input
                        value={password}
                        onChange={(ev) => setPassword(ev.target.value)}
                        type="password"
                        placeholder="password"
                    />
                    <button className="primary">Login</button>
                    <div className="text-center py-2 text-gray-500">
                        Don&apos;t have an account yet? <Link className="underline text-primary font-semibold" to={'/register'}>Register now</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default LoginPage