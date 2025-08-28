"use client";
import axios from 'axios';
import React, { useEffect, useState, useCallback } from "react";
// import LocationPicker from "react-location-picker";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

interface DefaultPosition {
    lat: number;
    lng: number;
}

const Main = () => {

    const [defaultPosition, setDefaultPosition] = useState<DefaultPosition>({
        lat: 32.73306102089013,
        lng: -97.1139347076416,
    });

    useEffect(() => {

    }, []);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyDd_XpdUMfbfKSpxt2xPojxLJi83lJN01Y",
    });

    const handleLocationChange = useCallback((event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
            const position = {
                lat: event.latLng.lat(),
                lng: event.latLng.lng()
            };
            console.log("Selected position:", position);
            setDefaultPosition(position);
        }
    }, []);

    const handleSubmit = async () => {

        var subject = document.getElementById('subject') as HTMLInputElement | HTMLInputElement;
        var phone = document.getElementById('phone') as HTMLInputElement | HTMLInputElement;
        var message = document.getElementById('message') as HTMLInputElement | HTMLInputElement;
        var email = document.getElementById('email') as HTMLInputElement | HTMLInputElement;
        var address = document.getElementById('address') as HTMLInputElement | HTMLInputElement;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10}$/;
        if (!subject.value) {
            alert("Enter subject");
            subject.focus()
            return
        }
        if (!message.value) {
            alert("Enter message");
            message.focus()
            return
        }

        if (!phone.value || !phoneRegex.test(phone.value)) {
            alert("Enter valid phone number (10 digits allowed)");
            phone.focus()
            return
        }
        if (!email.value || !emailRegex.test(email.value)) {
            alert("Enter valid email address");
            email.focus()
            return
        }
        if (!address.value) {
            alert("Enter address");
            address.focus()
            return
        }

        const data = {
            subject: subject.value,
            email: email.value,
            phone: phone.value,
            message: message.value,
            address: address.value,
            method: 'contact'
        }

        axios.post(`http://mailer.cxe1504.uta.cloud/mailer`, JSON.stringify(data))
            .then(res => {
                console.log(res);
                console.log(res.data);
                if (res.data.status == 'ok') {
                    alert("Submitted successfully, Mail has been sent to admin")
                }
                else {
                    alert(res.data.message)
                }
            })
    }

    if (!isLoaded) return <div>Loading...</div>;

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
                    <a href="contactus" className="active">
                        <span className="material-icons-sharp">call</span>
                        <h3>Contact us</h3>
                    </a>

                </div>
            </header>
            <div className="submission-container">
                <form action="">
                    <h2>Contact us</h2>

                    <div className="box">
                        <p className="text-muted">Subject</p>
                        <input type="text" id="subject" />
                    </div>
                    <div className="box">
                        <p className="text-muted">Message</p>
                        <textarea name="" id="message">

                        </textarea>
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
                        <p className="text-muted">Conference address</p>
                        <textarea id="address"></textarea>
                    </div>

                    <p className="text-muted">Conference location</p>
                    {/* <LocationPicker
                        containerElement={<div style={{ height: '100%' }} />}
                        mapElement={<div style={{ height: '400px' }} />}
                        defaultPosition={defaultPosition}
                        onChange={handleLocationChange}
                    /> */}

                    <GoogleMap
                        mapContainerStyle={{ width: "100%", height: "400px" }}
                        center={defaultPosition}
                        zoom={12}
                        onClick={handleLocationChange}
                    >
                        <Marker position={defaultPosition} />
                    </GoogleMap>

                    <div className="button">
                        <input value="Submit" className="btn" onClick={handleSubmit} />
                        {/* <a href="#" className="text-muted">Cancel</a> */}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Main;
