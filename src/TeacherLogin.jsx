import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const searchOneTeacher =
    'https://prod-11.northcentralus.logic.azure.com/workflows/ff5af12181ed457491b25723be5510d9/triggers/When_a_HTTP_request_is_received/paths/invoke/rest/v1/teachers/{id}?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=s5VOXu48voMimu5asf7kuhPXS5QK7yKqA-vDsT09SnI';

const TeacherLogin = () => {
    const [teacherID, setTeacherID] = useState('');
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
            const url = searchOneTeacher.replace('{id}', teacherID);
            const response = await fetch(url);

            if (!response.ok) {
                setMessageType('danger');
                setLoginMessage('Failed to retrieve teacher data.');
                setIsLoading(false);
                return;
            }

            const data = await response.json();

            if (data.Email === email) {
                setMessageType('success');
                setLoginMessage('Login successful!');
                console.log('Login successful for Teacher ID:', teacherID);
                navigate('/teacher-dashboard', { state: { teacher: data } });
            } else {
                setMessageType('danger');
                setLoginMessage('Invalid Teacher ID or Email.');
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
                <h2 className="text-center mb-4">Teacher Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label htmlFor="teacherID" className="form-label">
                            Teacher ID
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="teacherID"
                            placeholder="Enter your Teacher ID"
                            value={teacherID}
                            onChange={(e) => setTeacherID(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="teacherEmail" className="form-label">
                            Email
                        </label>
                        <input
                            type="email"
                            className="form-control"
                            id="teacherEmail"
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

export default TeacherLogin;
