import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./CreateNews.css";

const CreateNews = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [villageId, setVillageId] = useState(null);
  const [villages, setVillages] = useState([]);
  const [files, setFiles] = useState([]);

  // جلب القرى
  useEffect(() => {
    axiosInstance
      .get("/api/villages")
      .then((res) => setVillages(res.data))
      .catch((err) => console.error(err));
  }, []);

  // اختيار الملفات
  const handleFiles = (e) => {
    setFiles([...files, ...Array.from(e.target.files)]);
  };

  // حذف ملف من القائمة
  const removeFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  // إنشاء خبر جديد
  const createNews = async (status = "published") => {
    try {
      // 1) إنشاء الخبر
      const res = await axiosInstance.post("/api/news", {
        title,
        content,
        village_id: villageId || null,
        status,
      });

      const newsId = res.data.news.id;

      // 2) رفع الوسائط إذا موجودة
      if (files.length > 0) {
        const formData = new FormData();

        for (let file of files) {
          formData.append("files", file);
        }

        formData.append("news_id", newsId);
        formData.append("title", title);
        formData.append("content", content);

        await axiosInstance.post("/api/medias", formData);
      }

      // 3) الرجوع لقائمة الأخبار
      navigate("/admin/news");

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="create-news-container">

      <h2>+{t("createNews")}</h2>

      {/* العنوان */}
      <div className="form-group">

        <label>{t("title")}</label>

        <input
          type="text"
          placeholder={t("newsTitle")}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

      </div>

      {/* المحتوى */}
      <div className="form-group">

        <label>{t("content")}</label>

        <textarea
          placeholder={t("content")}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

      </div>

      {/* نشر الخبر */}
      <div className="form-group">

        <label>{t("publishType")}</label>

        <select
          value={villageId || ""}
          onChange={(e) =>
            setVillageId(e.target.value || null)
          }
        >

          <option value="">
            {t("generalMunicipality")}
          </option>

          {villages.map((v) => (
            <option
              key={v.id}
              value={v.id}
            >
              {v.name}
            </option>
          ))}

        </select>

      </div>

      {/* رفع الوسائط */}
      <div className="form-group">

        <label>{t("newsMediaUpload")}</label>

        <input
          type="file"
          multiple
          onChange={handleFiles}
        />

        {/* معاينة الملفات */}
        <div className="preview-container">

          {files.map((file, index) => (

            <div
              key={index}
              className="preview-item"
            >

              {file.type.startsWith("image") ? (

                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="preview-image"
                />

              ) : file.type.startsWith("video") ? (

                <video
                  controls
                  src={URL.createObjectURL(file)}
                  className="preview-video"
                />

              ) : file.type === "application/pdf" ? (

                <a
                  href={URL.createObjectURL(file)}
                  target="_blank"
                  rel="noreferrer"
                >
                  {file.name}
                </a>

              ) : (

                <span>{file.name}</span>

              )}

              <button
                type="button"
                className="remove-btn"
                onClick={() => removeFile(index)}
              >
                X
              </button>

            </div>

          ))}

        </div>

      </div>

      {/* الأزرار */}
      <div className="actions">

        <button
          type="button"
          className="publish-btn"
          onClick={() => createNews("published")}
        >
          {t("publish")}
        </button>

        <button
          type="button"
          className="draft-btn"
          onClick={() => createNews("draft")}
        >
          {t("saveDraft")}
        </button>

      </div>

    </div>
  );
};

export default CreateNews;