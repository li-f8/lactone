import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // 引入 useNavigate
import { BlobServiceClient } from "@azure/storage-blob";

const StudentProfile = () => {
    const location = useLocation();
    const navigate = useNavigate(); // 初始化 navigate
    const { student } = location.state || {}; // 获取传递的学生数据

    const [files, setFiles] = useState([]);
    const account = import.meta.env.VITE_STORAGE_ACCOUNT;
    const sasToken = import.meta.env.VITE_STORAGE_SAS;
    const containerName = import.meta.env.VITE_STORAGE_CONTAINER;
    const blobServiceClient = new BlobServiceClient(`https://${account}.blob.core.windows.net/?${sasToken}`);
    const containerClient = blobServiceClient.getContainerClient(containerName);

    const fetchFiles = async () => {
        if (!account || !sasToken || !containerName) {
            alert("Please make sure you have set the Azure Storage credentials in the .env file");
            return;
        }
        try {
            const blobItems = containerClient.listBlobsFlat();
            const fileUrls = [];
            for await (const blob of blobItems) {
                const tempBlockBlobClient = containerClient.getBlockBlobClient(blob.name);
                fileUrls.push({ name: blob.name, url: tempBlockBlobClient.url });
            }
            setFiles(fileUrls);
        } catch (error) {
            console.error("Error fetching files:", error);
        }
    };


    const getImageNameWithoutExtension = (filename) => {
        const dotIndex = filename.lastIndexOf(".");
        return dotIndex !== -1 ? filename.slice(0, dotIndex) : filename;
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    if (!student) {
        return <div className="container mt-5">No student data available.</div>;
    }

    return (
        <div className="container mt-5">
            <button className="btn btn-secondary mb-4" onClick={() => navigate(-1)}>
                Back
            </button>

            <h1>Welcome, {student.FirstName} {student.LastName}</h1>
            <div className="card mt-4 p-4">
                <h3>Personal Information</h3>
                <ul className="list-group">
                    <li className="list-group-item"><strong>Student ID:</strong> {student.StudentID}</li>
                    <li className="list-group-item"><strong>Email:</strong> {student.Email}</li>
                    <li className="list-group-item"><strong>Phone Number:</strong> {student.PhoneNumber}</li>
                    <li className="list-group-item"><strong>City:</strong> {student.City}</li>
                    <li className="list-group-item"><strong>Postal Code:</strong> {student.PostalCode}</li>
                </ul>
            </div>

            <div className="card mt-4 p-4">
                <h3>Uploaded Files</h3>
                <div className="row">
                    {files.length === 0 ? (
                        <h4 className="text-center">No Files Found</h4>
                    ) : (
                        files.map((file, index) => (
                            <div key={index} className="col-md-4 mb-4">
                                <div className="card shadow-sm">
                                    <img
                                        src={file.url}
                                        alt="Uploaded file"
                                        className="card-img-top img-thumbnail"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => window.open(file.url, "_blank")} // 点击打开新窗口查看文件
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title text-truncate">
                                            {getImageNameWithoutExtension(file.name)}
                                        </h5>

                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;
