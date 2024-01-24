import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../hooks/useAxiosPrivate";

const Users = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
    const controller = new AbortController();

    const getUsers = async () => {
        try {
        const response = await api.private.get("/users", {
            signal: controller.signal,
        });
        setUsers(response.data);
        } catch (err) {
        console.error(err);
        navigate("/login", { state: { from: location }, replace: true });
        }
    };

    getUsers();

    return () => {
        controller.abort();
    };
    }, [navigate, location]);

    return (
    <article>
        <h2>Users List</h2>
        {users.length ? (
        <ul>
            {users.map((user, i) => (
            <li key={i}>{user?.username}</li>
            ))}
        </ul>
        ) : (
        <p>No users to display</p>
        )}
    </article>
    );
};

export default Users;
