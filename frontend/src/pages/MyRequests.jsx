import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

import { useTranslation } from 'react-i18next';

import { useNavigate } from "react-router-dom";

import "./MyRequests.css"
const MyRequests = () => {
    const { t } = useTranslation();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const formatDateTime = (date) => {
        return new Date(date).toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };
    const fetchMyRequests = async () => {
        try {
            console.log("Fetching requests...");

            const res = await axiosInstance.get("/api/requests/my-requests");

            console.log(res.data);

            setRequests(res.data);

        } catch (err) {
            console.log(err.response);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchMyRequests();

    }, []);


    return (
        <div className="my-requests-page">
            <h1>{t("My Requests")}</h1>
            {loading ? (

                <p>{t("Loading...")}</p>

            ) : requests.length === 0 ? (

                <p>{t("No Requests Found")}</p>
            ) : (
                requests.map((request) => (
                    <div key={request.id} className="request-card">

                        <div className="request-header">

                            <h3>{request.full_name}</h3>
                            <small>
                                #{request.id}
                            </small>
                            <span className={`status-badge ${request.status}`}>
                                {request.status === "pending" && t("Pending")}

                                {request.status === "approved" && t("Approved")}

                                {request.status === "rejected" && t("Rejected")}
                            </span>

                        </div>

                        <div className="request-body">

                            <p>
                                <strong>{t("service")}:</strong>
                                {request.Service?.title || "-"}
                            </p>

                            <p>
                                <strong>{t("serviceType")}:</strong>
                                {request.ServiceType?.title || "-"}
                            </p>
                            <p>

                            </p>


                            <p>
                                <strong>{t("createdAt")}:</strong>
                                {formatDateTime(request.createdAt)}

                            </p>

                        </div>

                        <div className="request-footer">

                            <button
                                className="details-btn"
                                onClick={() =>
                                    navigate(`/my-requests/${request.id}`)
                                }
                            >
                                {t("viewDetails")}
                            </button>

                        </div>

                    </div>
                )

                )
            )
            }
        </div>
    )
}

export default MyRequests
