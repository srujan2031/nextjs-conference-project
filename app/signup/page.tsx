"use client";
import axios from 'axios';
import React, { useEffect, useState } from "react";

const Main = () => {
    useEffect(() => {
    }, []);

    const handleSubmit = async () => {
        var name = document.getElementById('username') as HTMLInputElement | HTMLInputElement;
        var designation = document.getElementById('designation') as HTMLInputElement | HTMLInputElement;
        var organization = document.getElementById('institute') as HTMLInputElement | HTMLInputElement;
        var phone = document.getElementById('phone') as HTMLInputElement | HTMLInputElement;
        var email = document.getElementById('email') as HTMLInputElement | HTMLInputElement;
        var type = document.getElementById('type') as HTMLInputElement | HTMLInputElement;
        var password = document.getElementById('password') as HTMLInputElement | HTMLInputElement;

        var emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        var phoneRegex = /^[0-9]{10}$/;

        if (!name.value) {
            alert('Enter the user name');
            name.focus()
            return
        }
        if (!type.value) {
            alert('Select user type');
            type.focus()
            return
        }
        if (!designation.value) {
            alert('Enter the user designation');
            designation.focus()
            return
        }
        if (!organization.value) {
            alert('Enter the institute');
            organization.focus()
            return
        }
        if (!phone.value || !phone.value.match(phoneRegex)) {
            alert('Enter the valid phone - 10 digits');
            phone.focus()
            return
        }
        if (!email.value || !email.value.match(emailRegex)) {
            alert('Enter the valid email');
            email.focus()
            return
        }
        if (!password.value) {
            alert('Enter the password');
            password.focus()
            return
        }

        try {
            var user = await axios.get(`/api/users?id=${email.value}`);
            console.log(user)
            if (user && user.data && user.data.length == 0) {
                const formData = {
                    name: name.value,
                    type: type.value,
                    designation: designation.value,
                    institute: organization.value,
                    phone: phone.value,
                    email: email.value,
                    password: password.value
                }
                console.log(formData)
                const response = await axios.post('/api/users', formData);
                alert(response.data.message);
            }
            else{
                alert("User already exist")
            }
        } catch (error) {
            console.error('Error adding user:', error);
            alert('Failed to add user.');
        }
    }

    return (
        <div>
            <header>
                <div className="logo" title="Conference Management System">
                    <img src="/assets/img/logo.png" alt="CMS" />
                    <h2>C<span className="danger">M</span>S</h2>
                </div>
                <div className="navbar">
                    <a href="/">
                        <span className="material-icons-sharp">home</span>
                        <h3>Home</h3>
                    </a>
                    <a href="joinVirtualConference">
                        <span className="material-icons-sharp">view_in_ar</span>
                        <h3>Virtual Conference</h3>
                    </a>
                </div>

            </header>
            <div className="submission-container">
                <form action="">
                    <h2>User signup</h2>

                    <div className="box">
                        <p className="text-muted">User name</p>
                        <input type="text" id="username" />
                    </div>
                    <div className="box">
                        <p className="text-muted">User type</p>
                        <select id="type">
                            <option value=""></option>
                            <option value="reviewer">Reviewer</option>
                            <option value="author">Author</option>
                        </select>
                    </div>
                    <div className="box">
                        <p className="text-muted">Designation</p>
                        <input type="text" id="designation" />
                    </div>
                    <div className="box">
                        <p className="text-muted">Institute/Organization</p>
                        <input type="text" id="institute" />
                    </div>
                    <div className="box">
                        <p className="text-muted">Phone number</p>
                        <input type="text" id="phone" />
                    </div>
                    <div className="box">
                        <p className="text-muted">Email</p>
                        <input type="text" id="email" />
                    </div>
                    <div className="box">
                        <p className="text-muted">Password</p>
                        <input type="password" id="password" />
                    </div>

                    <div className="button">
                        <input value="Login" className="btn" onClick={handleSubmit} />
                        {/* <a href="#"  className="text-muted">Cancel</a> */}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Main;
