"use client";
import axios from 'axios';
import React, { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';

declare global {
    interface Window {
      html2pdf: any;
    }
}

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

interface Speaker {
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
    const searchParams = useSearchParams();
    const conferenceId = searchParams?.get('id');

    const [conferences, setConferences] = useState<Conference[]>([]);
    const [conferencesByType, setConferencesByType] = useState<ConferencesByType>({});
    //const [currentConference, setCurrentConference] = useState<CurrentConference | null>(null);
    const [currentConference, setCurrentConference] = useState<Conference | null>(null);
    const [schedules, setSchedules] = useState<Schdeules[]>([]);
    const [speakerDetail, setSpeakerDetail] = useState<Speaker | null>(null);

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
                
                var currentCon = data[0].id
                if(conferenceId)
                {
                    currentCon = Number(conferenceId)
                }
                
                data.map((c) => {
                    
                    if(c.id == Number(currentCon))
                    {
                        console.log(c)
                        setCurrentConference(c)
                    
                    }
                })
                
                fetchCurrentSchdeules(currentCon)

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
            console.log('---------------')
            console.log(response)
            if (response.data.length > 0)
            {
                setSchedules(response.data);
                setSpeakerDetail(response.data[0]);
            }
            else
            {
                setSchedules([]);
                setSpeakerDetail(null);
            }
        } catch (error) {
            console.error('Error fetching schedules:', error);
        }
    };

    const handleOpenSpeaker = async (scheduleId: number, index: number) => {
        const updatedSchedules = [...schedules];
        setSpeakerDetail(updatedSchedules[index])
    };

    const handleDownload = async () => {
        var content = document.getElementById('content');

        var originalHeight = content?.style.height;

        var fullHeight = content?.scrollHeight + 'px';
        if(content)
        {
            content.style.height = fullHeight;
            content.style.overflow = 'visible';
        }

        window.html2pdf()
            .from(content)
            .set({
                margin: 1,              
                filename: 'conference-schedule.pdf', 
                html2canvas: { scale: 2 }, 
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
            })
            .save()
            .then(() => {
                if(content)
                {
                    //content.style.height = originalHeight;
                    content.style.overflow = "scroll";
                }
            });
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
                    <a href="schedule" className="active">
                        <span className="material-icons-sharp">today</span>
                        <h3>Schedule</h3>
                    </a>
                    <a href="joinVirtualConference">
                        <span className="material-icons-sharp">view_in_ar</span>
                        <h3>Virtual Conference</h3>
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
                                            <a style={{ color: "blue", "marginLeft": "5px" }} href="#" onClick={() => {setCurrentConference(conference), fetchCurrentSchdeules(conference.id)}}>check schedule</a>
                                        </p>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                <main id="content" style={{ "height": "450px", "overflowY": "scroll" }}>
                <span className="material-symbols-outlined" style={{ "float": "right", "color": "#03a9f4", "marginRight":"5px", "fontSize": "35px" }} onClick={(e) => handleDownload()}>download</span>
                    <h1>{currentConference?.name}</h1>
                    <h2>{currentConference?.date?.split('T')[0]}</h2>
                    <ul>
                        <br />

                        {schedules.map((s, index) => (
                            <div>
                                <li>
                                    <h3>Session</h3>
                                    <h3>Keynote Session</h3>
                                    <ol>
                                        <li><strong>Time</strong>:
                                            <input
                                                value={s.from_time ? s.from_time : ''}
                                                type='time'
                                                style={{ marginBottom: "10px", marginLeft: "5px", width: "16%" }}
                                                disabled
                                            />
                                            -
                                            <input
                                                value={s.to_time ? s.to_time : ''}
                                                type='time'
                                                style={{ marginBottom: "10px", marginLeft: "5px", width: "16%" }}
                                                disabled
                                            />
                                        </li>
                                        <li><strong>Title</strong>: {s.title}</li>
                                        <li><strong>Speaker</strong>: {s.speaker}</li>
                                        <li><strong>Details</strong>: {s.abstract}</li>
                                    </ol>
                                    <div>
                                        <button className="small_button" onClick={() => handleOpenSpeaker(s.id, index)} style={{ "margin": "5px" }}>Speaker</button>
                                    </div>
                                </li><br />
                            </div>
                        ))}
                    </ul>

                    <br />
                </main>

                <div className="right">
                    <div className="announcements">
                        <h2>Speaker Profile</h2>
                        <div className="updates">
                            <div className="message">
                                <div style={{ "display": "flex" }}>
                                    <div className="profile-photo"><img src="/assets/img/user.png" alt="" /></div>
                                    <div className="info">
                                        <h3>{speakerDetail?.speaker}</h3>
                                        <small className="text-muted">{speakerDetail?.designation}, {speakerDetail?.Organization}</small>
                                    </div>
                                </div>

                            </div>
                            <div className="message">
                                <p>
                                    <b>Biography</b> <br />
                                    {speakerDetail?.biography}
                                </p>
                            </div>
                            <div className="message">
                                <p>
                                    <b>Presentation</b> <br />
                                    <b>Title:</b> {speakerDetail?.title}<br />
                                    <b>Date:</b> {currentConference?.date?.split('T')[0]}<br />
                                    <b>Time:</b><input
                                        value={speakerDetail?.from_time ? speakerDetail?.from_time : ''}
                                        type='time'
                                        style={{ marginBottom: "10px", marginLeft: "5px", width: "36%" }}
                                        disabled
                                    />
                                    -
                                    <input
                                        value={speakerDetail?.to_time ? speakerDetail?.to_time : ''}
                                        type='time'
                                        style={{ marginBottom: "10px", marginLeft: "5px", width: "36%" }}
                                        disabled
                                    /><br />
                                    <b>Abstract:</b> {speakerDetail?.abstract}
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