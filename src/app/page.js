"use client"
import { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function Home() {
    const [inputData, setInputData] = useState('{"data":["M","1","334","4","B"]}');
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSubmit = async () => {
        try {
            setError(null);
            const parsedInput = JSON.parse(inputData);
            const res = await axios.post("https://bajaj-finser-backend.onrender.com/bfhl", parsedInput);
            setResponse(res.data);
        } catch (err) {
            setError("Failed to fetch response");
            setResponse(null);
        }
    };

    const handleFilterChange = (filter) => {
        setSelectedFilters((prev) =>
            prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
        );
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <h1 className="text-2xl font-bold mb-4">REST API Client</h1>
            <input
                type="text"
                className="w-full max-w-lg p-2 border rounded-md shadow-sm focus:ring focus:ring-blue-300"
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
            />
            <button
                onClick={handleSubmit}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
            >
                Submit
            </button>
            {error && <p className="mt-4 text-red-500">{error}</p>}
            {response && (
                <div className="mt-4 p-4 bg-white shadow-md rounded-md w-full max-w-lg">
                    <h2 className="text-lg font-semibold">Response:</h2>
                    <div className="relative mt-2" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="px-3 py-1 border rounded-md bg-gray-200 w-full text-left"
                        >
                            {selectedFilters.length > 0 ? selectedFilters.join(", ") : "Select Filters"}
                        </button>
                        {dropdownOpen && (
                            <div className="absolute mt-1 w-full bg-white border rounded-md shadow-md z-10">
                                {["alphabets", "numbers", "highest_alphabet"].map((filter) => (
                                    <div 
                                        key={filter} 
                                        className="px-3 py-1 hover:bg-gray-100 cursor-pointer flex items-center"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedFilters.includes(filter)}
                                            onChange={() => handleFilterChange(filter)}
                                            className="mr-2"
                                        />
                                        {filter.charAt(0).toUpperCase() + filter.slice(1)}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="mt-4">
                        {selectedFilters.includes("numbers") && response.numbers && (
                            <p><strong>Numbers:</strong> {response.numbers.join(", ")}</p>
                        )}
                        {selectedFilters.includes("alphabets") && response.alphabets && (
                            <p><strong>Alphabets:</strong> {response.alphabets.join(", ")}</p>
                        )}
                        {selectedFilters.includes("highest_alphabet") && response.highest_alphabet && (
                            <p><strong>Highest Alphabet:</strong> {response.highest_alphabet}</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}