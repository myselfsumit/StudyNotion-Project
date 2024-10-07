const { response } = require("express");
const Tag = require("../models/Tag");

//Create Tag Handler
exports.createTag = async (req, res) => {
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
    const tagDetails = await Tag.create({
      name: name,
      description: description,
    });
    console.log(tagDetails);

    // return response
    return res.status(200).json({
      success: true,
      message: "Tags Created Successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//Get All Tags Handler
exports.showAllTags = async (req, req) => {
    try{
        //Find the tags
        const allTags = await Tag.find({}, {name : true, description : true});
        //Return the response
        return res.status(200).json({
            success : true,
            message : "All Tags returned successfully",
            allTags,
        });
    }
    catch(err){
        return res.status(500).json({
            success : false,
            message : err.message,
        });
    }
}
