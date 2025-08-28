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

interface Schdeules {
    id: number;
    title: string | null;
    speaker: string | null;
    designation: string | null;
    Organization: string | null;
    abstract: string | null;
    biography: string | null;
    from_time: string | null;
    to_time: string | null;
}

type ConferencesByType = Record<string, Conference[]>;

const Main = () => {
    const [conferences, setConferences] = useState<Conference[]>([]);
    const [conferencesByType, setConferencesByType] = useState<ConferencesByType>({});
    //const [currentConference, setCurrentConference] = useState<CurrentConference | null>(null);
    const [currentConference, setCurrentConference] = useState<Conference | null>(null);
    const [schedules, setSchedules] = useState<Schdeules[]>([]);

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
                setCurrentConference(data[0])
                fetchCurrentSchdeules(data[0].id)
            } catch (error) {
                console.error('Error fetching conferences:', error);
            }
        };

        fetchConferences();
    }, []);

    const [title, setTitle] = useState('');
    const [speaker, setSpeaker] = useState('');
    const [designation, setDesignation] = useState('');
    const [Organization, setOrganization] = useState('');
    const [biography, setBiography] = useState('');
    const [abstract, setAbstract] = useState('');
    const [from_time, setFromTime] = useState('');
    const [to_time, setToTime] = useState('');


    const fetchCurrentSchdeules = async (id: number) => {
        try {
            const response = await axios.get<Schdeules[]>(`http://localhost:3000/api/schedule?id=${id}`);
            //const response = await axios.get<CurrentConference[]>(`http://localhost:3000/api/conferences?id=${id}`);
            if (response.data.length > 0)
                setSchedules(response.data);
            else
                setSchedules([])

        } catch (error) {
            console.error('Error fetching schedules:', error);
        }
    };

    const handleAddSchedule = async () => {
        if (!title) {
            alert("Enter session title")
            return;
        }
        if (!from_time) {
            alert("Enter session from time")
            return;
        }
        if (!to_time) {
            alert("Enter session to time")
            return;
        }
        if (!speaker) {
            alert("Enter speaker name")
            return;
        }
        if (!designation) {
            alert("Enter desgination")
            return;
        }
        if (!Organization) {
            alert("Enter organization")
            return;
        }
        if (!biography) {
            alert("Enter speaker biography")
            return;
        }
        if (!abstract) {
            alert("Enter session abstract/detail")
            return;
        }
        try {

            const response = await axios.post('/api/schedule', {
                conference_id: currentConference?.id,
                title: title,
                speaker: speaker,
                designation: designation,
                Organization: Organization,
                abstract: abstract,
                biography: biography,
                from_time: from_time,
                to_time: to_time
            });

            console.log('Conference added:', response.data);
            alert("Added sucessfully");
            setTitle("");
            setBiography("");
            setDesignation("");
            setOrganization("");
            setSpeaker("");
            setFromTime("");
            setToTime("");
            setSpeaker("");
            window.location.href = "/admin/schedule"

        } catch (error) {
            // Handle errors, e.g., show an error message
            alert('Error adding schedule:');
            console.error('Error adding schedule:', error);
        }
    };

    const handleScheduleChange = (index: number, field: keyof Schdeules, value: string) => {
        const updatedSchedules = [...schedules];
        updatedSchedules[index] = { ...updatedSchedules[index], [field]: value };
        setSchedules(updatedSchedules);
    };

    const handleUpdateSchedule = async (scheduleId: number, index: number) => {
        try {
            const updatedSchedule =
            {
                title: schedules[index].title,
                speaker: schedules[index].speaker,
                designation: schedules[index].designation,
                Organization: schedules[index].Organization,
                abstract: schedules[index].abstract,
                biography: schedules[index].biography,
                from_time: schedules[index].from_time,
                to_time: schedules[index].to_time,
                id: schedules[index].id
            }
            console.log(updatedSchedule)
            await axios.put(`/api/schedule`, updatedSchedule);

            alert("Schedule updated successfully");

            window.location.href = "/admin/schedule"
        } catch (error) {
            console.error("Error updating schedule:", error);
            alert("Failed to update schedule");
        }
    };

    const handleDeleteSchedule = async (scheduleId: number, index: number) => {
        if (confirm('Do you want to delete ?')) {
            try {
                const response = await axios.delete(`/api/schedule?id=${scheduleId}`);
                window.location.href = "/admin/schedule"
            } catch (error) {
                console.error('Error deleting schedule:', error);
            }
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
                    <a href="/admin/conference">
                        <span className="material-icons-sharp">book</span>
                        <h3>Conferences</h3>
                    </a>
                    <a href="/admin/schedule" className="active">
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
                                            <a style={{ color: "blue", "marginLeft": "5px" }} href="#" onClick={() => {setCurrentConference(conference), fetchCurrentSchdeules(conference.id)}}>Schedule</a>
                                        </p>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                <main id="content" style={{ "height": "450px", "overflowY": "scroll" }}>
                    <h1>{currentConference?.name}</h1>
                    <h2>{currentConference?.date?.split('T')[0]}</h2>
                    <ul>
                        <br />

                        {schedules.map((s, index) => (
                            <div>
                                <li>
                                    <h3>Session</h3>
                                    <ol>
                                        <li><strong>Time</strong>:
                                            <input
                                                value={s.from_time ? s.from_time : ''}
                                                type='time'
                                                onChange={(e) => handleScheduleChange(index, "from_time", e.target.value)}
                                                style={{ marginBottom: "10px", marginLeft: "5px", width: "16%" }}
                                            />
                                            -
                                            <input
                                                value={s.to_time ? s.to_time : ''}
                                                type='time'
                                                onChange={(e) => handleScheduleChange(index, "to_time", e.target.value)}
                                                style={{ marginBottom: "10px", marginLeft: "5px", width: "16%" }}
                                            />
                                        </li>
                                        <li><strong>Title</strong><input
                                            value={s.title ? s.title : ''}
                                            onChange={(e) => handleScheduleChange(index, "title", e.target.value)}
                                            style={{ marginBottom: "10px", marginLeft: "5px", width: "90%" }}
                                        /></li>
                                        <li><strong>Speaker</strong>: <input
                                            value={s.speaker ? s.speaker : ''}
                                            onChange={(e) => handleScheduleChange(index, "speaker", e.target.value)}
                                            style={{ marginBottom: "10px", marginLeft: "5px", width: "85%" }}
                                        /></li>
                                        <li><strong>Designation</strong>: <input
                                            value={s.designation ? s.designation : ''}
                                            onChange={(e) => handleScheduleChange(index, "designation", e.target.value)}
                                            style={{ marginBottom: "10px", marginLeft: "5px", width: "81%" }}
                                        /></li>
                                        <li><strong>Organization</strong>: <input
                                            value={s.Organization ? s.Organization : ''}
                                            onChange={(e) => handleScheduleChange(index, "Organization", e.target.value)}
                                            style={{ marginBottom: "10px", marginLeft: "5px", width: "80%" }}
                                        /></li>
                                        <li><strong>Detail/ Abstract</strong>: <br />
                                            <textarea
                                                value={s.abstract ? s.abstract : ''}
                                                onChange={(e) => handleScheduleChange(index, "abstract", e.target.value)}
                                                style={{ marginBottom: "10px", marginLeft: "5px", width: "95%" }}
                                            /></li>
                                        <li><strong>Speaker biography</strong>: <br />
                                            <textarea
                                                value={s.biography ? s.biography : ''}
                                                onChange={(e) => handleScheduleChange(index, "biography", e.target.value)}
                                                style={{ marginBottom: "10px", marginLeft: "5px", width: "95%" }}
                                            /></li>
                                    </ol>
                                    <div>
                                        <button className="small_button" onClick={() => handleUpdateSchedule(s.id, index)} style={{ "margin": "5px" }}>Update</button>
                                        <button className="small_button" onClick={() => handleDeleteSchedule(s.id, index)} style={{ "margin": "5px" }}>Delete</button>
                                    </div>
                                </li><br />
                            </div>
                        ))}
                    </ul>

                    <br />
                </main>

                <div className="right">
                    <div className="announcements">
                        <h2>Add session</h2>
                        <div className="updates">
                            <div className="conference_form" >
                                <strong>Title:</strong>
                                <input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    style={{ marginBottom: "10px", marginLeft: "5px", width: "85%" }}
                                />
                            </div>
                            <div className="conference_form" >
                                <strong>Session Time - from:</strong>
                                <input
                                    value={from_time}
                                    type='time'
                                    onChange={(e) => setFromTime(e.target.value)}
                                    style={{ marginBottom: "10px", marginLeft: "5px", width: "46%" }}
                                />
                            </div>
                            <div className="conference_form" >
                                <strong>Session Time - to:</strong>
                                <input
                                    value={to_time}
                                    type='time'
                                    onChange={(e) => setToTime(e.target.value)}
                                    style={{ marginBottom: "10px", marginLeft: "5px", width: "53%" }}
                                />
                            </div>
                            <div className="conference_form">
                                <strong>Speaker:</strong>
                                <input
                                    value={speaker}
                                    onChange={(e) => setSpeaker(e.target.value)}
                                    style={{ marginBottom: "10px", marginLeft: "5px", width: "75%" }}
                                />
                            </div>
                            <div className="conference_form">
                                <strong>Designation:</strong>
                                <input
                                    value={designation}
                                    onChange={(e) => setDesignation(e.target.value)}
                                    style={{ marginBottom: "10px", marginLeft: "5px", width: "65%" }}
                                />
                            </div>
                            <div className="conference_form">
                                <strong>Organization:</strong>
                                <input
                                    value={Organization}
                                    onChange={(e) => setOrganization(e.target.value)}
                                    style={{ marginBottom: "10px", marginLeft: "5px", width: "62%" }}
                                />
                            </div>
                            <div className="conference_form">
                                <strong>Biography:</strong>
                                <textarea
                                    value={biography}
                                    onChange={(e) => setBiography(e.target.value)}
                                    style={{ height: "50px" }}
                                />
                            </div>
                            <div className="conference_form">
                                <strong>Abstract:</strong>
                                <textarea
                                    value={abstract}
                                    onChange={(e) => setAbstract(e.target.value)}
                                    style={{ height: "50px" }}
                                />
                            </div>

                            <button
                                className="btn"
                                style={{ margin: "5px" }}
                                onClick={handleAddSchedule}
                            >
                                Add
                            </button>
                        </div>
                    </div>



                </div>
            </div>
        </div>
    );
};

export default Main;

