import { useState, useEffect } from "react";
import axios from "axios";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Stats from "./Stats";

function App() {
    const [view, setView] = useState("form");

    const switchView = () => {
        console.log("lol")
        setView(view === "form" ? "stats" : "form");
    };

    

    return (
        <>
            <h2> Roster Application</h2>
            {view === "form" ? (
                <RosterForm switchView={switchView} />
            ) : (
                <Stats switchView={switchView}/>
            )}
        </>
    );
}

const RosterForm = ({switchView}) => {
   
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

    const handleDelete = (e) => {
        e.preventDefault();

        axios
            .post("/api/deleteStudent", {
                firstName,
                lastName,
            })
            .then((res) => {
                setMessage(res.data.message);
                setError(!res.data.success);
                if (res.data.success) {
                    setFirstName("");
                    setLastName("");
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
                placeholder="Major (Not required for delete)"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
            />
            <input
                type="text"
                placeholder="Graduation Year (Not required for delete)"
                value={graduationYear}
                onChange={(e) => setGraduationYear(e.target.value)}
            />
            <button type="submit">Add</button>
            <button type="button" onClick={handleDelete}>
                Delete
            </button>
            <button type="button" onClick={switchView}>
                View Stats
            </button>
            <h2 style={{ color: error ? "lightcoral" : "lightgreen" }}>
                {message}
            </h2>
        </form>
    );
};

export default App;
