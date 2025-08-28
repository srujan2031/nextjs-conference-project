"use client";
import axios from 'axios';
import React, { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';

interface Conference {
    id: number; // Adjust type based on your database schema
    name: string;
    type: string;
    location: string;
}

// Define the type for grouped conferences
type ConferencesByType = Record<string, Conference[]>;

interface CurrentConference {
    id: number; // Assume you have an ID for updating
    name: string;
    date: string | null; // Allow for null values
    location: string;
    type: string;
    description: string | null;
    paper_submission_date: string | null;
    notification_date: string | null;
    cameraready_date: string | null;
    registration_date: string | null;
    originality: string | null;
    plagiarism: string | null;
    language_: string | null; // Changed to match your response key
    file_format: string | null;
    length: string | null;
    font: string | null;
    title_page: string | null;
    abstract: string | null;
    introduction: string | null;
}

const Main = () => {
    const searchParams = useSearchParams();
    const conferenceId = searchParams?.get('id');

    const [conferences, setConferences] = useState<Conference[]>([]);
    const [conferencesByType, setConferencesByType] = useState<ConferencesByType>({});
    const [currentConference, setCurrentConference] = useState<CurrentConference | null>(null);
    const [firstId, setFirstId] = useState(Number);
    const [paramConfrenceId, setParamConfrenceId] = useState('');

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
                var firstId = data[0].id;
                if(conferenceId)
                {
                    firstId = Number(conferenceId)
                }
                console.log(conferenceId)
                setFirstId(firstId)
                console.log("first--"+firstId)
                fetchCurrentConference(firstId);
            } catch (error) {
                console.error('Error fetching conferences:', error);
            }
        };

        fetchConferences();

        const fetchCurrentConference = async (id: number) => {
            try {
                // const response = await axios.get<CurrentConference>(`http://localhost:3000/api/conferences?id=${id}`);
                const response = await axios.get<CurrentConference[]>(`http://localhost:3000/api/conferences?id=${id}`);
                setCurrentConference(response.data[0]);

            } catch (error) {
                console.error('Error fetching conference:', error);
            }
        };
    }, []);

    const fetchCurrentConference = async (id: number) => {
        try {
            // const response = await axios.get<CurrentConference>(`http://localhost:3000/api/conferences?id=${id}`);
            const response = await axios.get<CurrentConference[]>(`http://localhost:3000/api/conferences?id=${id}`);
            setCurrentConference(response.data[0]);

        } catch (error) {
            console.error('Error fetching conference:', error);
        }
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
                    <a href="callForPaper" className="active">
                        <span className="material-icons-sharp">ring_volume</span>
                        <h3>Call for Paper</h3>
                    </a>
                    <a href="mentorship">
                        <span className="material-icons-sharp">school</span>
                        <h3>Mentorship</h3>
                    </a>
                    <a href="submission">
                        <span className="material-icons-sharp">send</span>
                        <h3>Submission</h3>
                    </a>
                    <a href="register">
                        <span className="material-icons-sharp">app_registration</span>
                        <h3>Register</h3>
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
                                            {conference.name}
                                            <a style={{ color: "blue", "marginLeft": "5px" }} href="#" onClick={() => fetchCurrentConference(conference.id)}>See</a>
                                        </p>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                <main>
                <h1>{currentConference ? currentConference.name : ''}</h1>
                    <ul>
                        <br />
                        <li><h3>General Submission Requirements</h3>
                            <ol>
                                <li><strong>Originality</strong>: {currentConference ? currentConference.originality : ''}</li>
                                <li><strong>Plagiarism</strong>: {currentConference ? currentConference.plagiarism : ''}</li>
                                {/* <li><strong>Language</strong>: {currentConference ? currentConference.language_ : ''}</li> */}
                            </ol>
                        </li>
                        <br />
                        <li><strong>Formatting Guidelines</strong>
                            <ol>
                                <li><strong>File Format</strong>: {currentConference ? currentConference.file_format : ''}</li>
                                <li><strong>Length</strong>: {currentConference ? currentConference.length : ''}</li>
                                <li><strong>Font</strong>: {currentConference ? currentConference.font : ''}</li>
                            </ol>
                        </li>
                        <br />
                        <li><strong>Content Structure</strong>
                            <ol>
                                <li><strong>Title Page</strong>: {currentConference ? currentConference.title_page : ''}</li>
                                <li><strong>Abstract</strong>: {currentConference ? currentConference.abstract : ''}</li>
                                <li><strong>Introduction</strong>: {currentConference ? currentConference.introduction : ''}</li>
                            </ol>
                        </li>
                    </ul>
                    <br />
                    <div>
                        <button className="small_button" style={{ "margin": "5px" }} onClick={() => {window.location.href = `/submission?id=${currentConference?.id}&type=${currentConference?.type}`}}>Submit paper</button>
                        <button className="small_button" style={{ "margin": "5px" }} onClick={() => {window.location.href = `/register?id=${currentConference?.id}&type=${currentConference?.type}`}}>Register</button>
                    </div>
                    <br />
                    <div className="home_cards">
                        <div className="eg">
                            <h3 style={{ "margin": "0px" }}>Important dates</h3>
                            <ul>
                                <li><strong>Paper Submission Deadline:</strong> {currentConference && currentConference.paper_submission_date ? currentConference.paper_submission_date.slice(0,10) : ''}</li>
                                <li><strong>Notification of Acceptance:</strong> {currentConference && currentConference.notification_date ? currentConference.notification_date.slice(0,10) : ''}</li>
                                <li><strong>Camera-Ready Paper Submission Deadline:</strong> {currentConference && currentConference.cameraready_date ? currentConference.cameraready_date.slice(0,10) : ''}</li>
                                <li><strong>Registration Deadline:</strong> {currentConference && currentConference.registration_date ? currentConference.registration_date.slice(0,10) : ''}</li>
                                <li><strong>Conference Dates:</strong> {currentConference && currentConference.date ? currentConference.date.slice(0,10) : ''}</li>
                            </ul>

                        </div>

                    </div>
                </main>

                <div className="right">
                    <div className="announcements">
                        <h2>FAQ's</h2>
                        <div className="updates">
                            <div className="message">
                                <p>
                                    <b>How do I submit a paper?</b> <br />
                                    You can submit your paper by clicking "Submit Paper" provided in call for paper page for each conference
                                </p>
                            </div>
                            <div className="message">
                                <p>
                                    <b>What file formats are accepted for submission?</b> <br />
                                    Check the guidelines provided for each conference in call for paper page
                                </p>
                            </div>
                            <div className="message">
                                <p>
                                    <b> What is the paper review process?</b> <br />
                                    Once submitted, papers undergo a peer review process. Reviewers will assess your paper based on originality, relevance, and scientific rigor.
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
