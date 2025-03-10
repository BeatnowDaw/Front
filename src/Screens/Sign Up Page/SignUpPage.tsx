import React, { useState } from "react";
import "./SignUpPage.css";
import { Link } from "react-router-dom";
import axios from "axios";
import logo2 from "../../assets/Frame 2.png";
import CustomPopup from "../../components/Popup/CustomPopup";
import Header from "../../Layout/Header/Header";
import { discovery } from "../../../discovery.json";

function SignUpPage() {
    const [fullName, setFullName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    const handleClose = () => setShowPopup(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            await axios.post(`${discovery.server.protocol}://${discovery.server.ip}:${discovery.server.port}/api/auth/register`, {
                full_name: fullName,
                username,
                email,
                password
            });
            setMessage("Registration successful!");
        } catch (error) {
            setMessage("Registration failed. Please try again.");
        }
        setShowPopup(true);
    };

    return (
        <div className="app">
            {showPopup && <CustomPopup message={message} onClose={handleClose} />}
            <Header />
            <div className="centerDiv2">
                <main>
                    <section className="registerContent">
                        <h2>Create New Account</h2>
                        <p>Please fill in the form to continue</p>
                        <form className="register-form" onSubmit={handleSubmit}>
                            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full Name" maxLength={40} />
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" maxLength={16} />
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" maxLength={40} />
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" maxLength={20} />
                            <button className="submitButton2" type="submit">Sign up</button>
                            <div className="signUpText">
                                <h6>
                                    Already have an account? <Link className="signIn" to="/login">Sign in</Link>
                                </h6>
                            </div>
                        </form>
                    </section>
                    <div className="dividerVert2"></div>
                    <section className="logoSect2">
                        <img className="logoPngCenter2" src={logo2} alt="Logo" />
                    </section>
                </main>
            </div>
        </div>
    );
}

export default SignUpPage;
