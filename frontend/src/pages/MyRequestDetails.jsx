import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FaArrowLeft,
  FaFileDownload,
  FaCalendarAlt,
  FaMoneyBill,
  FaInfoCircle,
  FaArrowRight
} from "react-icons/fa";

import axiosInstance from "../api/axiosInstance";
import { API_URL } from "../config/api";

import "./MyRequestDetails.css";


const MyRequestDetails = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const { t,i18n } = useTranslation();
const isArabic = i18n.language === "ar";


  const [request,setRequest] = useState(null);
  const [loading,setLoading] = useState(true);


  useEffect(()=>{

    fetchRequest();

  },[]);



  const fetchRequest = async()=>{

    try{

      const res = await axiosInstance.get(
        `/api/requests/my-requests/${id}`
      );

      setRequest(res.data);


    }catch(err){

      console.log(err);

    }finally{

      setLoading(false);

    }

  };



  if(loading){

    return <p className="loading">
      {t("Loading...")}
    </p>

  }



  if(!request){

    return <p className="loading">
      {t("Request not found")}
    </p>

  }



return (

<div className="request-details-page">


<button
  className="st-back-btn"
  onClick={() => navigate(-1)}
>
  {isArabic ? <FaArrowRight /> : <FaArrowLeft />}
  {t("back")}
</button>



<div className="request-details-card">


<h1>
 {t("Request Details")}
</h1>



<div className="status-box">


<span>
{t("status")}
</span>


<strong className={request.status}>

{
request.status==="pending" &&
t("Pending")
}

{
request.status==="approved" &&
t("Approved")
}

{
request.status==="rejected" &&
t("Rejected")
}


</strong>


</div>




<div className="details-grid">


<div>
<label>
{t("name")}
</label>

<p>
{request.full_name}
</p>

</div>



<div>
<label>
{t("National ID")}
</label>

<p>
{request.national_id}
</p>

</div>



<div>
<label>
{t("Phone")}
</label>

<p>
{request.phone}
</p>

</div>



<div>
<label>
{t("Address")}
</label>

<p>
{request.address}
</p>

</div>



<div>
<label>
{t("Service")}
</label>

<p>
{request.Service?.title || "-"}
</p>

</div>



<div>
<label>
{t("serviceType")}
</label>

<p>
{request.ServiceType?.title || "-"}
</p>

</div>



<div>
<label>
<FaMoneyBill/>
 {t("fee")}
</label>

<p>
{
request.ServiceType?.fee
?
request.ServiceType.fee
:
t("free")
}
</p>

</div>



<div>
<label>
<FaCalendarAlt/>
 {t("createdAt")}
</label>

<p>
{
new Date(
request.createdAt
).toLocaleDateString()
}
</p>

</div>


</div>




{
  request.documents.map((file, index) => {

    const filePath = file.path
      ?.replace(/\\/g, "/")
      .replace(/^uploads\//, "");

    const fileUrl = `${API_URL}/uploads/${filePath}`;

    return (
      <a
        key={index}
        href={fileUrl}
        target="_blank"
        rel="noreferrer"
        className="document-link"
      >
        <FaFileDownload />

        {file.originalname || "Document"}
      </a>
    );
  })
}



</div>


</div>

)


}


export default MyRequestDetails;