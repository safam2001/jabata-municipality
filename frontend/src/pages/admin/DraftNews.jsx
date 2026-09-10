import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useTranslation } from "react-i18next";
import { showAppModal } from "../../utils/modal";
import "./DraftNews.css";

const DraftNews = () => {

  const { t } = useTranslation();

  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingNews, setEditingNews] = useState(null);

  const [formData, setFormData] = useState({
    title:"",
    content:""
  });


  useEffect(() => {
    fetchDrafts();
  }, []);



  const fetchDrafts = async () => {

    try {

      setLoading(true);

      const res =
        await axiosInstance.get("/api/news/drafts");

      setDrafts(res.data);


    } catch(err){

      console.error(err);

    } finally {

      setLoading(false);

    }

  };



  const openEdit = (news)=>{

    setEditingNews(news);

    setFormData({
      title:news.title,
      content:news.content
    });

  };



  const saveEdit = async()=>{

    try{

      await axiosInstance.put(
        `/api/news/${editingNews.id}`,
        {
          title:formData.title,
          content:formData.content,
          status:"draft"
        }
      );


      setEditingNews(null);

      fetchDrafts();


    }catch(err){

      console.error(err);

    }

  };



  const publishNews = async(id)=>{

    try{

      await axiosInstance.put(
        `/api/news/${id}`,
        {
          status:"published"
        }
      );


      fetchDrafts();


    }catch(err){

      console.error(err);

    }

  };



  const deleteNews = async(id)=>{


    if(!(await showAppModal(t("confirmDelete"), { type: "confirm" })))
      return;


    try{

      await axiosInstance.delete(
        `/api/news/${id}`
      );


      fetchDrafts();


    }catch(err){

      console.error(err);

    }

  };



  if(loading){

    return (
      <div className="loading-box">
        {t("loading")}
      </div>
    );

  }



  return (

<div className="draft-news-container">


<div className="page-header">

<h2>
{t("draftNews")}
</h2>

<p>
{drafts.length} {t("drafts")}
</p>

</div>



{
drafts.length===0 ? (

<div className="empty-box">
{t("noDrafts")}
</div>


):(


<div className="draft-grid">


{drafts.map(news=>(


<div 
key={news.id}
className="draft-card"
>


<div className="draft-top">

<h3>
{news.title}
</h3>


<span className="draft-badge">
{t("draft")}
</span>


</div>



<p>
{news.content}
</p>



<div className="draft-info">

<span>
📅 {new Date(news.createdAt)
.toLocaleDateString()}
</span>


<span>
📎 {news.media?.length || 0}
</span>

</div>




<div className="draft-actions">


<button
className="edit-btn"
onClick={()=>openEdit(news)}
>
{t("edit")}
</button>



<button
className="publish-btn"
onClick={()=>publishNews(news.id)}
>
{t("publish")}
</button>



<button
className="delete-btn"
onClick={()=>deleteNews(news.id)}
>
{t("delete")}
</button>



</div>


</div>


))}


</div>

)

}





{editingNews && (

<div className="modal-overlay">


<div className="modal-content">


<h3>
{t("editNews")}
</h3>



<input

type="text"

value={formData.title}

onChange={(e)=>
setFormData({
...formData,
title:e.target.value
})
}

/>



<textarea

value={formData.content}

onChange={(e)=>
setFormData({
...formData,
content:e.target.value
})
}

/>



<div className="modal-actions">


<button
className="save-btn"
onClick={saveEdit}
>
{t("save")}
</button>



<button
className="cancel-btn"
onClick={()=>{
setEditingNews(null)
}}
>
{t("cancel")}
</button>


</div>



</div>


</div>

)}




</div>

  );

};


export default DraftNews;