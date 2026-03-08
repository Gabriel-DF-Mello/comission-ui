import { useRef, useState, useEffect, useContext } from 'react'
import AuthContext from '../context/AuthProvider'
import axios from 'axios'
import {toast, ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'bootstrap/dist/css/bootstrap.min.css'


const Login = () => {
    const { setAuth } = useContext(AuthContext)
    const userRef = useRef()

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        userRef.current.focus();
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/v1/login`, {email: email, password: password})
            setEmail('')
            setPassword('')
            if(response.status === 200){
                toast.success("Login successful")
                setAuth({
                    id: response.data.user.secure_id,
                    email: response.data.user.email,
                    token: response.data.token.token
                })
                setSuccess(true)
            } else {
                toast.error("Login failed")
            } 
        } catch (error) {
            console.log(error)
            setEmail('')
            setPassword('')
            toast.error("Login failed")
        }
    }

    return (
        <div className='container mt-5'>
            <ToastContainer/>
            <h3>Comissions System</h3>
            <div className='container d-flex justify-content-center align-items-center'>
                {success ? 
                <div className="p-4 border rounded shadow-sm" style={{width: "100%", maxWidth: "600px"}}>
                    <h5>You are logged in</h5>
                </div> 
                :
                <form className="p-4 border rounded shadow-sm" style={{width: "100%", maxWidth: "600px"}} onSubmit={handleSubmit}>
                    <div className="form-floating mb-3">
                        <input className='form-control' type='text' id='email' ref={userRef} autoComplete='off' onChange={(e) => setEmail(e.target.value)} value={email} required/>
                        <label htmlFor='email'>Email:</label>
                    </div>

                    <div className="form-floating mb-3">
                        <input className='form-control' type='password' id='password' onChange={(e) => setPassword(e.target.value)} value={password} required/>
                        <label htmlFor='password'>Password:</label>
                    </div>

                    <button className='btn btn-primary'> Sign In</button>
                </form>}
            </div>
        </div>
    )
}

export default Login