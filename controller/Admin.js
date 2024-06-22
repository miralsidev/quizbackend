const dotenv = require("dotenv");
dotenv.config();
const { Admin } = require('../models/Admin')
const jwt = require("jsonwebtoken");
const { Questions } = require('../models/Qustions')
const bcrypt = require("bcrypt");
const Course = require("../models/Course");

const AdminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (email && password) {
      console.log("admin----email-", email);
      const admin = await Admin.findOne({ email: email });
      console.log("Admin====", admin);
      if (admin) {
        const ismatch = bcrypt.compareSync(password, admin.password);
        if (ismatch) {
          const token = jwt.sign(
            {
              id: admin.id,
              email: admin.email,
            },
            process.env.JWT_SECRATE_KEY
          );

          return res.json({
            status: 200,
            message: "login successfully..!!",
            token,
          });
        } else {
          return res.json({
            status: 409,
            message: "Somthing went wrong, Please try later...!!",
          });
        }
      } else {
        return res.json({
          status: 409,
          message: "Somthing went wrong,please try later...!!",
        });
      }
    } else {
      res.json({
        status: 400,
        message: "all field are required..!!",
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      status: 500,
      message: "intrnal server error",
    });
  } ``
}
const AddQuestions = async (req, res) => {
  try {
    const { Question, Option1, Option2, Option3, Option4, Answer,CoursesId } = req.body
    if (Question&&Option1&&Option2&&Option3&&Option4&&Answer&&CoursesId) {
      if (![Option1, Option2, Option3, Option4].includes(Answer)) {
        return res.json({ status: 400, message: "Answer must be one of the provided options" });
      }
      const data = new Questions({
        Question: Question,
        Option1: Option1,
        Option2: Option2,
        Option3: Option3,
        Option4: Option4,
        Answer: Answer,
        CoursesId: CoursesId
      })
      await data.save();
      return res.json({ status: 200, message: 'Questions Add succesfully' ,data})
    } else {
      return res.json({ status: 400, message: "all field are required" });
    }
  } catch (error) {
    console.log(error);
    return res.json({ status: 500, message: "intrnal server error" });
  }

}
const AddCourses = async(req,res)=>{
  try {
    const { name } = req.body;

    if (name) {
      const course = new Course({ name });

      await course.save();

      return res.json({ status: 200, message: 'Course added successfully', course });
    } else {
      return res.json({ status: 400, message: 'Course name is required' });
    }
  } catch (error) {
    console.error(error);
    return res.json({ status: 500, message: 'Internal server error' });
  }
}
const GetCourses = async (req, res) => {
  try {
    const data = await Course.find();

    return res.json({ status: 200, data });
  } catch (error) {
    console.error(error);
    return res.json({ status: 500, message: 'Internal server error' });
  }
};
const GetQuestions = async (req, res) => {
  try {
    const data = await Questions.find().populate('CoursesId');

    return res.json({ status: 200,  data   });

  } catch (error) {
    console.error(error);
    return res.json({ status: 500, message: 'Internal server error' });
  }
};
const GetRandomQuestions = async (req, res) => {
  try {
    const { CoursesId } = req.params;

    // Fetch all questions for the given course ID
    const allQuestions = await Questions.find({ CoursesId });

    if (allQuestions.length === 0) {
      return res.json({ status: 404, message: 'No questions found for the given course ID' });
    }

    // Randomly select 10 questions
    const selectedQuestions = allQuestions.sort(() => 0.5 - Math.random()).slice(0, 10);

    return res.json({ status: 200, questions: selectedQuestions });
  } catch (error) {
    console.log(error);
    return res.json({ status: 500, message: 'Internal server error' });
  }
};
module.exports = { AdminLogin, AddQuestions,AddCourses,GetCourses,GetQuestions ,GetRandomQuestions}
