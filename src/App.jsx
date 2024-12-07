import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home';
import StudentLogin from './StudentLogin';
import TeacherLogin from './TeacherLogin';
import 'bootstrap/dist/css/bootstrap.min.css';
import StudentProfile from './StudentProfile';
import TeacherDashboard from "./TeacherDashboard.jsx";
import ManageStudents from "./ManageStudents.jsx";
import BackButton from "./BackButton.jsx";
import FileUpload from "./FileUpload.jsx";



const App = () => (
    <Router>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/student-login" element={<StudentLogin />} />
            <Route path="/teacher-login" element={<TeacherLogin />} />
            <Route path="/student-profile" element={<StudentProfile />} />
            <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
            <Route path="/manage-students" element={<ManageStudents />} />
            <Route path="/back-button" element={<BackButton />} />
            <Route path="/file-upload" element={<FileUpload />} />
            {/* 如果用户访问未知路径，重定向到首页 */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </Router>
);

export default App;