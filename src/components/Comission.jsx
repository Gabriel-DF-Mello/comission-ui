import React, {useState, useEffect, useContext} from 'react'
import AuthContext from '../context/AuthProvider'
import axios from 'axios'
import {toast, ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'bootstrap/dist/css/bootstrap.min.css'

const Comission = () => {
    const { auth } = useContext(AuthContext)
    const token = `Bearer ${auth.token}`
    const [comissions, setComissions] = useState([]);
    const [vendors, setVendors] = useState([])

    const [id_vendor, setIdVendor] = useState(null);
    const [start_date, setStartDate] = useState('');
    const [end_date, setEndDate] = useState('')
 
    useEffect(() => {
        fetchData();
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/employee`, { headers: { 'Authorization': token} })
            console.log(response)
            if (response.status === 200){
                setVendors(response.data)
            } else {
                toast.error("An error occurred")
            }
        } catch (error) {
            toast.error("An error occurred")
            console.log(error)
        }
    }


    const fetchData = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/v1/comission/report`, {}, { headers: { 'Authorization': token } })
            console.log(response)
            if (response.status === 200){
                setComissions(response.data)
            } else {
                toast.error("An error occurred")
            }
        } catch (error) {
            toast.error("An error occurred")
            console.log(error)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let body = {
                id_vendor: id_vendor,
                start_date: start_date,
                end_date: end_date
            }

            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/v1/comission/report`, body, { headers: { 'Authorization': token} })
            setIdVendor(0)
            setStartDate('')
            setEndDate('')
            setComissions(response.data)
            fetchEmployees();
            if(response.status === 200){
                toast.success("Search successful")
            } else {
                toast.error("Search failed")
            } 
        } catch (error) {
            console.log(error)
            setIdVendor(0)
            setStartDate('')
            setEndDate('')
            toast.error("Search failed")
        }
        
    }

    return (
        <div className='container mt-5'>
            <ToastContainer/>
            <h3>Comissions</h3>

            <div className='container'>
                <form className="border rounded shadow-sm m-3" onSubmit={handleSubmit}>
                    <div class="row mb-3 g-3 m-2">
                        <div className='col-md-4'>
                            <label htmlFor='id_vendor'>Vendor:</label>
                            <select value={id_vendor} name="id_vendor" className='form-select mb-3' onChange={(e) => setIdVendor(e.target.value)}>
                                    <option value={0}> Any </option>
                                    {vendors.map((vendor) => (
                                        <option value={vendor.id}>
                                            {vendor.name}
                                        </option>
                                    ))}
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label htmlFor='start_date'>Start Date:</label>
                            <input className='form-control' type='date' id='start_date' onChange={(e) => setStartDate(e.target.value)} value={start_date}/>
                        </div>

                        <div className="col-md-4">
                            <label htmlFor='end_date'>End Date:</label>
                            <input className='form-control' type='date' id='end_date' onChange={(e) => setEndDate(e.target.value)} value={end_date}/>
                        </div>
                    </div>

                    <button className='btn btn-primary mb-3'> Search</button>
                </form>
            </div>

            <table className='table table-bordered'>
                <thead>
                    <tr>
                        <th>Vendor</th>
                        <th>Manager</th>
                        <th>Qt Sales</th>
                        <th>Sales Value</th>
                        <th>Vendor Fixed Value</th>
                        <th>Vendor Percentage</th>
                        <th>Vendor Percentage Value</th>
                        <th>Manager Fixed Value</th>
                        <th>Manager Percentage</th>
                        <th>Manager Percentage Value</th>
                    </tr>
                </thead>
                <tbody>
                    {comissions.map((comission) => (
                        <tr key={comission.id}>
                            <td>{comission.name_vendor}</td>
                            <td>{comission.name_manager}</td>
                            <td>{comission.qt_sales_vendor}</td>
                            <td>{comission.value_sales}</td>
                            <td>{comission.sum_fixed_value_vendor}</td>
                            <td>{comission.percentage_vendor}%</td>
                            <td>{comission.sum_percentage_value_vendor}</td>
                            <td>{comission.sum_fixed_value_manager}</td>
                            <td>{comission.percentage_manager}%</td>
                            <td>{comission.sum_percentage_value_manager}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Comission