import { Response } from "express"
import { db } from './config/firebase'

type CourseEntryType = {
  Course: string,
}

type Request = {
  body: CourseEntryType,
  params: { courseId: string }
}

//adding course to db
const addCourse = async (req: Request, res: Response) => {
    const {Course } = req.body
    try {
      const entry = db.collection('Courses').doc()
      const entryObject = {
        id: entry.id,
        Course,
      }
  
      await entry.set(entryObject)
  
      res.status(200).send({
        status: 'success',
        message: 'Course added successfully',
        data: entryObject
      })
    } catch(error) {
        res.status(500).json(error)
    }
  }

  //getting one course from db
  const getAllCourses = async (req: Request, res: Response) => {
    try {
      const allCourses: CourseEntryType[] = []
      const querySnapshot = await db.collection('Courses').get()
      querySnapshot.forEach((doc: any) => allCourses.push(doc.data()))
      return res.status(200).json(allCourses)
    } catch(error) { return res.status(500).json(error) }
  }
  
  //getting one course from db
  const getCourseById = async (req: Request, res: Response) => {
    const { courseId } = req.params;
  
    try {
      const courseSnapshot = await db.collection('Courses').doc(courseId).get();
  
      if (!courseSnapshot.exists) {
        return res.status(404).json({
          status: 'error',
          message: 'Course not found',
        });
      }
  
      const courseData = courseSnapshot.data();
  
      return res.status(200).json({
        status: 'success',
        data: courseData,
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: error,
      });
    }
  };

//updating course from API
const updateCourses = async (req: Request, res: Response) => {
  const { body: { Course }, params: { courseId } } = req;

  try {
    const courseEntry = db.collection('Courses').doc(courseId);
    const currentData = (await courseEntry.get()).data() || {};

    const entryObject = {
      Course: Course || currentData.Course,
    };

    await courseEntry.update(entryObject);

    return res.status(200).json({
      status: 'success',
      message: 'Course updated successfully',
      data: entryObject,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error,
    });
  }
};
  
  //deleting course from API
  const deleteCourseEntry = async (req: Request, res: Response) => {
    const { courseId } = req.params
  
    try {
      const entry = db.collection('Courses').doc(courseId)
  
      await entry.delete().catch(error => {
        return res.status(400).json({
          status: 'error',
          message: error.message
        })
      })
  
      return res.status(200).json({
        status: 'success',
        message: 'course deleted successfully',
      })
    }
    catch(error) { return res.status(500).json(error) }
  }
  
  export {addCourse, getAllCourses, updateCourses, deleteCourseEntry, getCourseById }