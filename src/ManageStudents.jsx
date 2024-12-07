import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import BackButton from "./BackButton"; // 引入返回按钮组件

const apiEndpoints = {
    addStudent:
        "https://prod-28.uksouth.logic.azure.com/workflows/d7f5fd4ee2294e49b71668537d6e51c1/triggers/When_a_HTTP_request_is_received/paths/invoke/rest/v1/students?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=yhA60hzPB3YLuHu1f-3NQ7BeUQHmemQ7RZLGGLZmges",
    deleteStudent:
        "https://prod-23.uksouth.logic.azure.com/workflows/f02fbb426aba41a3b781db1f785b1cb4/triggers/When_a_HTTP_request_is_received/paths/invoke/rest/v1/students/{id}?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=KVchTGiVqbaRpp_JV-A7u27BUhvZ_MYaXVaEvArG9SM",
    updateStudent:
        "https://prod-04.uksouth.logic.azure.com/workflows/f9ef503611cb4defa99a11dd9725ef59/triggers/When_a_HTTP_request_is_received/paths/invoke/rest/v1/students/{id}?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=4iziJvuwlxnoHiyRFHOtMh86XwLNa_-um2bH3715EZk",
    searchAllStudents:
        "https://prod-01.northcentralus.logic.azure.com/workflows/e5c59fb1a39e412584b6c27033bcec32/triggers/When_a_HTTP_request_is_received/paths/invoke/rest/v1/students?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=wtjXQm9doaRrxBusjyvZWa2JDFyWQGNgJCWDtQ6qBQQ",
};

const ManageStudents = () => {
    const [students, setStudents] = useState([]);
    const [newStudent, setNewStudent] = useState({
        FirstName: "",
        LastName: "",
        DateOfBirth: "",
        Gender: "",
        Email: "",
        PhoneNumber: "",
        City: "",
        PostalCode: "",
    });
    const [editStudent, setEditStudent] = useState(null); // 当前正在编辑的学生
    const [loading, setLoading] = useState(false);

    // 获取学生列表
    const fetchStudents = async () => {
        setLoading(true);
        try {
            const response = await fetch(apiEndpoints.searchAllStudents);
            const data = await response.json();
            setStudents(data);
        } catch (error) {
            console.error("Error fetching students:", error);
        } finally {
            setLoading(false);
        }
    };

    // 添加新学生
    const handleAddStudent = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await fetch(apiEndpoints.addStudent, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newStudent),
            });
            if (response.ok) {
                alert("Student added successfully!");
                fetchStudents();
                setNewStudent({
                    FirstName: "",
                    LastName: "",
                    DateOfBirth: "",
                    Gender: "",
                    Email: "",
                    PhoneNumber: "",
                    City: "",
                    PostalCode: "",
                });
            } else {
                alert("Failed to add student.");
            }
        } catch (error) {
            console.error("Error adding student:", error);
        } finally {
            setLoading(false);
        }
    };

    // 删除学生
    const handleDeleteStudent = async (id) => {
        try {
            setLoading(true);
            const url = apiEndpoints.deleteStudent.replace("{id}", id);
            const response = await fetch(url, { method: "DELETE" });
            if (response.ok) {
                alert("Student deleted successfully!");
                fetchStudents();
            } else {
                alert("Failed to delete student.");
            }
        } catch (error) {
            console.error("Error deleting student:", error);
        } finally {
            setLoading(false);
        }
    };

    // 更新学生信息
    const handleUpdateStudent = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const url = apiEndpoints.updateStudent.replace("{id}", editStudent.StudentID);
            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(editStudent),
            });
            if (response.ok) {
                alert("Student updated successfully!");
                fetchStudents();
                setEditStudent(null); // 关闭编辑模式
            } else {
                alert("Failed to update student.");
            }
        } catch (error) {
            console.error("Error updating student:", error);
        } finally {
            setLoading(false);
        }
    };

    // 打开编辑模式
    const handleEditClick = (student) => {
        setEditStudent({ ...student });
    };

    // 关闭编辑模式
    const handleCancelEdit = () => {
        setEditStudent(null);
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <BackButton />
                <h1>Manage Students</h1>
            </div>

            {/* 如果处于编辑模式，隐藏其他元素，仅显示编辑表单 */}
            {editStudent ? (
                <div className="card mb-4 shadow">
                    <div className="card-body">
                        <h4>Edit Student</h4>
                        <form onSubmit={handleUpdateStudent}>
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <label htmlFor="FirstName" className="form-label">First Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="FirstName"
                                        value={editStudent.FirstName}
                                        onChange={(e) =>
                                            setEditStudent({ ...editStudent, FirstName: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="LastName" className="form-label">Last Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="LastName"
                                        value={editStudent.LastName}
                                        onChange={(e) =>
                                            setEditStudent({ ...editStudent, LastName: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <label htmlFor="DateOfBirth" className="form-label">Date of Birth</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="DateOfBirth"
                                        value={editStudent.DateOfBirth}
                                        onChange={(e) =>
                                            setEditStudent({ ...editStudent, DateOfBirth: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="Gender" className="form-label">Gender</label>
                                    <select
                                        className="form-control"
                                        id="Gender"
                                        value={editStudent.Gender}
                                        onChange={(e) =>
                                            setEditStudent({ ...editStudent, Gender: e.target.value })
                                        }
                                        required
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <label htmlFor="Email" className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="Email"
                                        value={editStudent.Email}
                                        onChange={(e) =>
                                            setEditStudent({ ...editStudent, Email: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="PhoneNumber" className="form-label">Phone Number</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="PhoneNumber"
                                        value={editStudent.PhoneNumber}
                                        onChange={(e) =>
                                            setEditStudent({ ...editStudent, PhoneNumber: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <label htmlFor="City" className="form-label">City</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="City"
                                        value={editStudent.City}
                                        onChange={(e) =>
                                            setEditStudent({ ...editStudent, City: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="PostalCode" className="form-label">Postal Code</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="PostalCode"
                                        value={editStudent.PostalCode}
                                        onChange={(e) =>
                                            setEditStudent({ ...editStudent, PostalCode: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-success me-2">
                                Save Changes
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={handleCancelEdit}
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                /* 学生管理功能 */
                <>
                    {/* 添加学生 */}
                    <div className="card mb-4 shadow">
                        <div className="card-body">
                            <h4>Add New Student</h4>
                            <form onSubmit={handleAddStudent}>
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label htmlFor="FirstName" className="form-label">First Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="FirstName"
                                            value={newStudent.FirstName}
                                            onChange={(e) =>
                                                setNewStudent({...newStudent, FirstName: e.target.value})
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="LastName" className="form-label">Last Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="LastName"
                                            value={newStudent.LastName}
                                            onChange={(e) =>
                                                setNewStudent({...newStudent, LastName: e.target.value})
                                            }
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label htmlFor="DateOfBirth" className="form-label">Date of Birth</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            id="DateOfBirth"
                                            value={newStudent.DateOfBirth}
                                            onChange={(e) =>
                                                setNewStudent({...newStudent, DateOfBirth: e.target.value})
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="Gender" className="form-label">Gender</label>
                                        <select
                                            className="form-control"
                                            id="Gender"
                                            value={newStudent.Gender}
                                            onChange={(e) =>
                                                setNewStudent({...newStudent, Gender: e.target.value})
                                            }
                                            required
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label htmlFor="Email" className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="Email"
                                            value={newStudent.Email}
                                            onChange={(e) =>
                                                setNewStudent({...newStudent, Email: e.target.value})
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="PhoneNumber" className="form-label">Phone Number</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="PhoneNumber"
                                            value={newStudent.PhoneNumber}
                                            onChange={(e) =>
                                                setNewStudent({...newStudent, PhoneNumber: e.target.value})
                                            }
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label htmlFor="City" className="form-label">City</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="City"
                                            value={newStudent.City}
                                            onChange={(e) =>
                                                setNewStudent({...newStudent, City: e.target.value})
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="PostalCode" className="form-label">Postal Code</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="PostalCode"
                                            value={newStudent.PostalCode}
                                            onChange={(e) =>
                                                setNewStudent({...newStudent, PostalCode: e.target.value})
                                            }
                                            required
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary w-100">
                                    Add Student
                                </button>
                            </form>
                        </div>
                    </div>


                    {/* 学生列表 */}
                    <div className="card shadow">
                        <div className="card-body">
                            <h4>Student List</h4>
                            {loading ? (
                                <div className="text-center">
                                    <div className="spinner-border" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : (
                                <ul className="list-group">
                                    {students.map((student) => (
                                        <li
                                            key={student.StudentID}
                                            className="list-group-item d-flex justify-content-between align-items-center"
                                        >
                                            <div>
                                                <strong>{student.FirstName} {student.LastName}</strong>
                                                <p>Email: {student.Email}</p>
                                            </div>
                                            <div>
                                                <button
                                                    className="btn btn-warning me-2"
                                                    onClick={() => handleEditClick(student)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn btn-danger"
                                                    onClick={() => handleDeleteStudent(student.StudentID)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ManageStudents;
