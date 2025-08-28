"use client";
import axios from 'axios';
import React, { useEffect, useState, useCallback } from "react";

const Main = () => {
    // Equivalent of componentDidMount
    useEffect(() => {
        // Perform actions when the component is mounted
    }, []); // Empty dependency array means it runs once on mount

    const handleSubmit = async () => {


        var email = document.getElementById('email') as HTMLInputElement | HTMLInputElement;
        var password = document.getElementById('password') as HTMLInputElement | HTMLInputElement;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10}$/;

        if (!email.value || !emailRegex.test(email.value)) {
            alert("Enter valid email address");
            email.focus()
            return
        }
        if (!password.value) {
            alert("Enter password");
            password.focus()
            return
        }

        var user = await axios.get(`/api/users?id=${email.value}`);
        console.log(user)
        if (user && user.data && user.data.length == 0) {
            alert("User not found");
            return
        }
        else {
            if (user.data[0].usertype == 'admin') {
                if (user.data[0].password == password.value)
                    window.location.href = '/admin/conference'
                else
                    alert("Incorrect password");
            }
            else {
                alert("This is admin portal");
                return
            }
        }
    }

    return (
        <div>
            <header>
                <div className="logo" title="Conference Management System">
                <a href="http://localhost:3000/">
  <img src="/assets/img/logo.png" alt="CMS" />
</a>

                   
                    <h2>C<span className="danger">M</span>S</h2>
                </div>
                <div className="navbar">
                    <a href="/">
                        <span className="material-icons-sharp">home</span>
                        <h3>Home</h3>
                    </a>
                </div>
            </header>
            <div className="submission-container">
                <form action="">
                    <h2>Admin login</h2>
                    <div className="box">
                        <p className="text-muted">Email ID</p>
                        <input type="text" id="email" />
                    </div>
                    <div className="box">
                        <p className="text-muted">Password</p>
                        <input type="password" id="password" />
                    </div>

                    <div className="button">
                        <input  value="Login" className="btn" onClick={handleSubmit} />
                        {/* <a href="#" className="text-muted">Cancel</a> */}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Main;
