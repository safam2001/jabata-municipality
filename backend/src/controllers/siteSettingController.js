const SiteSetting = require("../models/siteSetting");
const logger = require("../logger");


// =======================================
// GET SITE SETTINGS
// Public
// =======================================

const getSiteSetting = async (req, res) => {

  try {

    let settings = await SiteSetting.findOne();


    // إذا لا يوجد سجل ننشئ سجل افتراضي

    if (!settings) {

      settings = await SiteSetting.create({

        siteName: "بلدية جباثا الخشب",

        description:
          "الموقع الرسمي لبلدية جباثا الخشب",

        workingHours:
          "الأحد - الخميس | 8:00 صباحاً - 3:00 مساءً"

      });

    }


    return res.status(200).json({

      success: true,

      settings

    });


  } catch (error) {


    logger.error(error.message);


    return res.status(500).json({

      success:false,

      message:error.message

    });


  }

};




// =======================================
// UPDATE SITE SETTINGS
// Admin Only
// =======================================

const updateSiteSetting = async (req,res)=>{


  try {
    const body = req.body || {};

const jsonFields = [
  "siteName",
  "description",
  "address",
  "workingHours",
  "copyright",
];

jsonFields.forEach((field) => {
  if (typeof body[field] === "string") {
    try {
      body[field] = JSON.parse(body[field]);
    } catch (error) {
      console.error(`Invalid JSON in ${field}:`, body[field]);
    }
  }
});

let settings = await SiteSetting.findOne();

if (!settings) {

  settings = await SiteSetting.create({
    ...body,
    updatedBy: req.user?.id || null
  });

} else {

  const allowedFields = [
    "siteName",
    "description",
    "logo",
    "address",
    "phone",
    "whatsapp",
    "email",
    "workingHours",
    "facebook",
    "instagram",
    "youtube",
    "telegram",
    "mapUrl",
    "latitude",
    "longitude",
    "mapImage",
    "primaryColor",
    "secondaryColor",
    "navbarColor",
    "footerColor",
    "developerName",
    "copyright"
  ];

  allowedFields.forEach((field) => {
    if (body[field] !== undefined) {
      settings[field] = body[field];
    }
  });

  if (req.files?.logo?.[0]) {
    settings.logo =
      req.files.logo[0].path.replace(/\\/g, "/");
  }

  if (req.files?.mapImage?.[0]) {
    settings.mapImage =
      req.files.mapImage[0].path.replace(/\\/g, "/");
  }

  if (req.user) {
    settings.updatedBy = req.user.id;
  }

  await settings.save();
}

    logger.info(

      `Admin ${req.user?.id} updated site settings`

    );


    return res.status(200).json({

      success:true,

      message:
      "Site settings updated successfully",

      settings

    });



  }catch(error){



    logger.error(error.message);



    return res.status(500).json({

      success:false,

      message:error.message

    });


  }


};





// =======================================
// CREATE SITE SETTINGS
// Admin Only
// إذا لم يوجد سجل
// =======================================


const createSiteSetting = async(req,res)=>{


try{


const existing =
await SiteSetting.findOne();



if(existing){


return res.status(400).json({

success:false,

message:
"Site settings already exist"

});


}

const settings =
await SiteSetting.create({

...req.body,

updatedBy:
req.user?.id || null

});


return res.status(201).json({

success:true,

message:
"Site settings created successfully",

settings

});



}catch(error){


logger.error(error.message);



return res.status(500).json({

success:false,

message:error.message

});


}


};


// =======================================
// EXPORTS
// =======================================


module.exports = {


getSiteSetting,

updateSiteSetting,

createSiteSetting


};

