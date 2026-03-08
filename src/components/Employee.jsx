import React, {useState, useEffect, useContext} from 'react'
import AuthContext from '../context/AuthProvider'
import axios from 'axios'
import {toast, ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'bootstrap/dist/css/bootstrap.min.css'

const Employee = () => {
    const { auth } = useContext(AuthContext)
    const token = `Bearer ${auth.token}`
    const [employees, setEmployees] = useState([]);
    const [employee, setEmployee] = useState({
        id_superior: null,
        name: '',
        name_position: '',
        active: true,
        fixed_value: null,
        percentage_value: null,
    });

    const [editing, setEditing] = useState(false);
    const [employeeId, setEmployeeId] = useState(null);

 
    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/employee`, { headers: { 'Authorization': token} })
            console.log(response)
            if (response.status === 200){
                setEmployees(response.data)
                setEmployeeId(response.data[0].id)
            } else {
                toast.error("An error occurred")
            }
        } catch (error) {
            toast.error("An error occurred")
            console.log(error)
        }
    }

    const nameEmployee = (idToFind) => {
        const employee = employees.find(item => item.id === idToFind);
        return employee.name
    }

    const editEmployee = async (employeeId) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/employee/${employeeId}`, { headers: { 'Authorization': token } })
            console.log(response)
            setEmployee(response.data)
            setEmployeeId(employeeId)
            setEditing(true)
        } catch (error) {
            toast.error("An error occurred")
            console.log(error)
        }
    }

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setEmployee({...employee, [name]: value});
    }

    const handleSave = async () => {
        let response
        try {
            if(editing){
                response = await axios.put(`${process.env.REACT_APP_BASE_URL}/api/v1/employee/${employeeId}`, employee, { headers: { 'Authorization': token } })
                
            } else {
                response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/v1/employee`, employee, { headers: { 'Authorization': token } })
                if(response.status === 201){
                    toast.success("Employee added succesfully")
                } else {
                    toast.error("Employee could not be added")
                }
            }
            fetchEmployees();
            setEditing(false);
            setEmployee({
                id_superior: 0,
                name: '',
                name_position: '',
                active: false,
                fixed_value: 0,
                percentage_value: 0,
            })
        } catch (error) {
            toast.error("An error occurred")
            console.log(error)
        }
    }

    const deleteEmployee = async (employeeId) => {
        if(window.confirm("Are you sure you want to delete this record?")){
            try {
                const response = await axios.delete(`${process.env.REACT_APP_BASE_URL}/api/v1/employee/${employeeId}`, { headers: { 'Authorization': token } })
                console.log(response)
                toast.success("Record deleted successfully");
                fetchEmployees()
            } catch (error) {
                toast.error("An error occurred")
                console.log(error)
            }
        }
    }

    return (
        <div className='container mt-5'>
            <ToastContainer/>
            <h3>Employees</h3>
            <button className='btn btn-primary mb-2'
                data-bs-toggle="modal"
                data-bs-target="#employeeModal"
                onClick={() => setEditing(false)}>
                Add new record
            </button>
            <table className='table table-bordered'>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Position</th>
                        <th>Superior</th>
                        <th>Fixed Value</th>
                        <th>Percentage Value</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((emp) => (
                        <tr key={emp.id}>
                            <td>{emp.name}</td>
                            <td>{emp.name_position}</td>
                            <td>{emp.id_superior ? nameEmployee(emp.id_superior) : ''}</td>
                            <td>{emp.fixed_value}</td>
                            <td>{emp.percentage_value}%</td>
                            <td>
                                <button className='btn btn-warning me-2'
                                    data-bs-toggle="modal"
                                    data-bs-target="#employeeModal"
                                    onClick={() => editEmployee(emp.id)}>
                                        EDIT
                                </button>
                                <button className='btn btn-danger'
                                    onClick={() => deleteEmployee(emp.id)}>
                                        DELETE
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>


            {/* Modal Code */}
            <div className="modal fade"
            id = "employeeModal" tabIndex="-1"
            aria-labelledby="employeeModalLabel"
            aria-hidden="true">
                <div className='modal-dialog'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h5 className='modal-title' id='employeeModalLabel'>
                                {editing ? "Edit Employee" : "Add Employee"}
                            </h5>
                            <button type='button' className='btn-close'
                            data-bs-dismiss="modal" aria-label='Close'></button>
                        </div>
                        <div className='modal-body'>
                            <input type='text' name="name" placeholder='Enter name' className='form-control mb-3'
                            value={employee.name} onChange={handleInputChange}/>

                            <input type='text' name="name_position" placeholder='Enter position name' className='form-control mb-3'
                            value={employee.name_position} onChange={handleInputChange}/>

                            <select value={employee.id_superior} name="id_superior" className='form-select mb-3' onChange={handleInputChange}>
                                <option value = {null}> No superior </option>
                                {employees.map((emp) => (
                                    <option value={emp.id}>
                                        {emp.name}
                                    </option>
                                ))}
                            </select>

                            <input type='text' name="fixed_value" placeholder='Enter salary' className='form-control mb-3'
                            value={employee.fixed_value} onChange={handleInputChange}/>
                            
                            <input type='text' name="percentage_value" placeholder='Enter comission percentage' className='form-control mb-3'
                            value={employee.percentage_value} onChange={handleInputChange}/>
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

export default Employee