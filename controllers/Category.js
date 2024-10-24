const { response } = require("express");
const Category = require("../models/Category");

//Create Tag Handler
exports.createCategory = async (req, res) => {
  try {
    //fetch the data from req body
    const { name, description } = req.body;

    //validation
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    //create db entry
    const CategoryDetails = await Category.create({
      name: name,
      description: description,
    });
    console.log(CategoryDetails);

    // return response
    return res.status(200).json({
      success: true,
      message: "Category Created Successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//Get All Tags Handler
exports.showAllCategory = async (req, req) => {
  try {
    //Find the tags
    const allCategories = await Tag.find({}, { name: true, description: true });
    //Return the response
    return res.status(200).json({
      success: true,
      message: "All Categories returned successfully",
      allCategories,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//Category Page Details
exports.categoryPageDetails = async (req, res) => {
  try {
    // get categoryId
    const categoryId = req.body.categoryId;
    //get courses for specified categoryId
    const selectedCategory = await Category.findById(categoryId)
      .populate("courses")
      .exec();
    //validation
    if (!selectedCategory) {
      return res.status(404).json({
        success: false,
        message: "Data Not Found",
      });
    }
    //get courses for different categories
    const differentCategories = await Category.findById({
      _id: { $ne: categoryId },
    })
      .populate("courses")
      .exec();
    //get top selling courses
    //HW
    //return response
    return res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategories,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
