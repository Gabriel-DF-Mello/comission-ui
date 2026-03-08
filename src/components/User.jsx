import React, {useState, useEffect, useContext} from 'react'
import AuthContext from '../context/AuthProvider'
import axios from 'axios'
import {toast, ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'bootstrap/dist/css/bootstrap.min.css'

const User = () => {
    const { auth } = useContext(AuthContext)
    const token = `Bearer ${auth.token}`
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState({
        email: '',
        password: ''
    });

    const [editing, setEditing] = useState(false);
    const [userId, setUserId] = useState(null);
 
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/user`, { headers: { 'Authorization': token} })
            console.log(response)
            if (response.status === 200){
                setUsers(response.data)
                setUserId(response.data[0].id)
            } else {
                toast.error("An error occurred")
            }
        } catch (error) {
            toast.error("An error occurred")
            console.log(error)
        }
    }

    const editUser = async (userId) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/user/${userId}`, { headers: { 'Authorization': token } })
            console.log(response)
            setUser({email: response.data.email, password:''})
            setUserId(userId)
            setEditing(true)
        } catch (error) {
            toast.error("An error occurred")
            console.log(error)
        }
    }

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setUser({...user, [name]: value});
    }

    const handleSave = async () => {
        let response
        try {
            if(editing){
                response = await axios.put(`${process.env.REACT_APP_BASE_URL}/api/v1/user/${userId}`, user, { headers: { 'Authorization': token } })
                if(response.status === 200){
                    toast.success("User updated succesfully")
                } else {
                    toast.error("User could not be updated")
                }
                
            } else {
                response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/v1/user`, user, { headers: { 'Authorization': token } })
                if(response.status === 201){
                    toast.success("User added succesfully")
                } else {
                    toast.error("User could not be added")
                }
            }
            fetchUsers();
            setEditing(false);
            setUser({
                email: '',
                password: ''
            })
        } catch (error) {
            toast.error("An error occurred")
            console.log(error)
        }
    }

    const deleteUser = async (userId) => {
        if(window.confirm("Are you sure you want to delete this record?")){
            try {
                const response = await axios.delete(`${process.env.REACT_APP_BASE_URL}/api/v1/user/${userId}`, { headers: { 'Authorization': token } })
                console.log(response)
                toast.success("Record deleted successfully");
                fetchUsers()
            } catch (error) {
                toast.error("An error occurred")
                console.log(error)
            }
        }
    }

    return (
        <div className='container mt-5'>
            <ToastContainer/>
            <h3>Users</h3>
            <button className='btn btn-primary mb-2'
                data-bs-toggle="modal"
                data-bs-target="#userModal"
                onClick={() => setEditing(false)}>
                Add new record
            </button>
            <table className='table table-bordered'>
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.email}</td>
                            <td>
                                <button className='btn btn-warning me-2'
                                    data-bs-toggle="modal"
                                    data-bs-target="#userModal"
                                    onClick={() => editUser(user.id)}>
                                        EDIT
                                </button>
                                <button className='btn btn-danger'
                                    onClick={() => deleteUser(user.id)}>
                                        DELETE
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>


            {/* Modal Code */}
            <div className="modal fade"
            id = "userModal" tabIndex="-1"
            aria-labelledby="userModalLabel"
            aria-hidden="true">
                <div className='modal-dialog'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h5 className='modal-title' id='userModalLabel'>
                                {editing ? "Edit User" : "Add User"}
                            </h5>
                            <button type='button' className='btn-close'
                            data-bs-dismiss="modal" aria-label='Close'></button>
                        </div>
                        <div className='modal-body'>
                            <input type='text' name="email" placeholder='Enter email' className='form-control mb-3'
                            value={user.email} onChange={handleInputChange}/>

                            <input type='password' name="password" placeholder='Enter password' className='form-control mb-3'
                            value={user.password} onChange={handleInputChange}/>

                        </div>
                        <div className='modal-footer'>
                            <button type='button' className='btn btn-primary' onClick={handleSave}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default User