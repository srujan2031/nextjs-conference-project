"use client";
import axios from 'axios';
import React, { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';

interface Conference {
    id: number;
    name: string;
    type: string;
    location: string;
    description: string;
    date: string;
    fee: number;
}
type ConferencesByType = Record<string, Conference[]>;

const Main = () => {
    const searchParams = useSearchParams();
    const conferenceId = searchParams?.get('id');
    const conferenceType = searchParams?.get('type');

    const [conferencesByType, setConferencesByType] = useState<ConferencesByType>({});
    const [selectedResearchArea, setSelectedResearchArea] = useState('');
    const [currentConfrenceId, setCurrentConfrenceId] = useState('');
    
    useEffect(() => {
        const fetchConferences = async () => {
            try {
                const response = await axios.get<Conference[]>('http://localhost:3000/api/conferences');
                const data = response.data;
                const groupedConferences: ConferencesByType = data.reduce((acc, conference) => {
                    const { type } = conference;
                    if (!acc[type]) {
                        acc[type] = [];
                    }
                    acc[type].push(conference);
                    return acc;
                }, {} as ConferencesByType);
                setConferencesByType(groupedConferences);

            } catch (error) {
                console.error('Error fetching conferences:', error);
            }
        };

        fetchConferences();
        setSelectedResearchArea(conferenceType ? conferenceType : '');
        setCurrentConfrenceId(conferenceId ? conferenceId : '');
    }, []);

    const handleResearchAreaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedResearchArea(event.target.value);
    };

    const handelConferenceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setCurrentConfrenceId(event.target.value);
    };

    const handleSubmit = async () => {
        const research = document.getElementById('research') as HTMLInputElement | HTMLInputElement;
        const conference = document.getElementById('conferenceid') as HTMLInputElement | HTMLInputElement;
        const email = document.getElementById('email') as HTMLInputElement | HTMLInputElement;
        const password = document.getElementById('password') as HTMLInputElement | HTMLInputElement;

        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

        if (!research.value) {
            alert('Select research area');
            research.focus()
            return
        }

        if (!conference.value) {
            alert('Select conference');
            conference.focus()
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

        const user = await axios.get(`/api/users?id=${email.value}`);
        console.log(user)
        if (user && user.data && user.data.length > 0) {
            if(user.data[0].password != password.value)
            {
                alert("Incorrect password")
            }
            else
            {
                window.location.href = '/virtualConference?id=' + conference.value + '&userId=' + user.data[0].id + '&user=' + user.data[0].name
            }
        }
        else
        {
            alert("User doesnot exist")
            return
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
                </div>
                <div className="navbar">
                    <a href="/signup">
                        <span className="material-icons-sharp">person_add</span>
                        <h3>signup</h3>
                    </a>
                </div>
            </header>
            <div className="submission-container">
                <form action="">
                    <h2>Join virtual conference</h2>

                    <div className="box">
                        <p className="text-muted">Research area</p>
                        <select
                            name="research"
                            id="research"
                            value={selectedResearchArea}
                            onChange={handleResearchAreaChange}
                        >
                            <option value=""></option>
                            {Object.keys(conferencesByType).map((type) => (
                                <option key={type} value={type}>
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="box">
                        <p className="text-muted">Conference id</p>
                        <select name="conferenceid" id="conferenceid" value={currentConfrenceId} onChange={handelConferenceChange}>
                            <option value=""></option>
                            {selectedResearchArea &&
                                conferencesByType[selectedResearchArea]?.map((conference) => (
                                    <option key={conference.id} value={conference.id}>
                                        {conference.name}
                                    </option>
                                ))}
                        </select>
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
                        <input value="Join" className="btn" onClick={handleSubmit} />
                        {/* <a href="#" className="text-muted">Cancel</a> */}
                    </div>
                </form>
            </div>
        </div>

    );
};

export default Main;
