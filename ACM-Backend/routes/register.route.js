import express from "express";
import logger from "../utils/logger.js"; // ✅ FIXED: Changed from 'loggers' to 'logger'
import Event from "../models/events.model.js";
import {
  AdminMiddleware,
  AuthMiddleware,
} from "../middleware/auth.middleware.js";
import Register from "../models/register.model.js";
import User from "../models/users.model.js";
import mongoose from "mongoose";

const router = express.Router();

router.post("/register", AuthMiddleware, async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const { eventId, type, groupName, members } = req.body;
    if (!userId || !eventId || !type) {
      return res
        .status(400)
        .json({ message: "User ID, Event ID, and type are required" });
    }

    let memberUserIds = [];

    if (type === "group") {
      if (!groupName || !Array.isArray(members) || members.length === 0) {
        return res.status(400).json({
          message: "Group name and members are required for group registration",
        });
      }

      const users = await User.find({ email: { $in: members } });
      if (users.length !== members.length) {
        return res
          .status(400)
          .json({ message: "Some member emails do not exist as users" });
      }

      memberUserIds = users.map((u) => u._id);
    }

    const conflictQuery = {
      eventId,
      $or: [
        { userId },
        { members: userId },
        ...(groupName
          ? [{ groupName: { $regex: `^${groupName}$`, $options: "i" } }]
          : []),
        ...(memberUserIds.length
          ? [
              { userId: { $in: memberUserIds } },
              { members: { $in: memberUserIds } },
            ]
          : []),
      ],
    };

    const alreadyRegistered = await Register.findOne(conflictQuery);

    if (alreadyRegistered) {
      return res.status(409).json({
        message:
          "User or group members already registered for this event or try to change the group name",
      });
    }

    // Construct registration data
    const regData = {
      userId,
      eventId,
      type,
      registrationDate: new Date(),
    };

    if (type === "group") {
      regData.groupName = groupName;
      regData.members = memberUserIds;
    }

    const reg = await Register.create(regData);
    // ✅ FIXED: Changed from 'loggers' to 'logger'
    logger.info(
      `${
        type.charAt(0).toUpperCase() + type.slice(1)
      } registration successful:`,
      reg
    );

    res.status(201).json({
      message: `${
        type.charAt(0).toUpperCase() + type.slice(1)
      } registration successful`,
      registration: reg,
    });
  } catch (error) {
    // ✅ FIXED: Changed from 'loggers' to 'logger'
    logger.error("Error in registration route:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/my-registrations", AuthMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    // Find all registrations for this user
    const registrations = await Register.find({
      $or: [{ userId: userId }, { members: userId }],
    }).select("eventId"); // Only select the eventId field

    // Map the results to a simple array of strings
    const eventIds = registrations.map((reg) => reg.eventId.toString());

    res.status(200).json(eventIds);
  } catch (error) {
    // ✅ FIXED: Changed from 'loggers' to 'logger'
    logger.error("Error fetching user registrations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.delete("/unregister/:eventId", AuthMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const { eventId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid Event ID format" });
    }

    // Find the registration to delete. This is complex because a user can be
    // the main registrant (userId) or a member. We'll delete if they are in either.
    const result = await Register.deleteOne({
      eventId: eventId,
      $or: [{ userId: userId }, { members: userId }],
    });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "Registration not found for this user and event." });
    }

    res
      .status(200)
      .json({ message: "Successfully unregistered from the event." });
  } catch (error) {
    // ✅ FIXED: Changed from 'loggers' to 'logger'
    logger.error("Error unregistering from event:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/addEvents", AuthMiddleware, async (req, res) => {
  try {
    const events = [
      {
        id: "66817b2f3a4b5c6d7e8f9a01",
        title: "Algorithmia",
        image: "/assets/events/algorithma.webp",
        eventType: "technical",
        playerMode: "single player",
        subCategory: "Problem Solving",
        description: "Detailed description for Algorithma...",
        location: "NIT Trichy, Main Auditorium",
        date: "2025-10-24",
      },
      {
        id: "66817b2f3a4b5c6d7e8f9a11",
        title: "Crypt of the Necrodancer",
        image: "/assets/events/crypt-necrodancer.webp",
        eventType: "non-tech",
        playerMode: "single player",
        subCategory: "gaming",
        description: "Detailed description for Crypt of the Necrodancer...",
        location: "Online / Off-site",
        date: "2025-10-24",
      },
      {
        id: "66817b2f3a4b5c6d7e8f9a05",
        title: "BackTrack",
        image: "/assets/events/reverse-engineering.webp",
        eventType: "technical",
        playerMode: "single player",
        subCategory: "Problem Solving",
        description: "Detailed description for Reverse engineering...",
        location: "NIT Trichy, Computer Lab 3",
        date: "2025-10-25",
      },
      {
        id: "66817b2f3a4b5c6d7e8f9a03",
        title: "Emoji charades",
        image: "/assets/events/emoji-charades.webp",
        eventType: "non-tech",
        playerMode: "team based",
        teamsize: "2",
        subCategory: "Fun",
        description: "Detailed description for Emoji charades...",
        location: "NIT Trichy, Common Room",
        date: "2025-10-25",
      },
      {
        id: "66817b2f3a4b5c6d7e8f9a10",
        title: "Treasure hunt",
        image: "/assets/events/treasure-hunt.webp",
        eventType: "non-tech",
        playerMode: "team based",
        teamsize: "3",
        subCategory: "Adventure",
        description: "Detailed description for Break the bug...",
        location: "NIT Trichy, Campus-wide",
        date: "2025-10-25",
      },
      {
        id: "66817b2f3a4b5c6d7e8f9a02",
        title: "TypEclipse",
        image: "/assets/events/type-racer.webp",
        eventType: "non-tech",
        playerMode: "single player",
        subCategory: "Fun",
        description: "Detailed description for Type racer...",
        location: "NIT Trichy, Computer Lab 1",
        date: "2025-10-25",
      },
      {
        id: "66817b2f3a4b5c6d7e8f9a09",
        title: "Stellar Quest",
        image: "/assets/events/cs-quiz.webp",
        eventType: "technical",
        playerMode: "team based",
        teamsize: "2",
        subCategory: "Computer Science",
        description: "Detailed description for CS Quiz...",
        location: "NIT Trichy, Seminar Hall",
        date: "2025-10-26",
      },
      {
        id: "66817b2f3a4b5c6d7e8f9a08",
        title: "Replicode",
        image: "/assets/events/replicode.webp",
        eventType: "technical",
        playerMode: "single player",
        subCategory: "Web Designing",
        description: "Detailed description for Replicode...",
        location: "NIT Trichy, Computer Lab 2",
        date: "2025-10-26",
      },
      {
        id: "66817b2f3a4b5c6d7e8f9a06",
        title: "Destinite",
        image: "/assets/events/destinite.webp",
        eventType: "non-tech",
        playerMode: "single player",
        subCategory: "Conquer",
        description: "Detailed description for Destinite...",
        location: "NIT Trichy, Admin Block",
        date: "2025-10-26",
        register: "no",
      },
    ];

    const eventsA = await Event.insertMany(events);
    // ✅ FIXED: Changed from 'loggers' to 'logger'
    logger.info("10 dummy events added:", eventsA);
    res.status(201).json({ message: "10 dummy events added", eventsA });
  } catch (error) {
    // ✅ FIXED: Changed from 'loggers' to 'logger'
    logger.error("Error in addEvents route:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
