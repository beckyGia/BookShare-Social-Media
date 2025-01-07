const Repost = require("./models/repost");

// // Route to create a repost
// app.post("/reposts", async (req, res) => {
//   const { postId } = req.body;
//   const userId = req.user.id; // Assuming user is authenticated

//   try {
//     const repost = new Repost({
//       user: userId,
//       originalPost: postId,
//     });

//     await repost.save();
//     res.status(201).json(repost);
//   } catch (error) {
//     res.status(500).json({ error: "Unable to create repost" });
//   }
// });

// // Route to get user's reposted posts
// app.get("/reposts", async (req, res) => {
//   const userId = req.user.id; // Assuming user is authenticated

//   try {
//     const reposts = await Repost.find({ user: userId }).populate(
//       "originalPost"
//     );
//     res.status(200).json(reposts);
//   } catch (error) {
//     res.status(500).json({ error: "Unable to fetch reposts" });
//   }
// });
