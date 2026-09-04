import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import axiosInstance from "../api/axiosInstance";


// إنشاء الـ Context

const SiteSettingsContext = createContext();


// Provider

export const SiteSettingsProvider = ({ children }) => {

  const [settings, setSettings] = useState(null);

  const [loading, setLoading] = useState(true);


  // جلب إعدادات الموقع

  const fetchSiteSettings = async () => {

    try {

      setLoading(true);


      const res = await axiosInstance.get(
        "/api/site-settings"
      );

      if(res.data?.settings){

        setSettings(res.data.settings);

      }
      else{

        setSettings(res.data);

      }


    } catch(error){

      console.error(
        "Site settings error:",
        error
      );


    } finally{

      setLoading(false);

    }

  };



  useEffect(()=>{

    fetchSiteSettings();

  },[]);



  return (

    <SiteSettingsContext.Provider
      value={{
        settings,
        loading,
        fetchSiteSettings
      }}
    >

      {children}

    </SiteSettingsContext.Provider>

  );

};


export const useSiteSettings = () => {

  const context = useContext(
    SiteSettingsContext
  );


  if(!context){

    throw new Error(
      "useSiteSettings must be used inside SiteSettingsProvider"
    );

  }


  return context;

};