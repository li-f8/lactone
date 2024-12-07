import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const searchOneStudent =
    'https://prod-10.uksouth.logic.azure.com/workflows/217bfab50bb843b7a64aba6f20e3710b/triggers/When_a_HTTP_request_is_received/paths/invoke/rest/v1/students/{id}?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=p3bKXo8NTkKt5J3CTKFdfU7eS4ty-xTwwtoNo0L2ryM';

const StudentLogin = () => {
    const [studentID, setStudentID] = useState('');
    const [email, setEmail] = useState('');
    const [loginMessage, setLoginMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginMessage('');
        setIsLoading(true);

        try {
            const url = searchOneStudent.replace('{id}', studentID.trim());
            const response = await fetch(url);

            if (!response.ok) {
                setMessageType('danger');
                setLoginMessage('Failed to retrieve student data.');
                setIsLoading(false);
                return;
            }

            const data = await response.json();

            if (data.Email === email.trim()) {
                setMessageType('success');
                setLoginMessage('Login successful!');
                console.log('Login successful for Student:', data);
                // 跳转到学生个人信息页面
                navigate('/student-profile', { state: { student: data } });
            } else {
                setMessageType('danger');
                setLoginMessage('Invalid Student ID or Email.');
            }
        } catch (error) {
            console.error('Error during login:', error);
            setMessageType('danger');
            setLoginMessage('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoBack = () => {
        navigate(-1); // 回到上级页面
    };

    return (
        <div className="container-fluid vh-100 d-flex justify-content-center align-items-center bg-light">
            <div className="card p-4 shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
                <h2 className="text-center mb-4">Student Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label htmlFor="studentID" className="form-label">
                            Student ID
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="studentID"
                            placeholder="Enter your Student ID"
                            value={studentID}
                            onChange={(e) => setStudentID(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="studentEmail" className="form-label">
                            Email
                        </label>
                        <input
                            type="email"
                            className="form-control"
                            id="studentEmail"
                            placeholder="Enter your Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div
                                className="spinner-border spinner-border-sm text-light"
                                role="status"
                            ></div>
                        ) : (
                            'Login'
                        )}
                    </button>
                </form>
                {loginMessage && (
                    <div
                        className={`alert alert-${messageType} mt-3`}
                        role="alert"
                    >
                        {loginMessage}
                    </div>
                )}
                <button
                    className="btn btn-secondary mt-3 w-100"
                    onClick={handleGoBack}
                >
                    Go Back
                </button>
            </div>
        </div>
    );
};

export default StudentLogin;
