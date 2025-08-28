"use client";
import axios from 'axios';
import React, { useEffect, useState } from "react";

interface Mentors {
    id: number;
    name: string;
    designation: string;
    institute: string;
}

interface Mentoring {
    id: number;
    mentorid: number;
    session: string;
    fromDate: string;
    toDate: string;
    description: string;
    registeredUsers: string;
}

const Main = () => {
    const [mentors, setMentors] = useState<Mentors[]>([]);
    const [mentoring, setMentoring] = useState<Mentoring[]>([]);
    const [currentMentor, setCurrentMentor] = useState<Mentors>();

    useEffect(() => {
        const fetchConferences = async () => {
            try {
                const response = await axios.get<Mentors[]>('http://localhost:3000/api/users?mentor=true');
                const data = response.data;
                setMentors(data)
                if (data && data.length > 0) {
                    setCurrentMentor(data[0])
                    const response2 = await axios.get<Mentoring[]>('http://localhost:3000/api/mentoring?id=' + data[0].id);
                    const data2 = response2.data;
                    setMentoring(data2)
                    console.log(data2)
                }
            } catch (error) {
                console.error('Error fetching conferences:', error);
            }
        };

        fetchConferences();


    }, []);


    const handelSession = async (id: number) => {
        mentors.map((m) => {
            if (m.id == id) {
                setCurrentMentor(m)
            }
        })

        const response2 = await axios.get<Mentoring[]>('http://localhost:3000/api/mentoring?id=' + id);
        const data2 = response2.data;
        setMentoring(data2)
        console.log(data2)
    }

    const handelSubmit = async () => {
        var mentorid = document.getElementById('mentorid') as HTMLInputElement | HTMLInputElement;
        var mentoringid = document.getElementById('mentoringid') as HTMLInputElement | HTMLInputElement;
        var email = document.getElementById('email') as HTMLInputElement | HTMLInputElement;

        var emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

        if (!email.value || !email.value.match(emailRegex)) {
            alert('Enter the valid email');
            email.focus()
            return
        }
        if (!mentorid.value) {
            alert('Select mentor');
            mentorid.focus()
            return
        }
        if (!mentoringid.value) {
            alert('Select session');
            mentorid.focus()
            return
        }

        var user = await axios.get(`/api/users?id=${email.value}`);
        console.log(user)
        if (user && user.data && user.data.length == 0) {
            alert("User not found")
            return
        }

        let registeredUsers = '';
        mentoring.map((m) => {
            if(m.id == Number(mentoringid.value))
            {
                registeredUsers = m.registeredUsers
            }
        })
        const data = {
            registeredUsers: registeredUsers  + user.data[0].id + ',',
            id: Number(mentoringid.value)
        }

        try {
            await axios.put('http://localhost:3000/api/mentoring', data);
            alert('Mentoring registration successfully');
        } catch (error) {
            console.error('Error registering:', error);
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
                    <a href="/" >
                        <span className="material-icons-sharp">home</span>
                        <h3>Home</h3>
                    </a>
                    <a href="callForPaper">
                        <span className="material-icons-sharp">ring_volume</span>
                        <h3>Call for Paper</h3>
                    </a>
                    <a href="mentorship" className="active">
                        <span className="material-icons-sharp">school</span>
                        <h3>Mentorship</h3>
                    </a>
                    <a href="career">
                        <span className="material-icons-sharp">self_improvement</span>
                        <h3>Career</h3>
                    </a>

                    <a href="contactus">
                        <span className="material-icons-sharp">call</span>
                        <h3>Contact us</h3>
                    </a>
                </div>
            </header>
            <div className="container">
                <aside>
                    <div className="profile">
                        <h3>Mentors</h3>
                        <div className="about" style={{ height: "420px", overflowY: "scroll" }}>
                            {mentors.map((m) => (
                                <div key={m.id}>
                                    <p>
                                        {m.name}<br />
                                        {m.designation} <a style={{ color: "blue" }} onClick={() => handelSession(m.id)}>session</a>
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                <main id="content">
                    <h1>{currentMentor?.name}</h1>
                    <p style={{ marginTop: "10px", fontSize: "16px", textAlign: "justify" }}>
                        {currentMentor?.designation}
                    </p>
                    <br />
                    <h2>Sessions</h2>
                    <div className="home_cards">
                        {mentoring.map((m) => (
                            <div className="eg">

                                <h3>{m.session}</h3>
                                <p style={{ textAlign: "justify" }}>{m.description}</p>
                                <small className="text-muted"><b>From date:</b>{m.fromDate ? m.fromDate.slice(0, 10) : ''}
                                    <br /><b>To date:</b>{m.toDate ? m.toDate.slice(0, 10) : ''}</small><br />

                            </div>
                        ))}
                    </div>
                </main>

                <div className="right">
                    <div className="announcements">
                        <h2>Mentee registration form</h2>
                        <div className="updates">
                            <div className="message">
                                <p>
                                    <b>Select session</b> <br />
                                </p>
                            </div>
                            <div className="box reviewer_form">
                                <input type="text" id="email" placeholder='Email' />
                            </div>
                            <div className="box reviewer_form">
                                <select
                                    id="mentorid"
                                >
                                    <option value={currentMentor?.id}>{currentMentor?.name}</option>
                                </select>
                            </div>
                            <div className="box reviewer_form">
                                <select
                                    id="mentoringid"
                                >
                                    <option value="">Select session</option>
                                    {mentoring.map((m) => (
                                        <option value={m?.id}>{m?.session}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="button">
                                <input type="submit" value="Submit" className="btn" onClick={handelSubmit} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Main;
