const Leave = require("../models/leaveModel");
const Notification = require("../models/notificationModel");
const User = require("../models/userModel");

// Emp Leave Manage
exports.applyleave = async (req, res) => {
  try {
    const { Reason, Leavetype, startDate, endDate } = req.body;

    const leave = await Leave.create({
      Reason,
      Leavetype,
      startDate,
      endDate,
      user: req.user._id,
      status: "Pending",
    });

    // Notify all admins about the new leave request
    const admins = await User.find({ role: "admin" });

    const applicantName =
      req.user.firstName && req.user.lastName
        ? `${req.user.firstName} ${req.user.lastName}`
        : req.user.firstName || req.user.email || "An employee";

    if (admins && admins.length > 0) {
      const notifications = admins.map((admin) => ({
        user: admin._id,
        message: `${applicantName} applied for ${Leavetype ? `${Leavetype} ` : ""}leave: ${Reason || "No reason provided"}`,
        type: "leave",
        relatedId: leave._id,
      }));

      await Notification.insertMany(notifications);
      console.log(`Notification created for ${admins.length} admin(s) for leave application:`, leave._id);
    }

    return res.status(201).json({
      message: "Leave Application Created Successfully",
      data: leave,
    });
  } catch (ex) {
    console.error(ex.message);
    return res.status(500).json({
      message: "Error Creating Application",
    });
  }
};

exports.getleave = async (req, res) => {
  try {
    const userLeave = await Leave.find(
      { user: req.user._id },
      { __v: 0 }
    );

    return res.status(200).json({
      message: "Leave applications fetched successfully",
      userLeave,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching leave applications",
    });
  }
};

exports.deleteleave = async (req, res) => {
  try {
    const { id } = req.params;
    const leavatodelete = await Leave.findById(id);
    if (!leavatodelete) {
      return res.status(404).json({
        message: "leave application not found",
      });
    }

    if (req.user.role !== "admin" && leavatodelete.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    // Delete associated leave notifications
    await Notification.deleteMany({
      relatedId: leavatodelete._id,
      type: "leave",
    });

    await Leave.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Leave Application Deleted Successfully",
    });
  } catch (ex) {
    console.error(ex.message);
    return res.status(500).json({
      message: "Error deleting leave application.",
    });
  }
};

// ADMIN MANAGE LEAVE
exports.updatestatus = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const { id } = req.params;
    const { status } = req.body;

    const allowedStatus = ["Pending", "Approved", "Rejected"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const data = await Leave.findByIdAndUpdate(
      id,
      { status: status, updatedBy: req.user._id, updatedAt: Date.now() },
      { new: true }
    );

    if (!data) {
      return res.status(404).json({
        message: "Leave application not found",
      });
    }

    if (data.user) {
      await Notification.create({
        user: data.user,
        message: `Your leave request for ${data.Leavetype || ""} leave has been ${status.toLowerCase()}`,
        type: "leave",
        relatedId: data._id,
      });
    }

    return res.status(200).json({
      message: "Leave status updated successfully",
      data,
    });
  } catch (ex) {
    console.log(ex);
    return res.status(500).json({
      message: "Error updating status",
    });
  }
};

// Admin get all leave
exports.getAllLeave = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const allLeave = await Leave.find();

    return res.status(200).json({
      message: "All leaves fetched successfully",
      allLeave,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error fetching all leaves",
    });
  }
};