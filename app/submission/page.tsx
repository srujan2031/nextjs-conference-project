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
}
type ConferencesByType = Record<string, Conference[]>;

const Main = () => {
    const searchParams = useSearchParams();
    const conferenceId = searchParams?.get('id');
    const conferenceType = searchParams?.get('type');

    const [conferencesByType, setConferencesByType] = useState<ConferencesByType>({});
    const [selectedResearchArea, setSelectedResearchArea] = useState('');
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

                setConferencesByType(groupedConferences);
                setSelectedResearchArea(conferenceType ? conferenceType : '')
                setCurrentConferencId(conferenceId ? conferenceId : '')
            } catch (error) {
                console.error('Error fetching conferences:', error);
            }
        };

        fetchConferences();


    }, []);

    const handleResearchAreaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedResearchArea(event.target.value);
    };

    const handleCurrentConferenceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setCurrentConferencId(event.target.value);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const fields = [
            { id: 'paperTitle', label: 'Paper Title' },
            { id: 'research', label: 'Research Area', value: selectedResearchArea },
            { id: 'conferenceid', label: 'Conference' },
            { id: 'author', label: 'Author' },
            { id: 'designation', label: 'Designation' },
            { id: 'institute', label: 'Institute/Organization' },
            { id: 'phone', label: 'Phone Number' },
            { id: 'email', label: 'Email' },
            { id: 'file', label: 'File', isFile: true }
        ];
        var emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        var phoneRegex = /^[0-9]{10}$/;

        for (const field of fields) {
            const element = document.getElementById(field.id) as HTMLInputElement | HTMLSelectElement;
            const value = field.isFile
                ? (element as HTMLInputElement).files?.length
                : field.value || element.value;
            if (field.label == 'Email' && value && !element.value.match(emailRegex)) {
                alert(`Enter the valid email`);
                return;
            }
            if (field.label == 'Phone Number' && value && !element.value.match(phoneRegex)) {
                alert(`Enter the valid phone, 10 digits`);
                return;
            }
            if (!value) {
                alert(`Please fill out the ${field.label} field.`);
                element.focus();
                return;
            }
        }

        const formData = new FormData();
        formData.append('paperTitle', (document.getElementById('paperTitle') as HTMLInputElement).value);
        formData.append('researchArea', selectedResearchArea);
        formData.append('conferenceId', (document.getElementById('conferenceid') as HTMLSelectElement).value);
        formData.append('author', (document.getElementById('author') as HTMLInputElement).value);
        formData.append('designation', (document.getElementById('designation') as HTMLInputElement).value);
        formData.append('institute', (document.getElementById('institute') as HTMLInputElement).value);
        formData.append('phone', (document.getElementById('phone') as HTMLInputElement).value);
        formData.append('email', (document.getElementById('email') as HTMLInputElement).value);

        const fileInput = document.getElementById('file') as HTMLInputElement;
        if (fileInput.files && fileInput.files[0]) {
            formData.append('file', fileInput.files[0]);
        }

        var user = await axios.get(`/api/users?id=${(document.getElementById('email') as HTMLInputElement).value}`);
        console.log(user)
        if (user && user.data && user.data.length == 0) {
            alert("User not found. please signup as author first and submit the paper");
            return
        }
        else {
            if (user.data[0].usertype != 'author') {
                alert("User not found. please signup as author first and submit the paper");
                return
            }
        }
        // Call the API to submit the paper
        try {
            const response = await axios.post('/api/submitPaper', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert(response.data.message);
            const data = {
                email: (document.getElementById('email') as HTMLInputElement).value,
                subject: "Paper submission",
                message: response.data.message,
                method: 'common'
            }

            axios.post(`http://mailer.lxg4919.uta.cloud/mailer`, JSON.stringify(data))
                .then(res => {
                    console.log(res);
                    console.log(res.data);
                    if (res.data.status == 'ok') {
                        alert("Paper submission successful, Confirmation mail has been sent to your mail address");
                    }
                    else {
                        alert(res.data.message)
                    }
                })
        } catch (error) {
            console.error('Error submitting paper:', error);
            alert('Failed to submit paper.');
        }
    };

    const handleCancel = () => {
        (document.getElementById('paperTitle') as HTMLInputElement).value = '';
        setSelectedResearchArea('');
        (document.getElementById('conferenceid') as HTMLSelectElement).value = '';
        (document.getElementById('author') as HTMLInputElement).value = '';
        (document.getElementById('designation') as HTMLInputElement).value = '';
        (document.getElementById('institute') as HTMLInputElement).value = '';
        (document.getElementById('phone') as HTMLInputElement).value = '';
        (document.getElementById('email') as HTMLInputElement).value = '';
        (document.getElementById('file') as HTMLInputElement).value = '';
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
                    <a href="submission" className="active">
                        <span className="material-icons-sharp">send</span>
                        <h3>Submission</h3>
                    </a>
                    <a href="register">
                        <span className="material-icons-sharp">app_registration</span>
                        <h3>Register</h3>
                    </a>
                    <a href="signup">
                        <span className="material-icons-sharp">person_add</span>
                        <h3>Signup</h3>
                    </a>
                </div>
            </header>
            <div className="submission-container">
                <form onSubmit={handleSubmit}>
                    <h2>Paper Submission</h2>
                    <div className="box">
                        <p className="text-muted">Paper title</p>
                        <input type="text" id="paperTitle" />
                    </div>
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
                        <select name="conferenceid" id="conferenceid" value={currentConferencId} onChange={handleCurrentConferenceChange}>
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
                        <p className="text-muted">Author name</p>
                        <input type="text" id="author" />
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
                        <p className="text-muted">Upload paper</p>
                        <input type="file" id="file" accept="application/pdf" />
                    </div>
                    <div className="button">
                        <button type="button" onClick={handleSubmit} className="btn">Submit</button>
                        <button type="button" onClick={handleCancel} className="text-muted">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Main;