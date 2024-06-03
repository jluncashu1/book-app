import { useState } from "react"
import { Link } from "react-router-dom"
import axios from 'axios'
import toast from "react-hot-toast";

const RegisterPage = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function registerUser(ev) {
        ev.preventDefault();
        try {
            await axios.post('/register', {
                name,
                email,
                password
            })
            toast.success('Registration successful. Now you can log in!')
        } catch (err) {
            if(err.response.data.errorResponse.errmsg.includes('duplicate')) {
                toast.error('Already registered user!')
            } else {
                toast.error('Registration failed. Please try again later!')
            }
        }

    }

    return (
        <div className="mt-4 grow flex items-center justify-center">
            <div className="-mt-64">
                <h1 className="text-4xl text-center mb-4">Register</h1>
                <form onSubmit={registerUser} className="max-w-md mx-auto">
                    <input
                        value={name}
                        onChange={(ev) => setName(ev.target.value)}
                        type="text"
                        placeholder="John Doe"
                    />
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
                    <button type="submit" className="primary">Register</button>
                    <div className="text-center py-2 text-gray-500">
                        Already a member? <Link className="underline text-primary font-semibold" to={'/login'}>Login</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default RegisterPage