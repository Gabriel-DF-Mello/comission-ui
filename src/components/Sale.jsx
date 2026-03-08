import React, {useState, useEffect, useContext} from 'react'
import AuthContext from '../context/AuthProvider'
import axios from 'axios'
import {toast, ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'bootstrap/dist/css/bootstrap.min.css'

const Sale = () => {
    const { auth } = useContext(AuthContext)
    const token = `Bearer ${auth.token}`
    const [sales, setSales] = useState([]);
    const [sale, setSale] = useState({
        id_vendor: null,
        value: '',
    });
    const [employees, setEmployees] = useState([]);
    const [saleDetails, setSaleDetails] = useState({
        sale: {
            id_vendor: null,
            value: '',
        },
        comission: {
            vendor: '',
            fixedValueVendor: null,
            percentageVendor: null,
            percentageValueVendor: null,
            manager: '',
            fixedValueManager: null,
            percentageManager: null,
            percentageValueManager: null,
        }
    });

    const [saleId, setSaleId] = useState(null);
 
    useEffect(() => {
        fetchData();
        fetchEmployees();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/sale`, { headers: { 'Authorization': token} })
            console.log(response)
            if (response.status === 200){
                setSales(response.data)
                setSaleId(response.data[0].id)
            } else {
                toast.error("An error occurred")
            }
        } catch (error) {
            toast.error("An error occurred")
            console.log(error)
        }
    }

    const fetchEmployees = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/employee`, { headers: { 'Authorization': token} })
            console.log(response)
            if (response.status === 200){
                setEmployees(response.data)
            } else {
                toast.error("An error occurred")
            }
        } catch (error) {
            toast.error("An error occurred")
            console.log(error)
        }
    }

    const viewSale = async (saleId) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/sale/${saleId}`, { headers: { 'Authorization': token } })
            console.log(response)
            setSaleDetails(response.data)
            setSaleId(saleId)
        } catch (error) {
            toast.error("An error occurred")
            console.log(error)
        }
    }

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setSale({...sale, [name]: value});
    }

    const handleSave = async () => {
        try {
            const obj = {
                id_vendor: sale.id_vendor,
                value: sale.value
            }
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/v1/sale`, obj, { headers: { 'Authorization': token } })
            if(response.status === 201){
                toast.success("Sale added succesfully")
            } else {
                toast.error("Sale could not be added")
            }
            fetchData();
            setSale({
                id_vendor: null,
                value: '',
            })
        } catch (error) {
            toast.error("An error occurred")
            console.log(error)
        }
    }

    return (
        <div className='container mt-5'>
            <ToastContainer/>
            <h3>Sales</h3>
            <button className='btn btn-primary mb-2'
                data-bs-toggle="modal"
                data-bs-target="#addSaleModal"
                onClick={fetchEmployees}>
                Add new record
            </button>
            <table className='table table-bordered'>
                <thead>
                    <tr>
                        <th>Vendor</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    {sales.map((sale) => (
                        <tr key={sale.id}>
                            <td>{sale.vendor.name}</td>
                            <td>{sale.value}</td>
                            <td>
                                <button className='btn btn-primary me-2'
                                    data-bs-toggle="modal"
                                    data-bs-target="#saleModal"
                                    onClick={() => viewSale(sale.id)}>
                                        DETAILS
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>


            {/* Modal Code */}
            <div className="modal fade"
            id = "saleModal" tabIndex="-1"
            aria-labelledby="saleModalLabel"
            aria-hidden="true">
                <div className='modal-dialog'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h5 className='modal-title' id='saleModalLabel'>
                                Details
                            </h5>
                            <button type='button' className='btn-close'
                            data-bs-dismiss="modal" aria-label='Close'></button>
                        </div>
                        <div className='modal-body'>
                            <div class="row">
                                <div class="col">
                                    <div class="card h-100">
                                        <div class="card-body">
                                            <h5 class="card-title">Sale</h5>
                                            <p class="card-text">
                                            <strong>Value:</strong> {saleDetails.sale.value}<br/>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col">
                                    <div class="card h-100">
                                        <div class="card-body">
                                            <h5 class="card-title">Vendor Comission</h5>
                                            <p class="card-text">
                                            <strong>Vendor:</strong> {saleDetails.comission.vendor}<br/>
                                            <strong>Fixed Value:</strong> {saleDetails.comission.fixedValueVendor} <br/>
                                            <strong>Percentage:</strong> {saleDetails.comission.percentageVendor}%<br/>
                                            <strong>Percentage Value:</strong> {saleDetails.comission.percentageValueVendor} <br/>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col">
                                    <div class="card h-100">
                                        <div class="card-body">
                                            <h5 class="card-title">Manager Comission</h5>
                                            <p class="card-text">
                                            <strong>Manager:</strong> {saleDetails.comission.manager}<br/>
                                            <strong>Fixed Value:</strong> {saleDetails.comission.fixedValueManager} <br/>
                                            <strong>Percentage:</strong> {saleDetails.comission.percentageManager}%<br/>
                                            <strong>Percentage Value:</strong> {saleDetails.comission.percentageValueManager} <br/>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='modal-footer'></div>
                    </div>
                </div>
            </div>

            {/* Modal Code */}
            <div className="modal fade"
            id = "addSaleModal" tabIndex="-1"
            aria-labelledby="addsSaleModalLabel"
            aria-hidden="true">
                <div className='modal-dialog'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h5 className='modal-title' id='addSaleModalLabel'>
                                Add Sale
                            </h5>
                            <button type='button' className='btn-close'
                            data-bs-dismiss="modal" aria-label='Close'></button>
                        </div>
                        <div className='modal-body'>
                           <label className='form-label'>Vendor:</label>
                            <select value={sale.id_vendor} name="id_vendor" className='form-select mb-3' onChange={handleInputChange}>
                                {employees.map((emp) => (
                                    <option value={emp.id}>
                                        {emp.name}
                                    </option>
                                ))}
                            </select>

                            <input type='text' name="value" placeholder='Enter value' className='form-control mb-3'
                            value={sale.value} onChange={handleInputChange}/>
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

export default Sale