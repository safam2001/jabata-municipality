
const Town = require("../models/town");

// 🟢 جلب البلدة (مفتوح للجميع)
const getTowns = async (req, res) => {
  try {
    const towns = await Town.findAll();
    res.json(towns);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🟢 إضافة بلدة (أدمن فقط)
const createTown = async (req, res) => {
  try {
   const {
  name,
  description,
  latitude,
  longitude,
  population,
  area,
  logo_url
} = req.body;

const town = await Town.create({
  name,
  description,
  latitude,
  longitude,
  population,
  area,
  logo_url
});

    res.status(201).json({
      message: "Town created successfully",
      town
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🟢 تعديل بلدة (أدمن فقط)
const updateTown = async (req, res) => {
  try {
    const town = await Town.findByPk(req.params.id);
    if (!town) return res.status(404).json({ message: "Town not found" });

    const {
  name,
  description,
  latitude,
  longitude,
  population,
  area,
  logo_url
} = req.body;

town.name = name ?? town.name;
town.description = description ?? town.description;
town.latitude = latitude ?? town.latitude;
town.longitude = longitude ?? town.longitude;
town.population = population ?? town.population;
town.area = area ?? town.area;
town.logo_url = logo_url ?? town.logo_url;

    await town.save();

    res.json({
      message: "Town updated successfully",
      town
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🟢 حذف بلدة (أدمن فقط)
const deleteTown = async (req, res) => {
  try {
    const town = await Town.findByPk(req.params.id);
    if (!town) return res.status(404).json({ message: "Town not found" });

    await town.destroy();
    res.json({ message: "Town deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getTowns,
  createTown,
  updateTown,
  deleteTown
};