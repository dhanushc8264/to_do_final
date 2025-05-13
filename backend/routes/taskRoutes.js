import express from "express";
import Task from "../models/TaskModel.js"
import protectedRoute from "../middlewares/AuthMiddleware.js";

const router = express.Router()


router.get("/", protectedRoute, async (req, res) => {
    try {
      const tasks = await Task.find({ userId: req.user._id }); // ✅ Fetch only the logged-in user's tasks
      res.status(200).send({
        success: true,
        message: "Tasks fetched successfully",
        tasks,
      });
    } catch (err) {
      res.status(500).send({
        success: false,
        message: "Error fetching tasks",
        error: err.message,
      });
    }
  });
  


router.post("/" , protectedRoute ,async(req,res)=>{

    try{
        const {text} = req.body

        if (!text || text.trim() === "") { 
            return res.status(400).send({
                success: false,
                message: "Task text is required"
            });
        }
    
        const newTask = new Task({ text, userId: req.user._id });
        await newTask.save()

        res.status(200).send({
            success : true,
            message :"Post request success",
            task : newTask
        })
    }
    catch(err)
    {
        res.status(500).send({
            success:false,
            message : "Error in post request",
            error : err.message
        })
    }
    
})

router.delete("/:id",protectedRoute , async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({
                success: false,
                message: "Invalid task ID format"
            });
        }

        const deletedTask = await Task.findByIdAndDelete({ _id: id, userId: req.user._id });

      
        if (!deletedTask) {
            return res.status(404).send({
                success: false,
                message: "Task not found"
            });
        }

        res.status(200).send({
            success: true,
            message: "Deleted successfully"
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: "Error deleting task",
            error: err.message
        });
    }
});

router.put("/:id", protectedRoute ,async (req, res) => {
    try {
      const { id } = req.params;
  
     
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ success: false, message: "Invalid task ID format" });
      }
  
      const task = await Task.findOne({ _id: id, userId: req.user._id }); 
      if (!task) {
        return res.status(404).json({ success: false, message: "Task not found" });
      }
  
      task.completed = !task.completed; 
      await task.save();
  
      res.status(200).json({ success: true, message: "Task updated successfully", task });
    } catch (err) {
      res.status(500).json({ success: false, message: "Error updating task", error: err.message });
    }
  });



export default router;