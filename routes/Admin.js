const router = require('express').Router();
const {AdminLogin,AddQuestions,AddCourses,GetCourses,GetQuestions,GetRandomQuestions} = require('../controller/Admin')

router.post('/AdminLogin',AdminLogin)
router.post('/AddQuestions',AddQuestions)
router.post('/AddCourses',AddCourses)
router.get('/GetCourses',GetCourses)
router.get('/GetQuestions',GetQuestions)
router.get('/GetRandomQuestions/:CoursesId',GetRandomQuestions)


module.exports = router