import React, { useEffect, useState, forwardRef } from 'react';

const AuthForm = forwardRef(({
    title,
    buttonTitle,
    isRegistering,
    submitForm,
    formData,
    setFormData,
    errMsg,
    isValidEmail,
    isValidPassword,
    nameRef,
    loading,
    surnameRef,
    phoneRef,
    emailRef,
    passwordRef,
    isUpdating,
    titleProps,
    buttonTitleProps,
    requiredPasswordLength,
}, ref) => {
    useEffect(() => {
        !formData && setFormData(prev => prev = {
            ...formData
        });
    }, [formData])


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => prev = {
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        submitForm(formData);
    };

    const isValidform = () => {
        if (isUpdating) {
            return (
                formData.name !== ''
                && formData.surname !== ''
                && /^3\d{9}$/.test(formData.phone)
            )
        } else if (isRegistering) {
            return (
                formData.name !== ''
                && formData.surname !== ''
                && /^3\d{9}$/.test(formData.phone)
                && /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(formData.email)
                && /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(formData.password)
            )
        } else {
            return (
                /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(formData.email)
                //&& /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(formData.password)
            )
        }
    }

    return (
        <form className="card" onSubmit={handleSubmit}>
            <div className="card-content">
                <span className="card-title">{title}</span>
                {isRegistering && (
                    <>
                        <div className="input-field">
                            <input
                                type="text"
                                id="name"
                                autoComplete="off"
                                onChange={handleChange}
                                value={formData.name}
                                name="name"
                                required
                            />
                            <label htmlFor="name">{isUpdating ? 'Actualizar Nombre:' : 'Nombre:'}</label>
                        </div>
                        <div className="input-field">
                            <input
                                type="text"
                                id="surname"
                                autoComplete="off"
                                onChange={handleChange}
                                value={formData.surname}
                                name="surname"
                                required
                            />
                            <label htmlFor="surname">{isUpdating ? 'Actualizar Apellido:' : 'Apellido:'}</label>
                        </div>
                        <div className="input-field">
                            <input
                                type="tel"
                                id="phone"
                                autoComplete="off"
                                onChange={handleChange}
                                value={formData.phone}
                                name="phone"
                                maxLength="10"
                                required
                            />
                            <label htmlFor="phone">{isUpdating ? 'Actualizar Teléfono:' : 'Teléfono:'}</label>
                        </div>
                    </>
                )}
                {
                    isUpdating
                    ?? <><div className="input-field">
                        <input
                            type="email"
                            id="email"
                            autoComplete="off"
                            onChange={handleChange}
                            value={formData.email}
                            name="email"
                            required
                        />
                        <label htmlFor="email">Email:</label>
                    </div>
                        <div className="input-field">
                            <input
                                type="password"
                                id="password"
                                autoComplete="off"
                                onChange={handleChange}
                                value={formData.password}
                                name="password"
                                required
                            />
                            <label htmlFor="password">Contraseña:</label>
                        </div></>
                }
            </div>
            <div className="card-action">
                <button className="modal-action btn waves-effect" type="submit" disabled={!isValidform() || loading}>
                    {buttonTitle}
                </button>
            </div>
        </form>
    );
});

export default AuthForm;
