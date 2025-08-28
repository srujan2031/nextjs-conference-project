"use client";
import axios from 'axios';
import React, { useEffect, useState } from "react";

interface Conference {
    id: number;
    name: string;
    type: string;
    location: string;
    description: string;
    date: string;
}

type ConferencesByType = Record<string, Conference[]>;

const Main = () => {
    const [conferences, setConferences] = useState<Conference[]>([]);
    const [conferencesByType, setConferencesByType] = useState<ConferencesByType>({});

    // Equivalent of componentDidMount
    useEffect(() => {
        const fetchConferences = async () => {
            try {
                const response = await axios.get<Conference[]>('http://localhost:3000/api/conferences');
                const data = response.data;

                // Organize conferences by type
                const groupedConferences: ConferencesByType = data.reduce((acc, conference) => {
                    const { type } = conference;
                    if (!acc[type]) {
                        acc[type] = [];
                    }
                    acc[type].push(conference);
                    return acc;
                }, {} as ConferencesByType);

                setConferencesByType(groupedConferences);
                setConferences(data);
            } catch (error) {
                console.error('Error fetching conferences:', error);
            }
        };

        fetchConferences();
    }, []); // Empty dependency array means it runs once on mount

    return (

        <div>
            <header>
                <div className="logo" title="Conference Management System">
                    <img src="/assets/img/logo.png" alt="CMS" />
                    <h2>C<span className="danger">M</span>S</h2>
                </div>
                <div className="navbar">
                    <a href="/" className="active">
                        <span className="material-icons-sharp">home</span>
                        <h3>Home</h3>
                    </a>
                    <a href="callForPaper">
                        <span className="material-icons-sharp">ring_volume</span>
                        <h3>Call for Paper</h3>
                    </a>
                    <a href="register">
                        <span className="material-icons-sharp">app_registration</span>
                        <h3>Register</h3>
                    </a>
                    <a href="schedule">
                        <span className="material-icons-sharp">today</span>
                        <h3>Schedule</h3>
                    </a>
                    <a href="review">
                        <span className="material-icons-sharp">rate_review</span>
                        <h3>Review</h3>
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
                        <h3>Conferences</h3>
                        <div className="about" style={{ height: "420px", overflowY: "scroll" }}>
                            {Object.keys(conferencesByType).map((type) => (
                                <div key={type}>
                                    <h5>{type.charAt(0).toUpperCase() + type.slice(1)}</h5>
                                    {conferencesByType[type].map((conference) => (
                                        <p key={conference.id}>
                                            {conference.name} <a style={{ color: "blue" }} href={`/joinVirtualConference?type=${type}&id=${conference.id}`}>Join now</a>
                                        </p>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                <main>
                    <h1>Conference Management System</h1>
                    <p style={{ marginTop: "10px", fontSize: "16px", textAlign: "justify" }}>
                        This platform is designed to provide you with everything you need for a smooth and engaging virtual conference experience. From here, you can easily navigate the agenda, register for sessions, participate in live discussions, and access key event resources.
                        <br /><br />Our intuitive interface allows you to connect with fellow attendees, explore interactive features, and stay informed with real-time updates. Whether it's browsing speaker profiles or accessing post-event materials, this website is your one-stop solution for managing your conference experience.
                        <br /><br />Thank you for being a part of our community—explore, connect, and enjoy the event!
                    </p>
                    <br />
                    <h2>Upcoming conferences you can register</h2>
                    <div className="home_cards">

                        {conferences.map((conf) => (
                            <div className="eg">
                                <span className="material-icons-sharp">{
                                conf.type == 'mathematics' ? 'functions' 
                                : conf.type == 'engineering' ? 'architecture'
                                : conf.type == 'lifeSciences' ? 'public'
                                : conf.type == 'medicineHealthcare' ? 'medical_services'
                                :''
                                }</span>
                                <h3>{conf.name}</h3>
                                <p style={{ textAlign: "justify" }}>{conf.description}</p>
                                <small className="text-muted"><b>Date:</b>{conf.date ? conf.date.slice(0, 10) : ''}
                                    <br /><b>Place:</b>{conf.location}</small><br />
                                <div>
                                    <button style={{ margin: "5px" }} className="small_button" onClick={() => {window.location.href = `/callForPaper?id=${conf.id}`}}>Call for paper</button>
                                    <button style={{ margin: "5px" }} className="small_button" onClick={() => {window.location.href = `/register?id=${conf.id}&type=${conf.type}`}}>Register</button>
                                    <button style={{ margin: "5px" }} className="small_button" onClick={() => {window.location.href = `/schedule?id=${conf.id}`}}>Schedule</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>

                <div className="right">
                    <div className="announcements">
                        <h2>Announcements</h2>
                        <div className="updates">
                            <div className="message">
                                <p>
                                    <b>Technical Issues? We're Here to Help!</b> <br />
                                    If you’re experiencing any technical issues, visit the Help Desk or reach out via live chat support.
                                </p>
                            </div>
                            <div className="message">
                                <p>
                                    <b>Interactive Polls and Q&A During Sessions</b> <br />
                                    Engage with the speakers! Don’t forget to participate in live polls and ask questions during sessions.
                                </p>
                            </div>
                            <div className="message">
                                <p>
                                    <b>Virtual Expo Booths Now Open!</b> <br />
                                    Explore the latest innovations from our exhibitors. Visit the virtual expo booths and chat live with representatives.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Main;
