import React, { useState, useEffect, useRef } from "react";
import AuthForm from "./AuthForm";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../api/services/AuthService";
import { showToast } from "../utils/showToast";

const USER_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const PWD_REGEX = /123456/;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const crmAuthForm = useRef();
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    phone: "",
    email: "",
    password: "",
  });

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setErrMsg("");
  }, [
    formData.name,
    formData.password,
    formData.surname,
    formData.phone,
    formData.email,
  ]);

  const handleRegister = async () => {
    setLoading(true);
    const isEmailValid = USER_REGEX.test(formData.email);
    const isPasswordValid = PWD_REGEX.test(formData.password);

    if (!isEmailValid || !isPasswordValid) {
      showToast({msg: "Invalid Entry", isErr: true})
      setLoading(false)
      return;
    }
    AuthService.register({ formData }).then((response) => {
      setSuccess(true);
      showToast({msg: "You can log in with your own credentials.", isErr: false});
      setFormData({
        name: "",
        surname: "",
        phone: "",
        email: "",
        password: "",
      });

      navigate('/login');
    })
      .catch((err) => {
        console.log(err.response.data.message)
        if (err.response?.data.message) {
          showToast({msg: err.response.data.message, isErr: true});
        } else {
          console.error(err)
        }
      }).finally(ev => {
        setLoading(false);
      });
  };

  return (
    <>
      {success ? (
        <section>
          <h1>Success!</h1>
          <p>
            <Link to={"/login"}>Sign In</Link>
          </p>
        </section>
      ) : (
        <>
          <AuthForm
            title="Register"
            ref={crmAuthForm}
            buttonTitle="CREAR"
            isRegistering={true}
            submitForm={handleRegister}
            formData={formData}
            setFormData={setFormData}
            errMsg={errMsg}
            loading={loading}
            isValidEmail={USER_REGEX.test(formData.email)}
            isValidPassword={PWD_REGEX.test(formData.password)}
          />
        </>
      )}
    </>
  );
};

export default Register;