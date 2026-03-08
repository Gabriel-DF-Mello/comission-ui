import React, {useState, useEffect, useContext} from 'react'
import AuthContext from '../context/AuthProvider'
import axios from 'axios'
import {toast, ToastContainer} from 'react-toastify'
import Comission from './Comission'
import Sale from './Sale'
import User from './User'
import Employee from './Employee'
import 'react-toastify/dist/ReactToastify.css'
import 'bootstrap/dist/css/bootstrap.min.css'

const Main = () => {
    const { auth, setAuth } = useContext(AuthContext)
    const token = `Bearer ${auth.token}`

    const logout = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/v1/logout`, {}, { headers: { 'Authorization': token } })
            if(response.status === 200){
                toast.success("Logout successful")
                setAuth({})
            } else {
                toast.error("Logout failed")
            } 
        } catch (error) {
            toast.error("An error occurred")
            console.log(error)
        }
    }

    return (
        <div>
            <div className='row'>
                <div className='col-md-11 border'>
                    <ul class="nav nav-tabs" id="myTab" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link active" id="employees-tab" data-bs-toggle="tab" data-bs-target="#employees" type="button" role="tab" aria-controls="employees" aria-selected="true">Employees</button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="sales-tab" data-bs-toggle="tab" data-bs-target="#sales" type="button" role="tab" aria-controls="sales" aria-selected="false">Sales</button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="users-tab" data-bs-toggle="tab" data-bs-target="#users" type="button" role="tab" aria-controls="users" aria-selected="false">Users</button>
                    </li>
                    <li class="nav-item" role="comission">
                        <button class="nav-link" id="comission-tab" data-bs-toggle="tab" data-bs-target="#comission" type="button" role="tab" aria-controls="comission" aria-selected="false">Comission</button>
                    </li>
                    </ul>
                </div>
                <div className='col-md-1 border'>
                    <button className='btn btn-secondary'
                        style = {{alignContent: 'left'}}
                        onClick={() => logout()}>
                            Sign Out
                    </button>
                </div>
            
            </div>
            <div class="tab-content" id="myTabContent">
                <div class="tab-pane fade show active" id="employees" role="tabpanel" aria-labelledby="employees-tab"><Employee/></div>
                <div class="tab-pane fade" id="sales" role="tabpanel" aria-labelledby="sales-tab"><Sale/></div>
                <div class="tab-pane fade" id="users" role="tabpanel" aria-labelledby="users-tab"><User/></div>
                <div class="tab-pane fade" id="comission" role="tabpanel" aria-labelledby="comission-tab"><Comission/></div>
            </div>
        </div>
    )
}

export default Main