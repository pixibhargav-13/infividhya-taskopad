const task = require("../models/taskModel");
const Notification = require("../models/notificationModel");

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

        await Notification.create({
      user: assignedTo,
      message: `${newtask.createdBy.firstName} ${newtask.createdBy.lastName} assigned you a new task: ${title}`,
      type: "task",
      relatedId: newtask._id,
    });


    console.log(
      "Notification created for user:",
      assignedTo
    );

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

            await Notification.deleteMany({
            relatedId: taskstodelete._id,
            type: "task"
          });


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
        const data = await task.findByIdAndUpdate(id, req.body, { new: true })
          .populate("createdBy", "firstName lastName email")
          .populate("assignedTo", "firstName lastName email");

         return res.status(200).json({
            message: "Task Updated Succesfully",
            data
          });    
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