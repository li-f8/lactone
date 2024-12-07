import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';


const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="container-fluid home-container">
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="card shadow p-4">
                    <h1 className="mb-4 text-center">Welcome to the Remote Platform</h1>
                    <h5 className="mb-4 text-center">
                        Please select your login option below:
                    </h5>
                    <div className="d-flex justify-content-around">
                        <button
                            className="btn btn-primary btn-lg"
                            onClick={() => navigate('/student-login')}
                        >
                            Student Login
                        </button>
                        <button
                            className="btn btn-secondary btn-lg"
                            onClick={() => navigate('/teacher-login')}
                        >
                            Teacher Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
