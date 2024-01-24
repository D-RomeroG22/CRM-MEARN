import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { decodeToken } from "react-jwt";
import useAuth from "../hooks/useAuth";
import AuthForm from "./AuthForm";
import AuthService from "../api/services/AuthService";
import { showToast } from "../utils/showToast";

const Login = () => {
    const crmAuthForm = useRef();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    const [loading, setLoading] = useState(false)

    const { setAuth } = useAuth();

    const [errMsg, setErrMsg] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        phone: "",
        email: "",
        password: "",
    });

    const isValidEmail = () => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailRegex.test(formData.email);
    }

    const isValidPassword = () => {
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        return passwordRegex.test(formData.password);
    }

    const handleSubmit = (formData) => {
        setLoading(true);
        AuthService.login({ formData })
            .then((response) => {
                const myDecodedToken = decodeToken(response.token.slice(7));
                AuthService.getUserDetails({ userId: myDecodedToken.userId })
                    .then((res) => {
                        setErrMsg("");
                        const accessToken = response.token.slice(7);
                        const roles = res.admin ? ["user", "editor", "admin"] : ["user"];
                        setAuth({ user: formData.email, pwd: formData.password, roles, accessToken });
                        AuthService.saveToken({token: response.token, userDetails: JSON.stringify(res) });
                        setFormData({
                            name: "",
                            surname: "",
                            phone: "",
                            email: "",
                            password: "",
                        });
                        return navigate('/order', { replace: true });
                    });
            })
            .catch((err) => {
                console.log(err)
                if (err.response?.data.message) {
                    showToast({msg: err.response.data.message, isErr: true});
                } else {
                    console.error(err)
                }
                })
            .finally(ev => {
                setLoading(false);
            });
    };

    return (
        <AuthForm
            ref={crmAuthForm}
            title="Iniciar sesión"
            buttonTitle="Login"
            isRegistering={false}
            submitForm={handleSubmit}
            formData={formData}
            errMsg={errMsg}
            loading={loading}
            setFormData={setFormData}
            isValidEmail={isValidEmail}
            isValidPassword={isValidPassword}
        />
    );
};

export default Login;
