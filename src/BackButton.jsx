import React from "react";
import { useNavigate } from "react-router-dom";

const BackButton = ({ className }) => {
    const navigate = useNavigate();

    return (
        <button
            className={`btn btn-secondary ${className || ""}`}
            onClick={() => navigate(-1)} // 返回上一个页面
        >
            Back
        </button>
    );
};

export default BackButton;
