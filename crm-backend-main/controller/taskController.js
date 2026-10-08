const task = require("../models/taskModel");
const Notification = require("../models/notificationModel");

const isAdmin = (user) => user && user.role === "admin";
const sameUser = (a, b) => a && b && a.toString() === b.toString();

exports.createtask = async (req, res) => {
  try {
    const { title, description, assignedTo, status, priority, dueDate } = req.body;

    const newtask = await task.create({
      title,
      description,
      assignedTo,
      status: status || "Pending",
      priority,
      dueDate,
      createdBy: req.user._id,
    });

    await newtask.populate("createdBy", "firstName lastName email");
    await newtask.populate("assignedTo", "firstName lastName email");

    if (assignedTo) {
      await Notification.create({
        user: assignedTo,
        message: `${newtask.createdBy?.firstName || "A user"} ${newtask.createdBy?.lastName || ""} assigned you a new task: ${title}`,
        type: "task",
        relatedId: newtask._id,
      });

      console.log("Notification created for user:", assignedTo);
    }

    res.status(201).json({
      message: "Task created successfully",
      data: newtask,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await task
      .find()
      .populate("createdBy", "firstName lastName email")
      .populate("assignedTo", "firstName lastName email");

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.deletetask = async (req, res) => {
  try {
    const { id } = req.params;
    const taskstodelete = await task.findById(id);
    if (!taskstodelete) {
      return res.status(404).json({
        message: "task not found",
      });
    }

    if (!isAdmin(req.user) && !sameUser(taskstodelete.createdBy, req.user._id)) {
      return res.status(403).json({
        message: "Only the task creator or an admin can delete this task",
      });
    }

    await Notification.deleteMany({
      relatedId: taskstodelete._id,
      type: "task",
    });

    await task.findByIdAndDelete(id);
    return res.status(200).json({
      message: "Task Deleted Successfully",
    });
  } catch (ex) {
    console.error(ex.message);
    return res.status(500).json({
      message: "Error deleting task",
    });
  }
};

exports.updatetask = async (req, res) => {
  try {
    const { id } = req.params;
    const taskstoupdate = await task.findById(id);
    if (!taskstoupdate) {
      return res.status(404).json({
        message: "task not found",
      });
    }

    const canEdit =
      isAdmin(req.user) ||
      sameUser(taskstoupdate.createdBy, req.user._id) ||
      sameUser(taskstoupdate.assignedTo, req.user._id);

    if (!canEdit) {
      return res.status(403).json({
        message: "You cannot update this task",
      });
    }

    const data = await task
      .findByIdAndUpdate(id, req.body, { new: true })
      .populate("createdBy", "firstName lastName email")
      .populate("assignedTo", "firstName lastName email");

    return res.status(200).json({
      message: "Task Updated Succesfully",
      data,
    });
  } catch (ex) {
    console.error(ex.message);
    return res.status(500).json({
      message: "Error updating task.",
    });
  }
};