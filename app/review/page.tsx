"use client";
import axios from 'axios';
import React, { useEffect, useState } from "react";

interface Papers {
    id: number;
    paper_title: string;
}


const Main = () => {

    const [currentPaperId, setCurrentPaperId] = useState(Number);
    const [pdfUrl, setPdfUrl] = useState('');

    useEffect(() => {
        if (currentPaperId) {
            setPdfUrl(`/papers/${currentPaperId}.pdf#toolbar=1`);
        }
    }, [currentPaperId]);

    const [type, setType] = useState('');
    const [reviewer, setReviewer] = useState('');
    const [designation, setDesignation] = useState('');
    const [organization, setOrganization] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [originality, setOriginality] = useState('');
    const [clarity, setClarity] = useState('');
    const [relevance, setRelevance] = useState('');
    const [feedback, setFeedback] = useState('');

    const [conferencePapers, setConferencePapers] = useState<Papers[]>([]);

    const fetchConferencePapers = async () => {
        try {
            if (!type) {
                alert('Select the research area')
                return;
            }
            if (!reviewer) {
                alert('Enter reviewer name')
                return;
            }
            if (!designation) {
                alert('Enter reviewer designation')
                return;
            }
            if (!organization) {
                alert('Enter reviewer organization')
                return;
            }
            if (!phone) {
                alert('Enter reviewer phone')
                return;
            }
            if (!email) {
                alert('Enter reviewer email')
                return;
            }

            var user = await axios.get(`/api/users?id=${email}`);
            console.log(user)
            if (user && user.data && user.data.length == 0) {
                alert("User not found. please signup as reviewer first and review papers later");
                return
            }
            else {
                if (user.data[0].usertype != 'reviewer') {
                    alert("User not found. please signup as reviewer first and review papers later");
                    return
                }

            }
            const response = await axios.get<Papers[]>(`/api/submitPaper?conType=${type}`);
            console.log(response)
            setConferencePapers(response.data)

        } catch (error) {
            console.error('Error fetching papers:', error);
        }
    };

    const handelOpenPaper = async (PaperId: number) => {
        console.log(PaperId)
        setCurrentPaperId(PaperId)
        const domain = window.location.origin;
        const url = `${domain}/papers/${currentPaperId}.pdf#toolbar=1`
        setPdfUrl(url);
        console.log(url)
        console.log(pdfUrl)
    }

    const handelFeedbackSubmit = async () => {
        try {
            if (!currentPaperId) {
                alert('Select paper first')
                return
            }
            if (!reviewer) {
                alert('Enter reviewer name')
                return;
            }
            if (!designation) {
                alert('Enter reviewer designation')
                return;
            }
            if (!organization) {
                alert('Enter reviewer organization')
                return;
            }
            if (!phone) {
                alert('Enter reviewer phone')
                return;
            }
            if (!email) {
                alert('Enter reviewer email')
                return;
            }
            if (!originality) {
                alert('Enter reviewer originality')
                return;
            }
            if (!clarity) {
                alert('Enter reviewer clarity')
                return;
            }
            if (!relevance) {
                alert('Enter reviewer relevance')
                return;
            }
            if (!feedback) {
                alert('Enter reviewer feedback')
                return;
            }

            const updatedReview = {
                reviewed: 1,
                reviewer_name: reviewer,
                reviewer_designation: designation,
                reviewer_organization: organization,
                reviewer_phone: phone,
                reviewer_email: email,
                originality: Number(originality),
                clarity: Number(clarity),
                relevance: Number(relevance),
                feedback: feedback,
                id: currentPaperId
            }

            await axios.put(`/api/submitPaper`, updatedReview);

            alert("Review updated successfully");
            // window.location.href = '/review'
        } catch (error) {
            console.error('Error fetching papers:', error);
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
                    <a href="register">
                        <span className="material-icons-sharp">app_registration</span>
                        <h3>Register</h3>
                    </a>
                    <a href="schedule">
                        <span className="material-icons-sharp">today</span>
                        <h3>Schedule</h3>
                    </a>
                    <a href="review" className="active">
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
                    <div className="profile" >
                        <h3>Papers to review</h3>
                        <div className="about">
                            <div id="reviewerDetails">
                                <h5>Reviewer detail</h5><br />
                                <div className="box reviewer_form">
                                    <select
                                        value={type}
                                        onChange={(e) => setType(e.target.value)} // Update state on change
                                    >
                                        <option value="">Select research area</option>
                                        <option value="mathematics">Mathematics</option>
                                        <option value="engineering">Engineering</option>
                                        <option value="lifeSciences">Life Sciences</option>
                                        <option value="medicineHealthcare">Medicine & Healthcare</option>
                                        <option value="socialSciences">Social Sciences</option>
                                    </select>
                                </div>
                                <div className="box reviewer_form">
                                    <input type="text" value={reviewer} onChange={(e) => setReviewer(e.target.value)} placeholder="Reviewer name" />
                                </div>

                                <div className="box reviewer_form">
                                    <input type="text" value={designation} onChange={(e) => setDesignation(e.target.value)} placeholder="Designation" />
                                </div>
                                <div className="box reviewer_form">
                                    <input type="text" value={organization} onChange={(e) => setOrganization(e.target.value)} placeholder="Organization" />
                                </div>
                                <div className="box reviewer_form">
                                    <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" />
                                </div>
                                <div className="box reviewer_form">
                                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                                </div>
                                <div className="button">
                                    <input type="submit" value="Submit" className="btn" onClick={fetchConferencePapers} />
                                </div>
                            </div>

                            <div id="paperlist">
                                {conferencePapers.map((paper) => (
                                    <p>{paper.paper_title} (PaperId #{paper.id}) <a style={{ "color": "blue" }} href="#" onClick={() => handelOpenPaper(paper.id)}>Open paper</a></p>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>

                <main id="content">
                    <h1>Peer review</h1>
                    <p id="pdfviewermessage">Message for Reviewers <br />
                        Please submit the details in reviewers form on the left hand <br />
                        Later you should be able to see assigned papers for review <br />
                        Click on open pdf to start review <br />
                        Once reviewed please put the score and feedback on feedback form on the right hand side</p>
                    <object
                        key={pdfUrl}
                        id="pdfviewer"
                        data={pdfUrl}
                        type='application/pdf'
                        width='100%' height='440px'>
                    </object>
                </main>

                <div className="right">
                    <div className="announcements">
                        <h2>Score and feedback</h2>
                        <div className="updates">
                            <div className="message">
                                <p>
                                    <b>Give your score for below</b> <br />
                                </p>
                            </div>
                            <div className="box reviewer_form">
                                <input type="number" id="originality" value={originality} onChange={(e) => setOriginality(e.target.value)} placeholder="Originality - 1 to 10" />
                            </div>
                            <div className="box reviewer_form">
                                <input type="number" id="clarity" value={clarity} onChange={(e) => setClarity(e.target.value)} placeholder="Clarity - 1 to 10" />
                            </div>
                            <div className="box reviewer_form">
                                <input type="number" id="relevance" value={relevance} onChange={(e) => setRelevance(e.target.value)} placeholder="Relevance - 1 to 10" />
                            </div>

                            <div className="message">
                                <p>
                                    <b>Give brief feedback about the paper</b> <br />
                                </p>
                            </div>
                            <div className="box reviewer_form">
                                <textarea id="comment" value={feedback} onChange={(e) => setFeedback(e.target.value)}>

                                </textarea>
                            </div>
                            <div className="button">
                                <input type="submit" value="Submit" className="btn" onClick={handelFeedbackSubmit} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Main;
