
import { useState, useEffect } from 'react';
import API_URL from '../../services/api';
import './ViewResults.css';

function ViewResults() {
    const [results, setResults] = useState([]);

    useEffect(() => {
        fetchResults();
    }, []);

    // Fetch results from database
    const fetchResults = async () => {
        try {
            const response = await fetch(`${API_URL}/exams/admin/results`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                const formattedResults = data.map((result) => ({
                    id: result.result_id,
                    name: result.full_name,
                    studentId: result.student_code || '-',
                    exam: result.exam_title,
                    totalMarks: result.total_marks,
                    obtainedMarks: result.obtained_marks,
                    percentage: Number(result.percentage).toFixed(2),
                    status: result.result_status
                }));

                setResults(formattedResults);
            } else {
                alert(data.message || 'Error fetching results');
            }
        } catch (error) {
            console.log(error);
            alert('Server error');
        }
    };

    const passedResults = results.filter(
        (result) => result.status.toLowerCase() === 'pass'
    );

    const failedResults = results.filter(
        (result) => result.status.toLowerCase() === 'fail'
    );

    return (
        <div className="view-results">
            <h1>Student Results</h1>
            <p>View the examination results of all students.</p>

            <div className="result-summary">
                <div className="result-card">
                    <h3>Total Attempts</h3>
                    <h2>{results.length}</h2>
                </div>

                <div className="result-card">
                    <h3>Passed</h3>
                    <h2>{passedResults.length}</h2>
                </div>

                <div className="result-card">
                    <h3>Failed</h3>
                    <h2>{failedResults.length}</h2>
                </div>
            </div>

            <div className="result-table-box">
                <h2>All Exam Results</h2>

                <table>
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>Student ID</th>
                            <th>Exam</th>
                            <th>Total Marks</th>
                            <th>Obtained Marks</th>
                            <th>Percentage</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {results.map((result) => (
                            <tr key={result.id}>
                                <td>{result.name}</td>
                                <td>{result.studentId}</td>
                                <td>{result.exam}</td>
                                <td>{result.totalMarks}</td>
                                <td>{result.obtainedMarks}</td>
                                <td>{result.percentage}%</td>
                                <td>
                                    <span
                                        className={
                                            result.status.toLowerCase() === 'pass'
                                                ? 'pass-status'
                                                : 'fail-status'
                                        }
                                    >
                                        {result.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {results.length === 0 && (
                    <p>No exam results available.</p>
                )}
            </div>
        </div>
    );
}

export default ViewResults;
