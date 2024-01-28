
import * as express from "express"
import * as functions from "firebase-functions"
import {addCourse, getAllCourses, updateCourses, deleteCourseEntry, getCourseById } from './courseController'


const app = express()

app.get('/', (req, res) => res.status(200).send('Hey there!'))
app.post('/courses', addCourse)
app.get('/courses', getAllCourses)
app.patch('/courses/:courseId', updateCourses)
app.delete('/courses/:courseId', deleteCourseEntry)
app.get('/courses/:courseId', getCourseById)

exports.app = functions.https.onRequest(app)