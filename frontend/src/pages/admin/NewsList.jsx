
import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useTranslation } from "react-i18next";
import "./NewsList.css";

const NewsList = () => {
  const { t } = useTranslation();
  const [newsList, setNewsList] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editVillageId, setEditVillageId] = useState("");
  const [editFiles, setEditFiles] = useState([]);
const[villages,setVillages]=useState([]);

  const [loading, setLoading] = useState(true);
const [search, setSearch] = useState("");
const [statusFilter, setStatusFilter] = useState("");
const [sortBy, setSortBy] = useState("newest");
const [successMessage, setSuccessMessage] = useState("");

//   useEffect(() => {
//     fetchNews();
//   }, []);
const fetchNews = async () => {
  try {
    setLoading(true);

    const res = await axiosInstance.get("/api/news");

    setNewsList(res.data);

  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};
useEffect(() => {
  fetchNews();
  fetchVillages();
}, []);

const fetchVillages = async () => {
  try {
    const res = await axiosInstance.get("/api/villages");
    setVillages(res.data);
  } catch (err) {
    console.error(err);
  }
};

const deleteNews = async (id) => {
  const confirmDelete = window.confirm(t("confirmDelete"));

  if (!confirmDelete) return;

  try {
    await axiosInstance.delete(`/api/news/${id}`);

    setSuccessMessage(t("newsDeleted"));

    fetchNews();

  } catch (err) {
    console.error(err);
  }
};

  const startEdit = (news) => {
    setEditId(news.id);
    setEditTitle(news.title);
    setEditContent(news.content);
    setEditVillageId(news.village_id || "");
    setEditFiles([]);
  };

  const handleFiles = (e) => {
    setEditFiles([...editFiles, ...Array.from(e.target.files)]);
  };

  const removeFile = (index) => {
    const newFiles = [...editFiles];
    newFiles.splice(index, 1);
    setEditFiles(newFiles);
  };

  const deleteMedia = async (mediaId) => {
    try {
      await axiosInstance.delete(`/api/medias/${mediaId}`);
      fetchNews();
    } catch (err) {
      console.error(err);
    }
  };


const saveEdit = async () => {
  try {
    console.log(editId);
    console.log(editFiles); // أضيفي هذا السطر

    console.log({
      title: editTitle,
      content: editContent,
      village_id: editVillageId || null,
    });

    const res = await axiosInstance.put(`/api/news/${editId}`, {
      title: editTitle,
      content: editContent,
      village_id: editVillageId || null,
    });

    if (editFiles.length > 0) {
      const formData = new FormData();

      editFiles.forEach((file) => {
        formData.append("files", file);
      });

      formData.append("news_id", editId);
        formData.append("title", editTitle);
formData.append("description", editContent);
      const mediaRes = await axiosInstance.post(
        "/api/medias",
        formData
      );

      console.log(mediaRes.data);
    }

  
    setSuccessMessage(t("newsUpdated"));

    setEditId(null);
    fetchNews();

  } catch (err) {
    console.log(err.response?.status);
    console.log(err.response?.data);
    console.error(err);
  }
};

const filteredNews = newsList
.filter((item) => {

const matchSearch =
item.title
.toLowerCase()
.includes(search.toLowerCase());

const matchStatus =
statusFilter === ""
|| item.status === statusFilter;

return matchSearch && matchStatus;

})
.sort((a,b)=>{

if(sortBy==="newest"){
return new Date(b.createdAt)-new Date(a.createdAt);
}

if(sortBy==="oldest"){
return new Date(a.createdAt)-new Date(b.createdAt);
}

return 0;

});
useEffect(()=>{

if(successMessage){

const timer=setTimeout(()=>{

setSuccessMessage("");

},3000);

return ()=>clearTimeout(timer);

}

},[successMessage]);
const totalNews = newsList.length;

const publishedNews = newsList.filter(
  (item) => item.status === "published"
).length;

const draftNews = newsList.filter(
  (item) => item.status === "draft"
).length;

const totalMedia = newsList.reduce(
  (total, item) => total + (item.media?.length || 0),
  0
);

const totalViews = newsList.reduce(
  (total, item) => total + (item.views || 0),
  0
);
  return (
    <div className="news-list-container">

  <div className="news-header">

    <h2>{t("newsList")}</h2>

    <div className="stats-container">

      <div className="stat-card">
        <h3>{totalNews}</h3>
        <span>{t("totalNews")}</span>
      </div>

      <div className="stat-card">
        <h3>{publishedNews}</h3>
        <span>{t("published")}</span>
      </div>

      <div className="stat-card">
        <h3>{draftNews}</h3>
        <span>{t("draft")}</span>
      </div>

      <div className="stat-card">
        <h3>{totalMedia}</h3>
        <span>{t("mediaFiles")}</span>
      </div>

      <div className="stat-card">
        <h3>{totalViews}</h3>
        <span>{t("views")}</span>
      </div>

    </div>

  </div>

  {successMessage && (
    <div className="success-message">
      {successMessage}
    </div>
  )}

  <div className="toolbar">

    <input
      type="text"
      placeholder={t("searchNews")}
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />

    <select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
    >
      <option value="">{t("all")}</option>
      <option value="published">{t("published")}</option>
      <option value="draft">{t("draft")}</option>
    </select>

    <select
      value={sortBy}
      onChange={(e) => setSortBy(e.target.value)}
    >
      <option value="newest">{t("newest")}</option>
      <option value="oldest">{t("oldest")}</option>
    </select>

  </div>

  {loading ? (

    <div className="loading-box">
      {t("loading")}
    </div>

  ) : filteredNews.length === 0 ? (

    <div className="empty-box">
      {t("noNews")}
    </div>

  ) : (

    filteredNews.map((news) => (

      <div key={news.id} className="news-card">

        {editId === news.id ? (

          <div className="edit-form">

            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />

            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />

            <select
              value={editVillageId}
              onChange={(e) => setEditVillageId(e.target.value)}
            >
              <option value="">
                {t("generalMunicipality")}
              </option>

              {villages.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}

            </select>

            <input
              type="file"
              multiple
              onChange={handleFiles}
            />

            <div className="preview-container">

              {editFiles.map((file, index) => (

                <div key={index} className="preview-item">

                  {file.type.startsWith("image") ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                    />
                  ) : file.type.startsWith("video") ? (
                    <video
                      controls
                      src={URL.createObjectURL(file)}
                    />
                  ) : (
                    <span>{file.name}</span>
                  )}

                  <button
                    onClick={() => removeFile(index)}
                  >
                    ✕
                  </button>

                </div>

              ))}

            </div>

            <div className="actions">

              <button
                className="save-btn"
                onClick={saveEdit}
              >
                {t("Save Changes")}
              </button>

              <button
                className="cancel-btn"
                onClick={() => setEditId(null)}
              >
                {t("Cancel")}
              </button>

            </div>

          </div>

        ) : (

          <>

            <div className="news-top">

              <h3>{news.title}</h3>

              <span className={`status-badge ${news.status}`}>
                {news.status}
              </span>

            </div>

            <p>{news.content}</p>

            {/* <div className="news-info">

              <span>👁 {news.views}</span>

              <span>
                📅 {new Date(news.createdAt).toLocaleDateString()}
              </span>

              <span>
                📎 {news.media?.length || 0}
              </span>

            </div> */}

            <p>

              <strong>{t("publishType")}:</strong>{" "}

              {news.village
                ? news.village.name
                : t("generalMunicipality")}

            </p>

            <div className="media-container">

              {news.media?.map((m) => (

                <div
                  key={m.id}
                  className="media-item"
                >

                  {m.type === "image" ? (

                    <img
                      src={`http://localhost:5000/${m.file_path}`}
                      alt={m.title}
                    />

                  ) : m.type === "video" ? (

                    <video
                      controls
                      src={`http://localhost:5000/${m.file_path}`}
                    />

                  ) : (

                    <a
                      href={`http://localhost:5000/${m.file_path}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {m.title}
                    </a>

                  )}

                  <button
                    className="remove-btn"
                    onClick={() => deleteMedia(m.id)}
                  >
                    ✕
                  </button>

                </div>


              ))}
              

            </div>
                   <div className="news-info">

              <span>👁 {news.views}</span>

              <span>
                📅 {new Date(news.createdAt).toLocaleDateString()}
              </span>

              <span>
                📎 {news.media?.length || 0}
              </span>

            </div>
            <div className="actions">

              <button
                className="edit-btn"
                onClick={() => startEdit(news)}
              >
                {t("editNews")}
              </button>

              <button
                className="delete-btn"
                onClick={() => deleteNews(news.id)}
              >
                {t("deleteNews")}
              </button>

            </div>

          </>

        )}

      </div>

    ))

  )}

</div>
    
  );
};

export default NewsList;