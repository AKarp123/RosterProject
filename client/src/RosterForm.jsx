import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";


const RosterForm = ({ switchView }) => {
    const [message, setMessage] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [major, setMajor] = useState("");
    const [graduationYear, setGraduationYear] = useState("");
    const [error, setError] = useState(false);
    const handleSubmit = (e) => {
        e.preventDefault();

        axios
            .post("/api/addStudent", {
                firstName,
                lastName,
                major,
                graduationYear,
            })
            .then((res) => {
                setMessage(res.data.message);
                setError(!res.data.success);
                if (res.data.success) {
                    setFirstName("");
                    setLastName("");
                    setMajor("");
                    setGraduationYear("");
                    setTimeout(() => {
                        setMessage("");
                    }, 5000);
                }
            });
    };
    return (
        <form
            style={{
                display: "flex",
                flexDirection: "column",
                width: "200px",
                gap: "10px",
            }}
            onSubmit={handleSubmit}
        >
            <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Major"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
            />
            <input
                type="text"
                placeholder="Graduation Year"
                value={graduationYear}
                onChange={(e) => setGraduationYear(e.target.value)}
            />
            <button type="submit">Add</button>
            <Link to="/stats">
                <button type="button" style={{ width: "100%" }} >
                    View Stats
                </button>
            </Link>
            <Link to="/search"> 
                <button type="button" style={{ width: "100%" }}>
                    Search
                </button>
            </Link>

            <h2 style={{ color: error ? "lightcoral" : "lightgreen" }}>
                {message}
            </h2>
        </form>
    );
};


export default RosterForm;