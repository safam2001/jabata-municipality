import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaEdit,
  FaSave,
  FaLock,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";

import axiosInstance from "../api/axiosInstance";
import "./MyProfile.css";


const MyProfile = () => {

  const { t } = useTranslation();


  const [user,setUser] = useState(null);
  const [loading,setLoading] = useState(true);

  const [editMode,setEditMode] = useState(false);

  const [message,setMessage] = useState({
    type:"",
    text:""
  });


  const [showPassword,setShowPassword] = useState(false);


  const [formData,setFormData] = useState({
    firstName:"",
    lastName:"",
    email:"",
    phone:""
  });


  const [passwordData,setPasswordData] = useState({
    currentPassword:"",
    newPassword:""
  });


  useEffect(()=>{
    fetchProfile();
  },[]);

  const fetchProfile = async()=>{

    try{
 const res = await axiosInstance.get(   "/api/users/me"
      );


      const userData = res.data.user;


      setUser(userData);
      setFormData({
        firstName:userData.firstName || "",
        lastName:userData.lastName || "",
        email:userData.email || "",
        phone:userData.phone || ""
      });


      localStorage.setItem(
        "user",
        JSON.stringify(userData)
      );


    }catch(err){

      console.log(err);

    }finally{

      setLoading(false);

    }

  };

  const handleChange=(e)=>{

    setFormData({
      ...formData,
      [e.target.name]:e.target.value
    });

  };

  const updateProfile = async()=>{


    try{


      const res = await axiosInstance.put(
        "/api/users/me",
        formData
      );

      const updatedUser = res.data.user;
      setUser(updatedUser);
      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      setMessage({
        type:"success",
        text:t("Profile updated successfully")
      });

      setEditMode(false);
    }catch(err){
      console.log(err.response?.data);
      setMessage({
        type:"error",
        text:t(
          err.response?.data?.message ||
          "Something went wrong"
        )
      });


    }

  };

  const changePassword = async()=>{
    try{
          await axiosInstance.put(
        "/api/users/me/change-password",  passwordData  );

      setMessage({
        type:"success",
        text:t("Password updated successfully")
      });
      setPasswordData({
        currentPassword:"",
        newPassword:""
      });
    
    }catch(err){
    // console.log(err.response?.data);

      setMessage({
        type:"error",
        text:t(
          err.response?.data?.message ||
          "Something went wrong"
        )
      });


    }


  };





  if(loading){

    return (
      <div className="profile-loading">
        {t("Loading...")}
      </div>
    );

  }





  return (

<div className="profile-page">


<h1>
<FaUser/>
{t("My Profile")}
</h1>



{
message.text &&

<div className={`profile-message ${message.type}`}>
{message.text}
</div>

}





<div className="profile-card">


<div className="profile-header">


<div className="avatar">

{
user?.firstName?.charAt(0)
}

</div>



<div>

<h2>
{user?.firstName} {user?.lastName}
</h2>


<span>
{user?.role}
</span>


</div>


</div>







<div className="profile-info">



<div>

<label>
<FaUser/>
{t("First Name")}
</label>


{
editMode ?

<input
name="firstName"
value={formData.firstName}
onChange={handleChange}
/>

:

<p>
{user.firstName}
</p>

}


</div>






<div>

<label>
<FaUser/>
{t("Last Name")}
</label>


{
editMode ?

<input
name="lastName"
value={formData.lastName}
onChange={handleChange}
/>

:

<p>
{user.lastName}
</p>

}


</div>







<div>

<label>
<FaEnvelope/>
{t("Email")}
</label>


<p>
{user.email}
</p>


</div>







<div>

<label>
<FaPhone/>
{t("Phone")}
</label>


{
editMode ?

<input
name="phone"
value={formData.phone}
onChange={handleChange}
/>

:

<p>
{
user.phone || "-"
}
</p>

}


</div>



</div>






<div className="profile-actions">


{

editMode ?

<button onClick={updateProfile}>

<FaSave/>

{t("Save")}

</button>


:

<button onClick={()=>setEditMode(true)}>

<FaEdit/>

{t("Edit Profile")}

</button>


}


</div>



</div>










<div className="password-card">


<h2>

<FaLock/>

{t("Change Password")}

</h2>




<input

type="password"

placeholder={t("Current Password")}

value={passwordData.currentPassword}

onChange={(e)=>
setPasswordData({
...passwordData,
currentPassword:e.target.value
})
}

/>






<div className="password-input">


<input

type={
showPassword ?
"text":
"password"
}

placeholder={t("New Password")}

value={passwordData.newPassword}

onChange={(e)=>
setPasswordData({
...passwordData,
newPassword:e.target.value
})
}

/>



<span
onClick={()=>
setShowPassword(!showPassword)
}
>


{
showPassword ?
<FaEyeSlash/>
:
<FaEye/>
}


</span>


</div>





<button onClick={changePassword}>

<FaLock/>

{t("Change Password")}

</button>



</div>





</div>

  );

};


export default MyProfile;