const task = require("../models/taskModel");

const isAdmin = (user) => user.role === "admin";
const sameUser = (a, b) => a && b && a.toString() === b.toString();

exports.createtask = async (req, res) => {
  try {
    const { title, description, assignedTo, priority, dueDate } = req.body;

    const newtask = await task.create({
      title,
      description,
      createdBy: req.user._id, // Logged-in user
      assignedTo,              // User selected from the request
      priority,
      dueDate,
    });

    await newtask.populate("createdBy", "firstName lastName email");
await newtask.populate("assignedTo", "firstName lastName email");

    res.status(201).json({
      message: "Task created successfully",
      data: newtask,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error creating task",
    });
  }
};  

exports.deletetask = async (req, res) => 
    {
    try{
        const {id} = req.params;
        const taskstodelete = await task.findById(id);
        if(!taskstodelete)
        {
              return res.status(404).json({
            message: "task not found"
       })
        }
        if (!isAdmin(req.user) && !sameUser(taskstodelete.createdBy, req.user._id)) {
            return res.status(403).json({ message: "Only the task creator or an admin can delete this task" })
        }

        await task.findByIdAndDelete(id);
        return res.status(200).json({
            message: "Task Deleted Succesfully"
        })    
    }
    catch(ex)
    {
        console.error(ex.message);
        return res.status(500).json({
        message: "Error deleting Task.",
        })   
    }
}

exports.updatetask = async(req,res) =>
{
    try
    {
        const {id} = req.params;

         const taskstoupdate = await task.findById(id);
        if(!taskstoupdate)
        {
              return res.status(404).json({
            message: "task not found"
                }    )
        }
        const canEdit = isAdmin(req.user)
            || sameUser(taskstoupdate.createdBy, req.user._id)
            || sameUser(taskstoupdate.assignedTo, req.user._id);
        if (!canEdit) {
            return res.status(403).json({ message: "You cannot update this task" })
        }

        const allowed = ["title", "description", "assignedTo", "status", "priority", "dueDate"];
        const updates = {};
        for (const key of allowed) {
            if (req.body[key] !== undefined) updates[key] = req.body[key];
        }
        const data = await task.findByIdAndUpdate(id, updates, { returnDocument: 'after', runValidators: true })

         return res.status(200).json({
            message: "Task Updated Succesfully",
            data
          })    
        }
        catch(ex)
        {
          console.error(ex.message);
          return res.status(500).json({
            message: "Error updating tasks.",
          })   
        }
}



exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await task.find()
      .populate("createdBy", "firstName lastName email")
      .populate("assignedTo", "firstName lastName email");

    return res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Error fetching tasks",
    });
  }
};