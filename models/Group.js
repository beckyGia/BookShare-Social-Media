const mongoose = require("mongoose");
const { ObjectId } = require("mongoose").Types; // Import ObjectId from mongoose
const cloudinary = require("../middleware/cloudinary");

const GroupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    groupCoverPhoto: {
      type: String,
      required: true,
    },
    cloudinary: {
      type: String,
      required: true,
    },
    // description: { type: String },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    defaultGroupsCreated: { type: Boolean, default: false },
  },
  {
    timestamps: true, //both createdAt and updatedAt
  }
);

const Group = mongoose.model("Groups", GroupSchema);

// Check if default groups are created
const checkDefaultGroupsCreated = async () => {
  const count = await Group.countDocuments();
  return count > 0;
};

// Create default groups
const createDefaultGroups = async () => {
  try {
    // Check if default groups are already created
    const defaultGroupsCreated = await checkDefaultGroupsCreated();

    if (!defaultGroupsCreated) {
      const defaultGroups = [
        {
          name: "Romance Book Lovers",
          creator: new ObjectId("654bcdb57c301386a04848ab"),
          imageURL:
            "https://hips.hearstapps.com/hmg-prod/images/books-1674156155.jpg",
        },
        {
          name: "Best Thrillers Books",
          creator: new ObjectId("654bcdb57c301386a04848ab"),
          imageURL:
            "https://media.theeverymom.com/wp-content/uploads/2021/08/05155927/best-thriller-books-the-everymom-f-h-1.jpg",
        },
        {
          name: "Sci-Fi Book Lovers",
          creator: new ObjectId("654bcdb57c301386a04848ab"),
          imageURL:
            "https://img.readthistwice.com/unsafe/lists/best-psychological-thriller-books-6a612f6fba.png",
        },
      ];

      for (const groupData of defaultGroups) {
        const result = await cloudinary.uploader.upload(groupData.imageURL, {
          folder: "bookShareApp",
        });

        const group = new Group({
          ...groupData,
          groupCoverPhoto: result.secure_url,
          cloudinary: result.public_id,
          defaultGroupsCreated: true, // Set the flag
        });

        await group.save();
      }

      console.log("Default groups created successfully");
    } else {
      console.log("Default groups are already created");
    }
  } catch (error) {
    console.error("Error creating default groups:", error);
    throw error;
  }
};

module.exports = { Group, checkDefaultGroupsCreated, createDefaultGroups };
