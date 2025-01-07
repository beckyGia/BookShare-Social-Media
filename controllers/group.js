const passport = require("passport");
const validator = require("validator");
const User = require("../models/User");
const Profile = require("../models/Profile");
const { Group } = require("../models/Group");
const cloudinary = require("../middleware/cloudinary");

/**
 * Post /group/createGroup
 */
exports.createGroup = async (req, res) => {
  try {
    console.log("req.file", req.file);
    console.log("req.body", req.body);

    let result;

    if (req.body.groupImageUrls !== "") {
      // Upload image to cloudinary
      result = await cloudinary.uploader.upload(req.body.groupImageUrls, {
        folder: "bookShareApp",
      });
    } else {
      // Upload image to cloudinary
      result = await cloudinary.uploader.upload(req.file.path, {
        folder: "bookShareApp",
      });
    }

    // Create the group
    let group = await Group.create({
      groupCoverPhoto: result.secure_url,
      cloudinary: result.public_id,
      name: req.body.name,
      creator: req.user.id,
    });

    // Add the creator to the group's members
    group.members.push(req.user.id);

    // Save the group to update the members array
    await group.save();

    console.log("Group has been successfully created");
    res.redirect("/dashboard/groups");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

/**
 * Put /group/joinGroup
 */
exports.joinGroup = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const userId = req.user.id;

    // Check if the user is already a member of the group
    const group = await Group.findOne({ _id: groupId, members: userId });
    if (group) {
      // User is already a member
      req.flash("error", "You are already a member of this group.");
      return res.redirect("/dashboard/groups");
    }

    // Add the user to the group members
    await Group.findByIdAndUpdate(groupId, { $push: { members: userId } });
    console.log("User has been added from the group successfully");

    res.redirect("/dashboard/groups");
  } catch (err) {
    console.log(err);
  }
};

/**
 * Put /group/joinGroupDashboard
 */
exports.joinGroupDashboard = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const userId = req.user.id;

    // Check if the user is already a member of the group
    const group = await Group.findOne({ _id: groupId, members: userId });
    if (group) {
      // User is already a member
      req.flash("error", "You are already a member of this group.");
      return res.redirect("/dashboard");
    }

    // Add the user to the group members
    await Group.findByIdAndUpdate(groupId, { $push: { members: userId } });
    console.log("User has been added from the group successfully");

    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
  }
};

/**
 * Put /group/removeGroup
 */
exports.removeGroup = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const userId = req.user.id;

    // Find the group by ID
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Remove the user from the group's members
    group.members.pull(userId);

    // Save the updated group
    await group.save();
    console.log("User removed from the group successfully");

    res.redirect("/dashboard/groups");
  } catch (err) {
    console.log(err);
  }
};

/**
 * Put /group/removeGroupDashboard
 */
exports.removeGroupDashboard = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const userId = req.user.id;

    // Find the group by ID
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Remove the user from the group's members
    group.members.pull(userId);

    // Save the updated group
    await group.save();
    console.log("User removed from the group successfully");

    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
  }
};

/**
 * Put /group/editGroup
 */
exports.editGroup = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const userId = req.user.id;
    console.log("req.body", req.body);
    console.log("req.files", req.files);
    console.log("req.file", req.file);

    // Find the group by ID
    let group = await Group.findById(groupId);

    let result;

    if (req.body.editGroupImageUrls !== "") {
      // Upload image to cloudinary
      result = await cloudinary.uploader.upload(req.body.editGroupImageUrls, {
        folder: "bookShareApp",
      });

      // Delete image from cloudinary
      await cloudinary.uploader.destroy(group.cloudinary);
    } else {
      // Upload image to cloudinary
      result = await cloudinary.uploader.upload(req.file.path, {
        folder: "bookShareApp",
      });

      // Delete image from cloudinary
      await cloudinary.uploader.destroy(group.cloudinary);
    }

    group.groupCoverPhoto = result.secure_url;
    group.cloudinary = result.public_id;
    group.name = req.body.name;

    // Save the updated group
    await group.save();
    console.log("Group has been successfully updated!");

    res.redirect("/dashboard/groups");
  } catch (err) {
    console.log(err);
  }
};

/**
 * Put /group/deleteGroup
 */
exports.deleteGroup = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const userId = req.user.id;

    // Find the group by ID
    let group = await Group.findById(groupId);

    // Delete image from cloudinary
    await cloudinary.uploader.destroy(group.cloudinary);

    //Delete Group from the database
    await Group.deleteOne({ _id: req.params.groupId });

    console.log("Group Has Successfully Been Deleted");
    res.redirect("/dashboard/groups");
  } catch (err) {
    console.log(err);
  }
};
