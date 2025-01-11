import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Search = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        axios
            .get("/api/search", {
                params: {
                    query,
                },
            })
            .then((res) => {
                if (res.data.success) {
                    setResults(JSON.parse(res.data.results));
                    console.log(results);
                }

                setLoading(false);
            });
    }, [query]);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                width: "300px",
                gap: "10px",
            }}
        >
            <input
                type="text"
                placeholder="Search by name"
                onChange={(e) => {
                    e.preventDefault();
                    setQuery(e.target.value);
                }}
                style={{ width: "300px" }}
            />

            {results.map((data) => (
                <SearchCard data={data} />
            ))}
            <Link   to="/">
                <button>Back</button>
            </Link>
        </div>
    );
};

const SearchCard = ({ data }) => {
    const [deleted, setDeleted] = useState(false);
    const handleDelete = () => {
        axios.delete(`/api/deleteStudent/${data._id["$oid"]}`).then((res) => {
            if(res.data.success){
                setDeleted(true);
            }
        });
    };

    if (deleted) {
        return null;
    }

    return (
        <div
            style={{
                width: "300px",

                backgroundColor: "black",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "10px",
                borderRadius: "5px",
                marginBottom: "5px",
            }}
        >
            <div>
                {data.firstName} {data.lastName}
            </div>
            <div>{data.major}</div>
            <div>{data.graduationYear}</div>
            <button onClick={handleDelete}>Delete</button>
        </div>
    );
};

export default Search;
