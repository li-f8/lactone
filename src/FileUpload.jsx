// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { FaFileUpload } from "react-icons/fa";
import { BlobServiceClient } from "@azure/storage-blob";
import Placeholder from "./assets/placeholder.jpeg";
import "bootstrap/dist/css/bootstrap.min.css";

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [imageUrls, setImageUrls] = useState([]);

    // Azure Storage Account Configuration
    const account = import.meta.env.VITE_STORAGE_ACCOUNT;
    const sasToken = import.meta.env.VITE_STORAGE_SAS;
    const containerName = import.meta.env.VITE_STORAGE_CONTAINER;
    const blobServiceClient = new BlobServiceClient(`https://${account}.blob.core.windows.net/?${sasToken}`);
    const containerClient = blobServiceClient.getContainerClient(containerName);

    const fetchImages = async () => {
        if (!account || !sasToken || !containerName) {
            alert("Please make sure you have set the Azure Storage credentials in the .env file");
            return;
        }
        try {
            const blobItems = containerClient.listBlobsFlat();
            const urls = [];
            for await (const blob of blobItems) {
                const tempBlockBlobClient = containerClient.getBlockBlobClient(blob.name);
                urls.push({ name: blob.name, url: tempBlockBlobClient.url });
            }
            setImageUrls(urls);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            alert("Please select a file to upload");
            return;
        }
        try {
            const blobName = `${new Date().getTime()}-${file.name}`;
            const blobClient = containerClient.getBlockBlobClient(blobName);
            await blobClient.uploadData(file, { blobHTTPHeaders: { blobContentType: file.type } });
            await fetchImages();
            alert("File uploaded successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to upload file.");
        }
    };

    const handleDelete = async (blobName) => {
        if (!account || !sasToken || !containerName) {
            alert("Please make sure you have set the Azure Storage credentials in the .env file");
            return;
        }
        if (!window.confirm("Are you sure you want to delete this file?")) {
            return;
        }
        try {
            const blobClient = containerClient.getBlockBlobClient(blobName);
            await blobClient.delete();
            await fetchImages();
            alert("File deleted successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to delete file.");
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    const getImageNameWithoutExtension = (filename) => {
        const dotIndex = filename.lastIndexOf(".");
        return dotIndex !== -1 ? filename.slice(0, dotIndex) : filename;
    };

    return (
        <div className="container my-5">
            <h2 className="text-left mb-4">Media Upload Platform</h2>

            {/* 上传区域 */}
            <div className="d-flex flex-column align-items-start mb-5">
                <div className="position-relative mb-3" style={{width: "80%", maxWidth: "600px"}}>
                    {file ? (
                        file.type.startsWith("video/") ? (
                            <video
                                controls
                                className="mb-3"
                                style={{
                                    width: "80%",
                                    height: "auto", // 保持纵横比
                                    maxWidth: "600px", // 最大宽度限制
                                    cursor: "pointer", // 鼠标样式为可点击
                                }}
                                onClick={() => window.open(URL.createObjectURL(file), "_blank")}
                            >
                                <source src={URL.createObjectURL(file)} type={file.type}/>
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            <img
                                className="img-thumbnail"
                                src={URL.createObjectURL(file)}
                                alt="Selected file"
                                style={{
                                    width: "80%",
                                    height: "auto", // 保持纵横比
                                    maxWidth: "600px", // 最大宽度限制
                                    cursor: "pointer", // 鼠标样式为可点击
                                }}
                                onClick={() => window.open(URL.createObjectURL(file), "_blank")}
                            />
                        )
                    ) : (
                        <img
                            className="img-thumbnail"
                            src={Placeholder}
                            alt="Placeholder"
                            style={{
                                width: "80%",
                                height: "auto",
                                maxWidth: "600px", // 默认占位图宽度限制
                            }}
                        />
                    )}
                    <label
                        htmlFor="fileInput"
                        className="btn btn-outline-primary position-absolute"
                        style={{bottom: "10px", right: "-20px"}}
                    >
                        <FaFileUpload/> Choose File
                    </label>
                    <input
                        type="file"
                        id="fileInput"
                        style={{display: "none"}}
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                </div>
                <button
                    className="btn btn-success mt-2"
                    onClick={handleSubmit}
                    style={{width: "500px"}} // 上传按钮宽度与容器保持一致
                >
                    Upload
                </button>
            </div>

            <hr className="my-4"/>

            {/* 文件展示区域 */}
            <div className="row">
                {imageUrls.length === 0 ? (
                    <h4 className="text-center">No Files Found</h4>
                ) : (
                    imageUrls.map((blobItem, index) => (
                        <div key={index} className="col-md-4 mb-4">
                            <div className="card shadow-sm">
                                <img
                                    src={blobItem.url}
                                    alt="Uploaded file"
                                    className="card-img-top img-thumbnail"
                                    style={{cursor: "pointer"}} // 鼠标样式指示为可点击
                                    onClick={() => window.open(blobItem.url, "_blank")} // 点击打开新窗口查看文件
                                />
                                <div className="card-body">
                                    <h5 className="card-title text-truncate">
                                        {getImageNameWithoutExtension(blobItem.name)}
                                    </h5>
                                    <button
                                        className="btn btn-danger w-100"
                                        onClick={() => handleDelete(blobItem.name)}
                                    >
                                        <AiFillDelete/> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

        </div>
    );
};

export default FileUpload;
