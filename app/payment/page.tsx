"use client";
import axios from 'axios';
import React, { useEffect, useState } from "react";

const Main = () => {
    const [fee, setFee] = useState<string | null>(null);
    const [paperId, setPaperId] = useState<string | null>(null);

    useEffect(() => {
        // Fetch the query params (fee and id)
        const param = new URLSearchParams(window.location.search);
        const feeParam = param.get('fee');
        const idParam = param.get('id');

        if (feeParam && idParam) {
            setFee(feeParam);
            setPaperId(idParam);
        }
    }, []);

    useEffect(() => {
        // Dynamically load the PayPal script
        const script = document.createElement('script');
        script.src = "https://www.paypal.com/sdk/js?client-id=Ad06hhyLls873SteK6HipycHAISVdnDBqcxf3BdtvlBzGpeBgenab6KKzjo3_DX3iOYPwFlsNKjQ2aMW"; // Your PayPal client ID
        script.async = true;
        script.onload = () => {
            console.log('PayPal SDK loaded');
            // Initialize PayPal buttons
            if (window.paypal) {
                window.paypal.Buttons({
                    // Configure the order creation
                    createOrder: (data, actions) => {
                        return actions.order.create({
                            purchase_units: [{
                                amount: {
                                    value: fee ?? '0', // Use the fee or 0 if not available
                                },
                            }],
                        });
                    },

                    // Handle payment approval and success
                    onApprove: (data, actions) => {
                        return actions.order.capture().then(async (details) => {
                            console.log('Payment successful', details);

                            try {
                                // Update the schedule status and send the confirmation email
                                const updatedSchedule = {
                                    fee: fee,
                                    id: paperId
                                };
                                await axios.put(`/api/submitPaper?type=fee`, updatedSchedule);

                                const paper = await axios.get(`/api/submitPaper?id=${paperId}`);
                                if (paper && paper.data) {
                                    const emailData = {
                                        email: paper.data[0].email,
                                        subject: "Payment Successful",
                                        message: `Payment for Paper ID: ${paperId} has been completed successfully. Amount: ${fee}`,
                                        method: 'paypal',
                                    };

                                    // Send confirmation email
                                    axios.post(`http://mailer.cxe1504.uta.cloud/mailer`, JSON.stringify(emailData))
                                        .then(res => {
                                            console.log(res);
                                            if (res.data.status === 'ok') {
                                                alert("Payment successful! A confirmation email has been sent.");
                                            } else {
                                                alert("Failed to send confirmation email.");
                                            }
                                        })
                                        .catch(err => {
                                            console.error("Error sending confirmation email", err);
                                        });
                                }
                            } catch (error) {
                                console.error("Error during payment processing", error);
                                alert("Error processing the payment. Please try again.");
                            }
                        });
                    },

                    // Optional: Handle payment failure
                    onError: (err) => {
                        console.error('PayPal error', err);
                        alert("There was an error with the payment. Please try again.");
                    }
                }).render('#paypal-button-container'); // Render PayPal button
            }
        };

        // Append the PayPal script to the body
        document.body.appendChild(script);

        // Clean up the script when the component is unmounted
        return () => {
            document.body.removeChild(script);
        };
    }, [fee, paperId]);

    // Handle credit/debit card form submission manually
    const handleSubmit = async () => {
        const expiry = document.getElementById('expiry') as HTMLInputElement;
        const card = document.getElementById('card') as HTMLInputElement;
        const cvv = document.getElementById('cvv') as HTMLInputElement;

        const creditCardRegex = /^(?:\d[ -]*?){13,19}$/;
        const cvvRegex = /^[0-9]{3,4}$/;
        const expiryDate = expiry.value;
        const [month, year] = expiryDate.split("/");

        // Validate the input fields
        if (!card.value || !creditCardRegex.test(card.value)) {
            alert("Enter a valid card number (13 to 19 digits allowed)");
            card.focus();
            return;
        } else if (!month || !year || !validateExpiryDate(month, year)) {
            alert("Enter a valid expiry date in MM/YY or MM/YYYY format");
            expiry.focus();
            return;
        } else if (cvv.value === "" || !cvvRegex.test(cvv.value)) {
            alert("Enter a valid CVV (3 to 4 digits allowed)");
            cvv.focus();
            return;
        }

        try {
            // Update schedule with the payment info
            const updatedSchedule = {
                fee: fee,
                id: paperId
            };
            await axios.put(`/api/submitPaper?type=fee`, updatedSchedule);

            const paper = await axios.get(`/api/submitPaper?id=${paperId}`);
            if (paper && paper.data) {
                const data = {
                    email: paper.data[0].email,
                    subject: "Payment Successful",
                    message: `Payment for Paper ID: ${paperId} has been successfully completed. Amount: ${fee}`,
                    method: 'common'
                };

                // Send confirmation email
                axios.post(`http://mailer.cxe1504.uta.cloud/mailer`, JSON.stringify(data))
                    .then(res => {
                        if (res.data.status === 'ok') {
                            alert("Payment successful! A confirmation email has been sent.");
                        } else {
                            alert("Failed to send confirmation email.");
                        }
                    });
            }
        } catch (error) {
            console.error("Error updating schedule:", error);
            alert("Failed to update schedule");
        }
    };

    // Clear the form inputs
    const handleCancel = () => {
        const expiry = document.getElementById('expiry') as HTMLInputElement;
        const card = document.getElementById('card') as HTMLInputElement;
        const cvv = document.getElementById('cvv') as HTMLInputElement;
        expiry.value = '';
        card.value = '';
        cvv.value = '';
    };

    // Validate card expiry date
    const validateExpiryDate = (month: string, year: string) => {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0 for January
        const currentYear = currentDate.getFullYear() % 100; // Get last two digits of the year

        const formattedYear = year.length === 4 ? parseInt(year.slice(2)) : parseInt(year);
        if (formattedYear > currentYear || (formattedYear === currentYear && parseInt(month) >= currentMonth)) {
            return true;
        } else {
            return false;
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
                    <a href="register" className="active">
                        <span className="material-icons-sharp">app_registration</span>
                        <h3>Register</h3>
                    </a>
                </div>
            </header>

            <div className="submission-container">
                <form>
                    <h2>Payment</h2>
                    <div className="box">
                        <p className="text-muted">Payment Amount</p>
                        <p>${fee}</p>
                    </div>

                    <div id="paypal-button-container"></div> {/* PayPal button container */}

                    <div className="box">
                        <p className="text-muted">Card Number</p>
                        <input type="text" id="card" />
                    </div>
                    <div className="box">
                        <p className="text-muted">Expiry Date</p>
                        <input type="text" id="expiry" placeholder="MM/YY or MM/YYYY" />
                    </div>
                    <div className="box">
                        <p className="text-muted">CVV</p>
                        <input type="text" id="cvv" />
                    </div>

                    <div className="button">
                        <input value="Pay through credit/debit" className="btn" onClick={handleSubmit} />
                        <a href="#" className="text-muted" onClick={handleCancel}>Cancel</a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Main;
