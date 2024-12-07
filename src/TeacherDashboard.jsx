import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const TeacherDashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const teacher = location.state?.teacher; // 从路由状态获取教师信息

    if (!teacher) {
        return (
            <div className="container mt-5 text-center">
                <h2>No teacher data available. Please log in.</h2>
                <button
                    className="btn btn-primary mt-3"
                    onClick={() => navigate('/teacher-login')}
                >
                    Go to Login
                </button>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Teacher Dashboard</h1>
            <div className="container mt-5">
                <h1>Welcome, {teacher.FirstName} {teacher.LastName}</h1>
                <div className="card mt-4 p-4">
                    <h3>Personal Information</h3>
                    <ul className="list-group">
                        <li className="list-group-item"><strong>Teacher ID:</strong> {teacher.TeacherID}</li>
                        <li className="list-group-item"><strong>Email:</strong> {teacher.Email}</li>
                        <li className="list-group-item"><strong>Phone Number:</strong> {teacher.PhoneNumber}</li>
                        <li className="list-group-item"><strong>City:</strong> {teacher.City}</li>
                        <li className="list-group-item"><strong>Postal Code:</strong> {teacher.PostalCode}</li>
                    </ul>
                </div>
            </div>
            <div className="d-flex justify-content-between mt-4">
                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/manage-students')}
                >
                    Manage Students
                </button>
                <button
                    className="btn btn-success"
                    onClick={() => navigate('/file-upload')}
                >
                    Video Upload
                </button>
            </div>
            <button
                className="btn btn-secondary mt-4 w-100"
                onClick={() => navigate(-1)} // 返回上级页面
            >
                Go Back
            </button>
        </div>
    );
};

export default TeacherDashboard;
