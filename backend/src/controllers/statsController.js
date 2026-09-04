const Citizen = require("../models/citizen");
const Martyr = require("../models/martyr");
const SpecialNeed = require("../models/specialNeeds");
const Village = require("../models/village");
const News = require("../models/news");
const Media = require("../models/media");
const Comment = require("../models/comment");
const Service = require("../models/service");
const ServiceType = require("../models/serviceType");

const getStats = async (req, res) => {
  try {

    const totalCitizens = await Citizen.count();
    const totalMartyrs = await Martyr.count();
    const totalSpecialNeeds = await SpecialNeed.count();
    const totalVillages = await Village.count();
    const totalNews = await News.count();
    const totalMedia = await Media.count();
    const totalComments = await Comment.count();
    const totalServices = await Service.count();
    const totalServiceTypes = await ServiceType.count();

    const totalDraftNews = await News.count({
      where: {
        status: "draft"
      }
    });

    res.json({
      citizens: totalCitizens,
      martyrs: totalMartyrs,
      specialNeeds: totalSpecialNeeds,
      villages: totalVillages,
      news: totalNews,
      draftNews: totalDraftNews,
      media: totalMedia,
      comments: totalComments,
      services: totalServices,
      serviceTypes: totalServiceTypes
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

module.exports = {
  getStats
};