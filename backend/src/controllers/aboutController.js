const About = require("../models/about");
const logger = require("../logger");

// =====================================================
// HELPERS
// =====================================================

const cleanValue = (value) => {
  if (value === undefined || value === null) {
    return value;
  }

  if (typeof value === "string") {
    return value.trim();
  }

  return value;
};

// =====================================================
// BOOLEAN
// =====================================================

const parseBoolean = (
  value,
  defaultValue = undefined
) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return defaultValue;
  }

  if (typeof value === "boolean") {
    return value;
  }

  if (value === "true" || value === "1") {
    return true;
  }

  if (value === "false" || value === "0") {
    return false;
  }

  return defaultValue;
};

// =====================================================
// LOCALIZED FIELDS
// =====================================================

const localizedFields = [
  "title",
  "subtitle",
  "description",
  "history",
  "vision",
  "mission",
  "values",
  "location",
  "address",
  "working_hours",
  "working_days",
  "meta_title",
  "meta_description",
];

// =====================================================
// NORMALIZE LOCALIZED
// =====================================================

const normalizeLocalized = (value) => {
  // Already object
  if (
    value &&
    typeof value === "object" &&
    !Array.isArray(value)
  ) {
    return {
      ar:
        typeof value.ar === "string"
          ? value.ar.trim()
          : "",

      en:
        typeof value.en === "string"
          ? value.en.trim()
          : "",
    };
  }

  // String
  if (typeof value === "string") {
    const trimmed = value.trim();

    if (!trimmed) {
      return {
        ar: "",
        en: "",
      };
    }

    // Try JSON string
    try {
      const parsed = JSON.parse(trimmed);

      if (
        parsed &&
        typeof parsed === "object" &&
        !Array.isArray(parsed)
      ) {
        return {
          ar:
            typeof parsed.ar === "string"
              ? parsed.ar.trim()
              : "",

          en:
            typeof parsed.en === "string"
              ? parsed.en.trim()
              : "",
        };
      }
    } catch (error) {
      // Normal string
    }

    // Normal text
    return {
      ar: trimmed,
      en: "",
    };
  }

  return {
    ar: "",
    en: "",
  };
};

// =====================================================
// CLEAN ABOUT RESPONSE
// =====================================================

const cleanAboutResponse = (about) => {
  if (!about) {
    return null;
  }

  const data =
    typeof about.toJSON === "function"
      ? about.toJSON()
      : { ...about };

  localizedFields.forEach((field) => {
    data[field] = normalizeLocalized(
      data[field]
    );
  });

  return data;
};

// =====================================================
// GET ABOUT
// PUBLIC
// =====================================================

const getAbout = async (req, res) => {
  try {
    const about = await About.findOne({
      where: {
        status: "active",
      },

      order: [
        ["display_order", "ASC"],
        ["createdAt", "ASC"],
      ],
    });

    if (!about) {
      return res.status(404).json({
        message:
          "About information not found",
      });
    }

    return res.status(200).json({
      about:
        cleanAboutResponse(about),
    });

  } catch (err) {
    logger.error(
      `Get About Error: ${err.message}`
    );

    console.error(
      "GET ABOUT ERROR:",
      err
    );

    return res.status(500).json({
      message:
        "Failed to fetch about information",
    });
  }
};

// =====================================================
// GET ABOUT ADMIN
// =====================================================

const getAboutAdmin = async (req, res) => {
  try {
    const about = await About.findOne({
      order: [
        ["display_order", "ASC"],
        ["createdAt", "ASC"],
      ],
    });

    if (!about) {
      return res.status(404).json({
        message:
          "About information not found",
      });
    }

    return res.status(200).json({
      about:
        cleanAboutResponse(about),
    });

  } catch (err) {
    logger.error(
      `Get Admin About Error: ${err.message}`
    );

    console.error(
      "GET ADMIN ABOUT ERROR:",
      err
    );

    return res.status(500).json({
      message:
        "Failed to fetch about information",
    });
  }
};

// =====================================================
// CREATE ABOUT
// =====================================================

const createAbout = async (req, res) => {
  try {
    const existingAbout =
      await About.findOne();

    if (existingAbout) {
      return res.status(409).json({
        message:
          "About information already exists",

        about:
          cleanAboutResponse(
            existingAbout
          ),
      });
    }

    const body = req.body || {};

    const about =
      await About.create({
        // =================================================
        // LOCALIZED
        // =================================================

        title:
          normalizeLocalized(
            body.title
          ),

        subtitle:
          normalizeLocalized(
            body.subtitle
          ),

        description:
          normalizeLocalized(
            body.description
          ),

        history:
          normalizeLocalized(
            body.history
          ),

        vision:
          normalizeLocalized(
            body.vision
          ),

        mission:
          normalizeLocalized(
            body.mission
          ),

        values:
          normalizeLocalized(
            body.values
          ),

        location:
          normalizeLocalized(
            body.location
          ),

        address:
          normalizeLocalized(
            body.address
          ),

        working_hours:
          normalizeLocalized(
            body.working_hours
          ),

        working_days:
          normalizeLocalized(
            body.working_days
          ),

        meta_title:
          normalizeLocalized(
            body.meta_title
          ),

        meta_description:
          normalizeLocalized(
            body.meta_description
          ),

        // =================================================
        // LOCATION
        // =================================================

        latitude:
          body.latitude !== undefined &&
          body.latitude !== ""
            ? body.latitude
            : null,

        longitude:
          body.longitude !== undefined &&
          body.longitude !== ""
            ? body.longitude
            : null,

        // =================================================
        // CONTACT
        // =================================================

        phone:
          cleanValue(body.phone) || null,

        secondary_phone:
          cleanValue(
            body.secondary_phone
          ) || null,

        email:
          cleanValue(body.email) || null,

        website:
          cleanValue(body.website) || null,

        // =================================================
        // SOCIAL MEDIA
        // =================================================

        facebook_url:
          cleanValue(
            body.facebook_url
          ) || null,

        instagram_url:
          cleanValue(
            body.instagram_url
          ) || null,

        youtube_url:
          cleanValue(
            body.youtube_url
          ) || null,

        telegram_url:
          cleanValue(
            body.telegram_url
          ) || null,

        whatsapp_number:
          cleanValue(
            body.whatsapp_number
          ) || null,

        // =================================================
        // STATUS
        // =================================================

        status:
          body.status === "inactive"
            ? "inactive"
            : "active",

        // =================================================
        // DISPLAY SETTINGS
        // =================================================

        show_history:
          parseBoolean(
            body.show_history,
            true
          ),

        show_vision:
          parseBoolean(
            body.show_vision,
            true
          ),

        show_mission:
          parseBoolean(
            body.show_mission,
            true
          ),

        show_values:
          parseBoolean(
            body.show_values,
            true
          ),

        show_contact:
          parseBoolean(
            body.show_contact,
            true
          ),

        show_social_media:
          parseBoolean(
            body.show_social_media,
            true
          ),

        display_order:
          body.display_order !== undefined &&
          body.display_order !== ""
            ? Number(body.display_order)
            : 0,
      });

    logger.info(
      `Admin ${req.user.id} created About information`
    );

    return res.status(201).json({
      message:
        "About information created successfully",

      about:
        cleanAboutResponse(about),
    });

  } catch (err) {
    logger.error(
      `Create About Error: ${err.message}`
    );

    console.error(
      "CREATE ABOUT ERROR:",
      err
    );

    console.error(
      err.stack
    );

    return res.status(500).json({
      message:
        err.message,
    });
  }
};

// =====================================================
// UPDATE ABOUT
// =====================================================

const updateAbout = async (req, res) => {
  try {
    const about =
      await About.findByPk(
        req.params.id
      );

    if (!about) {
      return res.status(404).json({
        message:
          "About information not found",
      });
    }

    const body = req.body || {};

    const updateData = {};

    // =================================================
    // LOCALIZED
    // =================================================

    localizedFields.forEach((field) => {
      if (body[field] !== undefined) {
        updateData[field] =
          normalizeLocalized(
            body[field]
          );
      }
    });

    // =================================================
    // NORMAL TEXT
    // =================================================

    const normalTextFields = [
      "phone",
      "secondary_phone",
      "email",
      "website",
      "facebook_url",
      "instagram_url",
      "youtube_url",
      "telegram_url",
      "whatsapp_number",
    ];

    normalTextFields.forEach((field) => {
      if (body[field] !== undefined) {
        const value =
          cleanValue(body[field]);

        updateData[field] =
          value === ""
            ? null
            : value;
      }
    });

    // =================================================
    // LATITUDE
    // =================================================

    if (body.latitude !== undefined) {
      updateData.latitude =
        body.latitude === ""
          ? null
          : body.latitude;
    }

    // =================================================
    // LONGITUDE
    // =================================================

    if (body.longitude !== undefined) {
      updateData.longitude =
        body.longitude === ""
          ? null
          : body.longitude;
    }

    // =================================================
    // STATUS
    // =================================================

    if (body.status !== undefined) {
      if (
        body.status === "active" ||
        body.status === "inactive"
      ) {
        updateData.status =
          body.status;
      }
    }

    // =================================================
    // DISPLAY ORDER
    // =================================================

    if (
      body.display_order !==
      undefined
    ) {
      const order =
        Number(
          body.display_order
        );

      if (!Number.isNaN(order)) {
        updateData.display_order =
          order;
      }
    }

    // =================================================
    // BOOLEAN
    // =================================================

    const booleanFields = [
      "show_history",
      "show_vision",
      "show_mission",
      "show_values",
      "show_contact",
      "show_social_media",
    ];

    booleanFields.forEach((field) => {
      if (body[field] !== undefined) {
        const value =
          parseBoolean(
            body[field]
          );

        if (value !== undefined) {
          updateData[field] =
            value;
        }
      }
    });

    // =================================================
    // DEBUG
    // =================================================

    console.log(
      "========== UPDATE ABOUT =========="
    );

    console.log(
      "ABOUT ID:",
      about.id
    );

    console.log(
      "REQ BODY:",
      body
    );

    console.log(
      "UPDATE DATA:",
      JSON.stringify(
        updateData,
        null,
        2
      )
    );

    console.log(
      "=================================="
    );

    // =================================================
    // UPDATE
    // =================================================

    await about.update(
      updateData
    );

    // =================================================
    // RELOAD
    // =================================================

    await about.reload();

    const cleaned =
      cleanAboutResponse(
        about
      );

    logger.info(
      `Admin ${req.user.id} updated About ${about.id}`
    );

    return res.status(200).json({
      message:
        "About information updated successfully",

      about: cleaned,
    });

  } catch (err) {
    logger.error(
      `Update About Error: ${err.message}`
    );

    console.error(
      "========== UPDATE ABOUT ERROR =========="
    );

    console.error(err);
    console.error(err.stack);

    console.error(
      "========================================"
    );

    return res.status(500).json({
      message:
        err.message,
    });
  }
};

// =====================================================
// UPDATE ABOUT STATUS
// =====================================================

const updateAboutStatus = async (
  req,
  res
) => {
  try {
    const about =
      await About.findByPk(
        req.params.id
      );

    if (!about) {
      return res.status(404).json({
        message:
          "About information not found",
      });
    }

    const { status } =
      req.body;

    if (
      status !== "active" &&
      status !== "inactive"
    ) {
      return res.status(400).json({
        message:
          "Status must be active or inactive",
      });
    }

    await about.update({
      status,
    });

    await about.reload();

    logger.info(
      `Admin ${req.user.id} changed About ${about.id} status to ${status}`
    );

    return res.status(200).json({
      message:
        "About status updated successfully",

      about:
        cleanAboutResponse(
          about
        ),
    });

  } catch (err) {
    logger.error(
      `Update About Status Error: ${err.message}`
    );

    console.error(
      "UPDATE ABOUT STATUS ERROR:",
      err
    );

    return res.status(500).json({
      message:
        err.message,
    });
  }
};

// =====================================================
// DELETE ABOUT
// =====================================================

const deleteAbout = async (
  req,
  res
) => {
  try {
    const about =
      await About.findByPk(
        req.params.id
      );

    if (!about) {
      return res.status(404).json({
        message:
          "About information not found",
      });
    }

    await about.destroy();

    logger.info(
      `Admin ${req.user.id} deleted About ${about.id}`
    );

    return res.status(200).json({
      message:
        "About information deleted successfully",
    });

  } catch (err) {
    logger.error(
      `Delete About Error: ${err.message}`
    );

    console.error(
      "DELETE ABOUT ERROR:",
      err
    );

    return res.status(500).json({
      message:
        err.message,
    });
  }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  getAbout,
  getAboutAdmin,
  createAbout,
  updateAbout,
  updateAboutStatus,
  deleteAbout,
};