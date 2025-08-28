"use client";
import axios from 'axios';
import React, { useEffect, useState } from "react";

interface Mentors {
    id: number;
    name: string;
    designation: string;
    institute: string;
}

const Articles = [
    {
        name: "10 Steps to Fast-Track Your Career in Tech",
        description: "This article offers actionable steps for accelerating your career in the tech industry, including setting clear goals, building a personal brand, and networking effectively.",
        link: "https://example.com/fast-track-your-career-tech"
    },
    {
        name: "The Ultimate Guide to Networking for Career Success",
        description: "A comprehensive guide on how to leverage networking both online and offline, with tips on making meaningful connections, maintaining relationships, and using networking to open doors.",
        link: "https://example.com/networking-career-success"
    },
    {
        name: "How to Navigate Career Transitions Successfully",
        description: "Learn strategies for making smooth career transitions, whether moving to a new industry, advancing to a leadership role, or switching to a technical career path.",
        link: "https://example.com/career-transitions-guide"
    },
    {
        name: "Skills to Master for a Future-Proof Career",
        description: "An article focusing on essential skills that will remain valuable in a rapidly changing job market, from technical abilities to soft skills like adaptability and problem-solving",
        link: "https://example.com/future-proof-career-skills"
    },
    {
        name: "Understanding and Negotiating Job Offers",
        description: "A detailed guide to negotiating job offers, covering everything from salary negotiation to understanding benefits and other perks to get the best package.",
        link: "https://example.com/negotiating-job-offers"
    }
]

const Workshops = [
    {
        name: "Breaking into the Tech Industry: A Beginner’s Workshop",
        description: "A virtual workshop that covers the basics of entering the tech industry, including skills, career paths, and networking strategies for beginners.",
        link: "https://example.com/breaking-into-tech"
    },
    {
        name: "Mastering Public Speaking for Career Growth",
        description: "This interactive webinar will help participants build confidence in public speaking, a crucial skill for career advancement.",
        link: "https://example.com/public-speaking-webinar"
    },
    {
        name: "Advanced Project Management Techniques",
        description: "A hands-on workshop where attendees will learn advanced project management methodologies and tools, ideal for those in or moving towards management roles.",
        link: "https://example.com/project-management-workshop"
    },
    {
        name: "LinkedIn Optimization: Creating a Profile That Gets Noticed",
        description: "his workshop provides insights on optimizing LinkedIn profiles for maximum impact, covering everything from headlines to building connections.",
        link: "https://example.com/linkedin-optimization-workshop"
    },
    {
        name: "Building Your Career Development Plan",
        description: "A webinar designed to help professionals map out a personalized career development plan, with tips on setting goals, skill assessments, and identifying opportunities for growth.",
        link: "https://example.com/career-development-webinar"
    }
]

const Main = () => {
    useEffect(() => {   

    }, []);

    const handelSubmit = async () => {
        var jobType = document.getElementById('jobType') as HTMLInputElement | HTMLInputElement;
        var email = document.getElementById('email') as HTMLInputElement | HTMLInputElement;

        var emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

        if (!email.value || !email.value.match(emailRegex)) {
            alert('Enter the valid email');
            email.focus()
            return
        }
        if (!jobType.value) {
            alert('Select job type');
            jobType.focus()
            return
        }
        

        var user = await axios.get(`/api/users?id=${email.value}`);
        console.log(user)
        if (user && user.data && user.data.length == 0) {
            alert("User not found")
            return
        }

        const data = {
            email: email.value,
            subject: "Job opportunity notification subscription Successful",
            message: "Subscribe to get the notification about jo opportunities for the field " +  jobType.value,
            method: 'common'
        }

        axios.post(`http://mailer.cxe1504.uta.cloud/mailer`, JSON.stringify(data))
            .then(res => {
                console.log(res);
                console.log(res.data);
                if (res.data.status == 'ok') {
                    alert("Subscription successful, Confirmation mail has been sent to your mail address");
                }
                else {
                    alert(res.data.message)
                }
            })
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
                    <a href="mentorship" >
                        <span className="material-icons-sharp">school</span>
                        <h3>Mentorship</h3>
                    </a>
                    <a href="career" className="active">
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
                        <h3>Workshops/webinars</h3>
                        <div className="about" style={{ height: "420px", overflowY: "scroll" }}>
                            {Workshops.map((m) => (
                                <div >
                                    <p>
                                        {m.name}<br />
                                        <a style={{ color: "blue" }}  href={m.link}>link</a>
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                <main id="content">
                    <h1>Articles and guides on career advancement</h1>
                    
                    <div className="home_cards">
                        {Articles.map((m) => (
                            <div className="eg">

                                <h3>{m.name}</h3>
                                <p style={{ textAlign: "justify" }}>{m.description}</p>
                                <small className="text-muted"><b>Link:</b><a href={m.link}>{m.link}</a></small><br />
                            </div>
                        ))}
                    </div>
                </main>

                <div className="right">
                    <div className="announcements">
                        <h2>Job opportunity notification</h2>
                        <div className="updates">
                            <div className="message">
                                <p>
                                    <b>Subscribe</b> <br />
                                </p>
                            </div>
                            <div className="box reviewer_form">
                                <input type="text" id="email" placeholder='Email' />
                            </div>
                            <div className="box reviewer_form">
                                <select
                                    id="jobType"
                                >
                                    <option value="">Select job type</option>
                                    <option value="Technical Roles">Technical Roles</option>
                                    <option value="Project and Product Management">Project and Product Management</option>
                                    <option value="User Experience and Design">User Experience and Design</option>
                                    <option value="Marketing and Communications">Marketing and Communications</option>
                                    <option value="Sales and Business Development">Sales and Business Development</option>
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
