import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useTranslation } from "react-i18next";

import {
    FaUser,
    FaLock,
    FaSave
} from "react-icons/fa";

import "./AdminProfile.css";


const AdminProfile = () => {

    const { t } = useTranslation();


    const [loading, setLoading] = useState(true);


    const [profile, setProfile] = useState({

        firstName: "",
        lastName: "",
        email: "",
        role: ""

    });


    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [passwordData, setPasswordData] = useState({

        currentPassword: "",
        newPassword: "",
        confirmPassword: ""

    });



    // ==========================
    // جلب بيانات الأدمن
    // ==========================

    useEffect(() => {

        fetchProfile();

    }, []);



    const fetchProfile = async () => {

        try {

            setLoading(true);


            const res = await axiosInstance.get(
                "/api/users/profile"
            );


            setProfile(res.data);


        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);

        }

    };




    // ==========================
    // تعديل البيانات
    // ==========================

    const updateProfile = async () => {

        try {

            await axiosInstance.put(
                "/api/users/me",
                profile
            );


            alert(
                t("profileUpdated")
            );


        } catch (err) {

            console.error(err);

        }

    };

    // ==========================
    // تغيير كلمة المرور
    // ==========================

    const changePassword = async () => {

        try {
            if (
                passwordData.newPassword !==
                passwordData.confirmPassword
            ) {

                alert(
                    t("passwordNotMatch")
                );

                return;

            }
            await axiosInstance.put(
                "/api/users/me/change-password",
                passwordData
            );
            alert(
                t("passwordChanged")
            );
            setPasswordData({

                currentPassword: "",
                newPassword: "",
                confirmPassword: ""

            });
        } catch (err) {

            console.error(err);

        }

    };
    if (loading) {

        return (

            <div className="loading-box">

                {t("loading")}

            </div>

        );

    }


    return (

        <div className="admin-profile-container">



            <div className="profile-header">


                <FaUser />
                <div>

                    <h2> {t("adminProfile")}</h2>
                    <p> {t("manageAccount")} </p>
                </div>
            </div>
            <div className="profile-grid">

                {/* معلومات الحساب */}


                <div className="profile-card">
                    <h3>
                        {t("personalInformation")}
                    </h3>

                    <div className="form-group">

                        <label>
                            {t("firstName")}
                        </label>

                        <input

                            type="text"

                            value={profile.firstName}

                            onChange={(e) =>
                                setProfile({

                                    ...profile,

                                    firstName:
                                        e.target.value

                                })
                            }

                        />


                    </div>

                    <div className="form-group">

                        <label>
                            {t("lastName")}
                        </label>

                        <input

                            type="text"

                            value={profile.lastName}

                            onChange={(e) =>
                                setProfile({

                                    ...profile,

                                    lastName:
                                        e.target.value

                                })
                            }

                        />

                    </div>
                    <div className="form-group">

                        <label>
                            {t("email")}
                        </label>

                        <input

                            type="email"

                            value={profile.email}

                            onChange={(e) =>
                                setProfile({

                                    ...profile,

                                    email:
                                        e.target.value

                                })
                            }

                        />
                    </div>

                    <div className="form-group">

                        <label>
                            {t("role")}
                        </label>

                        <input

                            type="text"

                            value={profile.role}

                            disabled

                        />
                    </div>
                    <button

                        className="save-btn"

                        onClick={updateProfile}

                    >

                        <FaSave />

                        {t("saveChanges")}


                    </button>
                </div>

                {/* تغيير كلمة المرور */}



                <div className="profile-card">


                    <h3>
                        {t("changePassword")}
                    </h3>




                    <div className="form-group">

                        <label>
                            {t("currentPassword")}
                        </label>


                        <div className="password-input">

                            <input
                                type={
                                    showPassword.current
                                        ? "text"
                                        : "password"
                                }
                                value={passwordData.currentPassword}
                                onChange={(e) =>
                                    setPasswordData({
                                        ...passwordData,
                                        currentPassword: e.target.value
                                    })
                                }
                            />

                            <span
                                className="eye-icon"
                                onClick={() =>
                                    setShowPassword({
                                        ...showPassword,
                                        current: !showPassword.current
                                    })
                                }
                            >
                                {showPassword.current ? "🙈" : "👁️"}
                            </span>

                        </div>


                    </div>

                    <div className="form-group">

                        <label>
                            {t("newPassword")}
                        </label>


                        <div className="password-input">

                            <input
                                type={
                                    showPassword.new
                                        ? "text"
                                        : "password"
                                }
                                value={passwordData.newPassword}
                                onChange={(e) =>
                                    setPasswordData({
                                        ...passwordData,
                                        newPassword: e.target.value
                                    })
                                }
                            />

                            <span
                                className="eye-icon"
                                onClick={() =>
                                    setShowPassword({
                                        ...showPassword,
                                        new: !showPassword.new
                                    })
                                }
                            >
                                {showPassword.new ? "🙈" : "👁️"}
                            </span>

                        </div>
                    </div>

                    <div className="form-group">

                        <label>
                            {t("confirmPassword")}
                        </label>


                        <div className="password-input">

                            <input
                                type={
                                    showPassword.confirm
                                        ? "text"
                                        : "password"
                                }
                                value={passwordData.confirmPassword}
                                onChange={(e) =>
                                    setPasswordData({
                                        ...passwordData,
                                        confirmPassword: e.target.value
                                    })
                                }
                            />

                            <span
                                className="eye-icon"
                                onClick={() =>
                                    setShowPassword({
                                        ...showPassword,
                                        confirm: !showPassword.confirm
                                    })
                                }
                            >
                                {showPassword.confirm ? "🙈" : "👁️"}
                            </span>

                        </div>

                    </div>

                    <button

                        className="password-btn"

                        onClick={changePassword}

                    >
                        <FaLock />

                        {t("changePassword")}
                    </button>
                </div>

            </div>

        </div>

    );

};


export default AdminProfile;