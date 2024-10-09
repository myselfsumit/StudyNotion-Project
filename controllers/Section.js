const Course = require("../models/Course");
const Section = require("../models/Section");

exports.createSection = async (req, res) =>{
    try {
        //data fetch 
        const {sectionName, courseId } = req.body;

        // data validation
        if(!sectionName || !courseId)
        {
            return res.status(400).json({
                success : false,
                message : "Missing Properties",
            });
        }

        //create section
        const newSection = await Section.create({sectionName})
        //update course with section ObjectID
        const updatedCourseDetails = await Course.findByIdAndUpdate(courseId, {
            $push :{
                courseContent : newSection._id,
            }
        }, {new : true});
        //HW : Use populate to replace sections/sub-sections both in the updatedCourseDetails
        //return response
        return res.status(200).json({
            success : true,
            message : "Section created successfully",
            updatedCourseDetails,
        });
    }
    catch(err)
    {
        return res.status(500).json({
            success : false,
            message : "Unable to create section, please try again",
            error : err.message,
        });
    }
}

//Update Section
exports.updateSection = async (req, res) => {
    try {
        //data fetching 
        const {sectionName, sectionId} = req.body;

        //data validation
        if(!sectionName || !sectionId)
        {
            return res.status(400).json({
                success : false,
                message : "Missing Properties",
            });
        }

        //update data
        const section = await Section.findByIdAndUpdate(sectionId, {sectionName}, {new : true});

        //return response
        return res.status(200).json({
            success : true,
            message : "Section Updated Successfully",
        });
    }
    catch(err)
    {
        return res.status(400).json({
            success : false,
            message : "Unable to create section, please try again",
        });
    }
}

//deleted section
exports.deleteSection = async (req, res) => {
    try 
    {
        //data fetching -> assuming that we are sending ID in params
        const sectionId = req.params; 
        //delete id correspond data
        await Section.findByIdAndDelete(sectionId);
        //return response
        return res.status(200).json({
            success : true,
            message : "Section deleted successfully",
        });
    }
    catch(err)
    {
        return res.status(400).json({
            success : false,
            message : "Unable to delete section, please try again",
        });
    }
}