"use client";
import axios from 'axios';
import React, { useEffect, useState, useRef } from "react";
import io from 'socket.io-client';
import { useSearchParams } from 'next/navigation';

// const param = new URLSearchParams(window.location.search);
// const conferenceId = param.get('id')
// const userId = param.get('userId')
// const userName = param.get('user')

interface chat {
    id: number;
    conferenceId: string;
    userId: string;
    userName: string;
    message: string;
    created_at: string;
}

const Main = () => {

    const searchParams = useSearchParams();
    const conferenceId = searchParams?.get('id');
    const userId = searchParams?.get('userId');
    const userName = searchParams?.get('user');

    const [chats, setChat] = useState<chat[]>([]);
    const socket = io('http://localhost:5000');

    const divRef = useRef<HTMLDivElement>(null); // Reference for the draggable div
    let offsetX = 0, offsetY = 0, mouseX = 0, mouseY = 0;

    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        fetchChat();
    }, []); // Empty dependency array to ensure it runs only once

    useEffect(() => {
        const enableWebcam = async () => {
          if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
              const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
              if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
              }
            } catch (error) {
              console.error("Error accessing webcam:", error);
            }
          } else {
            console.error("Webcam not supported by your browser.");
          }
        };
    
        enableWebcam();
    
        return () => {
          // Stop the webcam stream when the component unmounts
          if (videoRef.current && videoRef.current.srcObject) {
            (videoRef.current.srcObject as MediaStream)
              .getTracks()
              .forEach((track) => track.stop());
          }
        };
      }, []);

    useEffect(() => {
        const elmnt = divRef.current;
        if (!elmnt) return;

        const onMouseDown = (e: MouseEvent) => {
            e.preventDefault();
            mouseX = e.clientX;
            mouseY = e.clientY;

            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
        };

        const onMouseMove = (e: MouseEvent) => {
            e.preventDefault();

            // Calculate new position
            offsetX = e.clientX - mouseX;
            offsetY = e.clientY - mouseY;
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Update the position of the div
            if (elmnt) {
                elmnt.style.left = `${elmnt.offsetLeft + offsetX}px`;
                elmnt.style.top = `${elmnt.offsetTop + offsetY}px`;
            }
        };

        const onMouseUp = () => {
            // Remove event listeners when the mouse is released
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };

        elmnt.addEventListener("mousedown", onMouseDown);

        // Cleanup event listeners
        return () => {
            elmnt.removeEventListener("mousedown", onMouseDown);
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };
    }, []);

    // Second useEffect for setting up socket listeners and cleaning up on unmount
    useEffect(() => {
        if (!socket) return;

        // Listen for new chat messages
        socket.on('receive-message', (message) => {
            console.log(message);
            fetchChat();
        });

        // Clean up on component unmount
        return () => {
            socket.off('receive-message');
            socket.disconnect();
        };
    }, [socket]); // Only re-run if socket changes


    const fetchChat = async () => {
        try {
            const response = await axios.get<chat[]>('/api/chats?id=' + conferenceId);
            const data = response.data;
            setChat(data)
            console.log(chats)
        } catch (error) {
            console.error('Error fetching conferences:', error);
        }
    };

    const handelSend = async () => {
        var userMessage = document.getElementById('message') as HTMLInputElement | HTMLInputElement;
        if (!userMessage.value) {
            alert('Type something to send')
            return
        }
        const formData = {
            conferenceId: Number(conferenceId),
            userId: Number(userId),
            userName: userName,
            message: userMessage.value
        }
        console.log(formData)
        const response = await axios.post('/api/chats', formData);

        socket.emit('message', {
            conferenceId: conferenceId,
            userId: userId,
            userName: userName,
            message: userMessage.value,
            created_at: new Date().toISOString() // Use your date format
        });


        fetchChat();
        userMessage.value = ""
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
                        <span className="material-icons-sharp">logout</span>
                        <h3>Exit</h3>
                    </a>
                </div>
            </header>
            <div style={{ "display": "flex" }}>
                <div
                    ref={divRef}
                    style={{
                        position: "absolute",
                        top: "100px",
                        left: "100px",
                        width: "200px",
                        zIndex: "1",
                        height: "200px",
                        background: "#f1f1f1",
                        cursor: "grab",
                        border: "1px solid #ccc",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderWidth: "1px",
                        borderColor: "#d3d3d3"
                    }}
                >
                    <video ref={videoRef} style={{ width: "100%", height:"100%",  border: "1px solid #ccc" }} />
                </div>

                <main id="content" style={{ "width": "80%" }}>
                    <iframe width="100%" height="100%" src="https://www.youtube.com/embed/XR-J9PGRBxU?si=_TMnhXnoNzYPKxJk" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>
                </main>

                <div className="right" style={{ "width": "25%", "paddingLeft": "0" }}>
                    <div className="announcements">
                        <h2>Chat and Q&A</h2>
                        <div className="card profile-card ">

                            <div className="chat-messages">

                                {chats.map((c) => (
                                    <>
                                        {
                                            c.userId == userId ? (
                                                <div className="message-box-holder">
                                                    <div className="message-box">
                                                        {c.message}
                                                        <br /><span className="chat-date-time">{c.created_at}</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="message-box-holder">
                                                    <div className="message-sender">
                                                        {c.userName}
                                                    </div>
                                                    <div className="message-box message-partner">
                                                        {c.message}
                                                        <br /><span className="chat-date-time">{c.created_at}</span>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </>
                                ))}

                                {/* <div className="message-box-holder">
                                    <div className="message-box">
                                        Hello
                                        <br /><span className="chat-date-time">24-09-2023 2:30 PM</span>
                                    </div>
                                </div>

                                <div className="message-box-holder">
                                    <div className="message-sender">
                                        Noah
                                    </div>
                                    <div className="message-box message-partner">
                                        Hi.
                                        <br /><span className="chat-date-time">24-09-2023 2:32 PM</span>
                                    </div>
                                </div> */}
                            </div>

                            <div className="chat-input-holder">
                                <textarea className="chat-input" id="message"></textarea>
                                <input onClick={handelSend} style={{ width: "30%" }} value="Send" className="message-send pointer" />
                            </div>
                        </div>
                    </div>



                </div>
            </div>
        </div >

    );
};

export default Main;
