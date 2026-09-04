const News = require("../models/news");
const Village = require("../models/village");
const User = require("../models/user");
const Media = require("../models/media");
const logger = require("../logger");


// =========================

// جلب جميع الأخبار
// =========================
const { Op } = require("sequelize");

// =========================
// جلب الأخبار + البحث والفلترة
// =========================
const getNews = async (req, res) => {
  try {

    const {
      search,
      village_id,
      category
    } = req.query;

    // شروط البحث
    const where = {
      status: "published"
    };

    // البحث بعنوان الخبر أو محتواه
    if (search && search.trim() !== "") {
      where[Op.or] = [
        {
          title: {
            [Op.iLike]: `%${search.trim()}%`
          }
        },
        {
          content: {
            [Op.iLike]: `%${search.trim()}%`
          }
        }
      ];
    }

    // فلترة حسب القرية
    if (village_id) {
      where.village_id = village_id;
    }

    // فلترة حسب التصنيف
    if (category) {
      where.category = category;
    }

    const news = await News.findAll({
      where,

      include: [
        {
          model: Village,
          as: "village",
          attributes: ["id", "name"]
        },
        {
          model: User,
          as: "publishedBy",
          attributes: [
            "id",
            "firstName",
            "lastName"
          ]
        },
        {
          model: Media,
          as: "media",
          attributes: [
            "id",
            "title",
            "file_path",
            "type"
          ]
        }
      ],

      order: [["createdAt", "DESC"]]
    });

    res.status(200).json(news);

  } catch (err) {

    logger.error(err.message);

    res.status(500).json({
      message: err.message
    });

  }
};
// const getNews = async (req, res) => {
//   try {

// const news = await News.findAll({
//   include: [
//     {
//       model: Village,
//       as: "village",
//       attributes: ["id", "name"]
//     },
//     {
//       model: User,
//       as: "publishedBy",
//       attributes: ["id", "firstName", "lastName"]
//     },
//     {
//       model: Media,
//       as: "media",
//       attributes: ["id", "title", "file_path", "type"]
//     }
//   ],
//   order: [["createdAt", "DESC"]]
// });


//     res.status(200).json(news);


//   } catch (err) {

//     logger.error(err.message);

//     res.status(500).json({
//       message: err.message
//     });

//   }
// };




// =========================
// جلب خبر واحد وزيادة عدد المشاهدات
// =========================
const getNewsById = async (req, res) => {
  try {

    const news = await News.findByPk(
      req.params.id,
      {
        include:[
          {
            model: Village,
             as:"village",
            attributes:["id","name"]
          },
          {
            model: Media,
            as:"media",
            attributes:[
              "id",
              "title",
              "file_path",
              "type"
            ]
          }
        ]
      }
    );


    if(!news){
      return res.status(404).json({
        message:"News not found"
      });
    }


    news.views += 1;

    await news.save();


    res.json(news);


  } catch(err){

    logger.error(err.message);

    res.status(500).json({
      message:err.message
    });

  }
};




// =========================
// إنشاء خبر جديد
// =========================
const createNews = async (req,res)=>{
  try {


    const {
      title,
      content,
      category,
      village_id,
      status
    } = req.body;

const newsStatus = status || "published";

const news = await News.create({

 title,
 content,
 category,
 village_id: village_id || null,
 admin_id:req.user.id,

 status: newsStatus,

 published_at:
   newsStatus === "published"
     ? new Date()
     : null
});



    logger.info(
      `Admin ${req.user.id} created news ${news.id}`
    );



    res.status(201).json({

      message:"News created successfully",

      news

    });


  } catch(err){

    logger.error(err.message);

    res.status(500).json({
      message:err.message
    });

  }
};




// =========================
// تعديل خبر
// =========================
const updateNews = async(req,res)=>{
  try {


    const news =
      await News.findByPk(req.params.id);



    if(!news){

      return res.status(404).json({
        message:"News not found"
      });

    }



    const {
      title,
      content,
      category,
      status,
      village_id
    } = req.body;



    news.title =
      title ?? news.title;


    news.content =
      content ?? news.content;


    news.category =
      category ?? news.category;


    news.status =
      status ?? news.status;


    news.village_id =
      village_id ?? news.village_id;



    await news.save();



    logger.info(
      `Admin ${req.user.id} updated news ${news.id}`
    );



    res.json({

      message:"News updated successfully",

      news

    });


  } catch(err){


    logger.error(err.message);


    res.status(500).json({
      message:err.message
    });

  }
};


const getDraftNews = async (req, res) => {
  try {
    const news = await News.findAll({
      where: { status: "draft" },
      include: [
        { model: Media, as: "media" },
        { model: Village, as: "village",  attributes:["id","name"] }
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =========================
// حذف خبر
// =========================
const deleteNews = async(req,res)=>{
  try {


    const news =
      await News.findByPk(req.params.id);



    if(!news){

      return res.status(404).json({
        message:"News not found"
      });

    }



    await news.destroy();



    logger.info(
      `Admin ${req.user.id} deleted news ${news.id}`
    );



    res.json({

      message:"News deleted successfully"

    });



  } catch(err){


    logger.error(err.message);


    res.status(500).json({
      message:err.message
    });

  }
};



module.exports = {
  getNews,
  getNewsById,
  createNews,
  updateNews,
  getDraftNews,
  deleteNews
};