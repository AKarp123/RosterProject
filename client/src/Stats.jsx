import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Stats = ({ switchView }) => {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("/api/stats").then((res) => {
            setStats(res.data.stats);
            setLoading(false);
        });
    }, []);
    if (loading) {
        return <h4>Loading...</h4>;
    } else {
        // console.log(Object.entries(stats.graduationYear));
        console.log(stats.graduationYear);
        // console.log(Objec)
        return (
            <>
                <h4>Stats</h4>
                <h5>Graduation by Year: </h5>{" "}
                {Object.entries(stats.graduationYear).map(([key, value]) => (
                    <h5 key={key}>
                        {key}: {value}
                    </h5>
                ))}
                <h5>Major Breakdown: </h5>{" "}
                {Object.entries(stats.major).map(([key, value]) => (
                    <h5 key={key}>
                        {key}: {value}
                    </h5>
                ))}
                <Link to="/">
                    <button onClick={switchView}>Back</button>
                </Link>
            </>
        );
    }
};

export default Stats;
