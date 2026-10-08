 const Holiday = require('../models/holidayModel')

exports.addholiday = async (req, res) =>
{
    try{

        if (!req.user || req.user.role.toLowerCase() !== "admin") {
        return res.status(403).json({
            message: "Access denied. Admin only."
                })
        }
        
        let{Name, Date, Day , Type} = req.body

        const holidaydata = await Holiday.create({Name, Date, Day , Type,updated_by: req.user._id} );

        return res.status(201).json(
        {
            message:"Holiday Created Successfully",
            data: holidaydata,
           
        })

    }catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to create holiday",
            error: error.message
        })
     }
}

exports.getholiday = async (req, res) => 
{
    try
    {
      
          const holidays = await Holiday.find()
        return res.status(200).json({
            success: true,
            count: holidays.length,
            data: holidays
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch holidays",
            error: error.message
        });
    }
}

exports.deleteholiday = async (req,res) => 
{
    try
    {
         if (!req.user || req.user.role.toLowerCase() !== "admin") {
        return res.status(403).json({
            message: "Access denied. Admin only."
                })
        }
        const {id} = req.params;

        const holidaytodelete = await Holiday.findById(id);
        if(!holidaytodelete)
        {
            return res.status(404).json({
                message: "Holiday Not Found."
            })
        }
        await Holiday.findByIdAndDelete(id);

        return res.status(200).json({
            message: "Holiday Deleted Succesfully"
        })
    }
    catch(ex)
    {
    console.error(ex.message);
    return res.status(500).json({
      message: "Error deleting holiday.",
    })
    }
}

exports.updateholiday = async (req,res) => 
{
    try{
         if (!req.user || req.user.role.toLowerCase() !== "admin") {
        return res.status(403).json({
            message: "Access denied. Admin only."
                })
        }
    const { id } = req.params;

    const HolidayToUpdate = await Holiday.findById(id);

         if(!HolidayToUpdate)
        {
            return res.status(404).json({
                message: "Holiday Not Found."
            })
        }

        const data = await Holiday.findByIdAndUpdate(id, req.body, { new: true });
         return res.status(200).json({
         message: "Holiday updated successfully",
         data,
         });
  } catch (ex) {
    console.error(ex.message);
    return res.status(500).json({
      message: "Error updating Holiday",
    });
    }
}
