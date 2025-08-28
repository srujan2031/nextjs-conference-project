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
    const [conferences, setConferences] = useState<Conference[]>([]);
    const [currentConferenceFee, setCurrentConferenceFee] = useState(Number);
    const [currentConferencId, setCurrentConferencId] = useState('');

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
                setConferences(data)
                setConferencesByType(groupedConferences);
                setSelectedResearchArea(conferenceType ? conferenceType : '')
                setCurrentConferencId(conferenceId ? conferenceId : '')
                data.map((c) => {
                    if (c.id == Number(conferenceId))
                        setCurrentConferenceFee(c.fee);
                })
            } catch (error) {
                console.error('Error fetching conferences:', error);
            }
        };

        fetchConferences();

    }, []);

    const handleResearchAreaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedResearchArea(event.target.value);
    };

    const handleConferenceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setCurrentConferencId(event.target.value)
        conferences.map((c) => {
            if (c.id == Number(event.target.value))
                setCurrentConferenceFee(c.fee);
        })

    };

    const handleSubmit = () => {
        var research = document.getElementById('research') as HTMLInputElement | HTMLInputElement;
        var conference = document.getElementById('conferenceid') as HTMLInputElement | HTMLInputElement;
        var paper = document.getElementById('paperid') as HTMLInputElement | HTMLInputElement;
        var fee = document.getElementById('fee') as HTMLInputElement | HTMLInputElement;

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

        if (!paper.value) {
            alert('Enter paper id');
            paper.focus()
            return
        }

        window.location.href = '/payment?id=' + paper.value + '&fee=' + fee.value
    };

    const handleCancel = () => {
        var research = document.getElementById('research') as HTMLInputElement | HTMLInputElement;
        var conference = document.getElementById('conferenceid') as HTMLInputElement | HTMLInputElement;
        var paper = document.getElementById('paperid') as HTMLInputElement | HTMLInputElement;
        var fee = document.getElementById('fee') as HTMLInputElement | HTMLInputElement;

        research.value = '';
        conference.value = '';
        paper.value = ''
        // fee.value = ;
    };

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
                    <a href="register" className="active">
                        <span className="material-icons-sharp">app_registration</span>
                        <h3>Register</h3>
                    </a>

                </div>
            </header>
            <div className="submission-container">
                <form action="">
                    <h2>Register</h2>
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
                        <p className="text-muted">Conference</p>
                        <select name="conferenceid" id="conferenceid" value={currentConferencId} onChange={handleConferenceChange}>
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
                        <p className="text-muted">Paper ID (have been sent to you through mail after paper submission)</p>
                        <input type="text" id="paperid" />
                    </div>
                    <div className="box">
                        <p className="text-muted">Registration Fee</p>
                        <input type="text" id="fee" value={currentConferenceFee} disabled />

                    </div>

                    <div className="button">
                        <input value="Register" className="btn" onClick={handleSubmit} />
                        <a href="#" className="text-muted" onClick={handleCancel}>Cancel</a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Main;
