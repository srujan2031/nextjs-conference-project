"use client";
import axios from 'axios';
import React, { useEffect, useState } from "react";

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
    language_: string | null; 
    file_format: string | null;
    length: string | null;
    font: string | null;
    title_page: string | null;
    abstract: string | null;
    introduction: string | null;
    fee: number | null;
}
const Main = () => {
    const [conferences, setConferences] = useState<Conference[]>([]);
    const [conferencesByType, setConferencesByType] = useState<ConferencesByType>({});
    const [currentConference, setCurrentConference] = useState<CurrentConference | null>(null);
    const [firstId, setFirstId] = useState(Number);

    // Equivalent of componentDidMount
    useEffect(() => {
        const fetchConferences = async () => {
            try {
                const response = await axios.get<Conference[]>('/api/conferences');
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
                const firstId = data[0].id;
                setFirstId(firstId)
                fetchCurrentConference(firstId);
            } catch (error) {
                console.error('Error fetching conferences:', error);
            }
        };

        fetchConferences();

        const fetchCurrentConference = async (id: number) => {
            try {
                // const response = await axios.get<CurrentConference>(`http://localhost:3000/api/conferences?id=${id}`);
                const response = await axios.get<CurrentConference[]>(`/api/conferences?id=${id}`);
                setCurrentConference(response.data[0]);

            } catch (error) {
                console.error('Error fetching conference:', error);
            }
        };



    }, []); // Empty dependency array means it runs once on mount

    const [type, setType] = useState('');
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');

    // Step 2: Create a function to handle form submission
    const handleAddConference = async () => {
        if (!type) {
            alert("Select type")
            return;
        }
        if (!title) {
            alert("Enter title")
            return;
        }
        if (!location) {
            alert("Enter location")
            return;
        }
        try {

            const response = await axios.post('/api/conferences', {
                name: title,
                type: type,
                location: location
            });

            console.log('Conference added:', response.data);
            alert("Added sucessfully");
            setTitle("");
            setLocation("");
            setType("");
            window.location.href = "/admin/conference"

        } catch (error) {
            // Handle errors, e.g., show an error message
            alert('Error adding conference:');
            console.error('Error adding conference:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>) => {
        if (currentConference) {
            setCurrentConference({ ...currentConference, [e.target.id]: e.target.value });
        }
    };

    const handleUpdate = async () => {
        if (currentConference) {
            console.log(currentConference)
            try {
                await axios.put(`/api/conferences`, currentConference);
                alert('Conference updated successfully');
            } catch (error) {
                console.error('Error updating conference:', error);
            }
        }
    };

    const fetchCurrentConference = async (id: number) => {
        try {
            // const response = await axios.get<CurrentConference>(`http://localhost:3000/api/conferences?id=${id}`);
            const response = await axios.get<CurrentConference[]>(`/api/conferences?id=${id}`);
            setCurrentConference(response.data[0]);

        } catch (error) {
            console.error('Error fetching conference:', error);
        }
    };

    const deleteCurrentConference = async (id: number) => {
        if (confirm('Do you want to delete ?')) {
            try {
                // const response = await axios.get<CurrentConference>(`http://localhost:3000/api/conferences?id=${id}`);
                const response = await axios.delete(`/api/conferences?id=${id}`);
                window.location.href = "/admin/conference"
            } catch (error) {
                console.error('Error deleting conference:', error);
            }
        }
    };

    // if (!currentConference) return <div>Loading...</div>;

    return (
        <div>
            <header>
                <div className="logo" title="Conference Management System">
                    <img src="/assets/img/logo.png" alt="CMS" />
                    <h2>C<span className="danger">M</span>S</h2>
                </div>
                <div className="navbar">
                    <a href="/admin/conference" className="active">
                        <span className="material-icons-sharp">book</span>
                        <h3>Conferences</h3>
                    </a>
                    <a href="/admin/schedule">
                        <span className="material-icons-sharp">view_list</span>
                        <h3>Schedule</h3>
                    </a>
                    <a href="/login">
                        <span className="material-icons-sharp">logout</span>
                        <h3>Logout</h3>
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
                                            <a style={{ color: "blue", "marginLeft": "5px" }} href="#" onClick={() => fetchCurrentConference(conference.id)}>Edit</a>
                                            <a style={{ color: "blue", "marginLeft": "5px" }} href="#" onClick={() => deleteCurrentConference(conference.id)}>Delete</a>
                                        </p>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                <main id="content" style={{ height: "450px", overflowY: "scroll" }} className="conference_form">
                    <h1>{currentConference ? currentConference.name : ''}</h1>
                    <ul>
                        <br />
                        <li>
                            <h2>Conference details</h2>
                            <ol>
                                <li>
                                    <strong>Type:</strong>
                                    <select id="type" value={currentConference ? currentConference.type : ''} onChange={handleChange}>
                                        <option value=""></option>
                                        <option value="mathematics">Mathematics</option>
                                        <option value="engineering">Engineering</option>
                                        <option value="lifeSciences">Life Sciences</option>
                                        <option value="medicineHealthcare">Medicine & Healthcare</option>
                                        <option value="socialSciences">Social Sciences</option>
                                    </select>
                                </li>
                                <li>
                                    <strong>Description:</strong>
                                    <textarea id="description" style={{ height: "75px" }} value={currentConference ? currentConference.description || '' : ''} onChange={handleChange} />
                                </li>
                                <li>
                                    <strong>Place:</strong>
                                    <textarea id="location" style={{ height: "30px" }} value={currentConference ? currentConference.location || '' : ''} onChange={handleChange} />
                                </li>
                            </ol>
                        </li><br />
                        <li>
                            <h2>Important dates</h2>
                            <ol>
                                <li>
                                    <strong>Paper submission date:</strong>
                                    <input type="date" id="paper_submission_date" value={currentConference?.paper_submission_date ? (() => {
                                        const date = new Date(currentConference.paper_submission_date);
                                        date.setDate(date.getDate() + 1); // Add 1 day
                                        return date.toISOString().slice(0, 10); // Format as YYYY-MM-DD
                                    })() : ''} onChange={handleChange} />
                                </li>
                                <li>
                                    <strong>Notification of acceptance:</strong>
                                    <input type="date" id="notification_date" value={currentConference?.notification_date ? (() => {
                                        const date = new Date(currentConference.notification_date);
                                        date.setDate(date.getDate() + 1); // Add 1 day
                                        return date.toISOString().slice(0, 10); // Format as YYYY-MM-DD
                                    })()
                                        : ''} onChange={handleChange} />
                                </li>
                                <li>
                                    <strong>Camera-Ready Paper Submission Deadline:</strong>
                                    <input type="date" id="cameraready_date" value={currentConference?.cameraready_date ? (() => {
                                        const date = new Date(currentConference.cameraready_date);
                                        date.setDate(date.getDate() + 1); // Add 1 day
                                        return date.toISOString().slice(0, 10); // Format as YYYY-MM-DD
                                    })()
                                        : ''} onChange={handleChange} />
                                </li>
                                <li>
                                    <strong>Registration Deadline:</strong>
                                    <input type="date" id="registration_date" value={currentConference?.registration_date ? (() => {
                                        const date = new Date(currentConference.registration_date);
                                        date.setDate(date.getDate() + 1); // Add 1 day
                                        return date.toISOString().slice(0, 10); // Format as YYYY-MM-DD
                                    })()
                                        : ''} onChange={handleChange} />
                                </li>
                                <li>
                                    <strong>Conference Dates:</strong>
                                    <input type="date" id="date" value={currentConference?.date ? (() => {
                                        const date = new Date(currentConference.date);
                                        date.setDate(date.getDate() + 1); // Add 1 day
                                        return date.toISOString().slice(0, 10); // Format as YYYY-MM-DD
                                    })()
                                        : ''} onChange={handleChange} />
                                </li>
                            </ol>
                        </li><br />
                        <li>
                            <h2>Submission requirement</h2>
                            <ol>
                                <li>
                                    <strong>Originality:</strong>
                                    <textarea id="originality" style={{ height: "40px" }} value={currentConference ? currentConference.originality || '' : ''} onChange={handleChange} />
                                </li>
                                <li>
                                    <strong>Plagiarism:</strong>
                                    <textarea id="plagiarism" style={{ height: "40px" }} value={currentConference ? currentConference.plagiarism || '' : ''} onChange={handleChange} />
                                </li>
                                {/* <li>
                                    <strong>Language:</strong>
                                    <textarea id="language" style={{ height: "40px" }} value={currentConference ? currentConference.language_ || '' : ''} onChange={handleChange} />
                                </li> */}
                                <li>
                                    <strong>File Format:</strong>
                                    <textarea id="file_format" style={{ height: "40px" }} value={currentConference ? currentConference.file_format || '' : ''} onChange={handleChange} />
                                </li>
                                <li>
                                    <strong>Length:</strong>
                                    <textarea id="length" style={{ height: "40px" }} value={currentConference ? currentConference.length || '' : ''} onChange={handleChange} />
                                </li>
                                <li>
                                    <strong>Font:</strong>
                                    <textarea id="font" style={{ height: "40px" }} value={currentConference ? currentConference.font || '' : ''} onChange={handleChange} />
                                </li>
                                <li>
                                    <strong>Title Page:</strong>
                                    <textarea id="title_page" style={{ height: "40px" }} value={currentConference ? currentConference.title_page || '' : ''} onChange={handleChange} />
                                </li>
                                <li>
                                    <strong>Abstract:</strong>
                                    <textarea id="abstract" style={{ height: "40px" }} value={currentConference ? currentConference.abstract || '' : ''} onChange={handleChange} />
                                </li>
                                <li>
                                    <strong>Introduction:</strong>
                                    <textarea id="introduction" style={{ height: "40px" }} value={currentConference ? currentConference.introduction || '' : ''} onChange={handleChange} />
                                </li>

                                <li>
                                    <strong>Registration fee ($):</strong>
                                    <input id="fee" type='number' style={{ height: "40px" }} value={currentConference ? currentConference.fee || '' : ''} onChange={handleChange} />
                                </li>
                            </ol>
                        </li>
                    </ul>
                    <button className="btn" style={{ margin: "5px" }} onClick={handleUpdate}>Update</button>
                    <br />
                </main>

                <div className="right">
                    <div className="announcements">
                        <h2>Add new</h2>
                        <div className="updates">
                            <div className="conference_form">
                                <strong>Type:</strong>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)} // Update state on change
                                >
                                    <option value=""></option>
                                    <option value="mathematics">Mathematics</option>
                                    <option value="engineering" selected>Engineering</option>
                                    <option value="lifeSciences">Life Sciences</option>
                                    <option value="medicineHealthcare">Medicine & Healthcare</option>
                                    <option value="socialSciences">Social Sciences</option>
                                </select>
                            </div>
                            <div className="conference_form">
                                <strong>Title:</strong>
                                <textarea
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)} // Update state on change
                                    style={{ height: "40px" }}
                                />
                            </div>
                            <div className="conference_form">
                                <strong>Location:</strong>
                                <textarea
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)} // Update state on change
                                    style={{ height: "50px" }}
                                />
                            </div>

                            <button
                                className="btn"
                                style={{ margin: "5px" }}
                                onClick={handleAddConference} // Call the function on button click
                            >
                                Add
                            </button>
                        </div>
                    </div>



                </div>
            </div>
        </div >

    );
};

export default Main;
