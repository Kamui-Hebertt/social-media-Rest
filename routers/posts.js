const router = require("express").Router();
const Post = require("../models/Posts");
const User = require("../models/User");


router.post("/", async (req, res)=>{
  const newPost = new Post(req.body);

  try{
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);

  }catch(err){
    res.status(500).json(err);
  }
})

// update
router.put("/:id", async(req, res)=>{

  try{
    const post = await Post.findById(req.params.id);
    if(post.userId === req.body.userId){
      await post.updateOne({$set:req.body});
      res.status(200).json("the post has been updated")
    } else{
      res.status(403).json("You can update only your post")
    }
  } catch(err){
    res.status(500).json(err);
  }
   
});

// delete

router.delete("/:id", async(req, res)=>{

  try{
    const post = await Post.findById(req.params.id);
    if(post.userId === req.body.userId){
      await post.deleteOne({_id:req.body});
      res.status(200).json("the post has been deleted")
    } else{
      res.status(403).json("You can delete only your post")
    }
  } catch(err){
    res.status(500).json(err);
  }
   
});

router.put("/:id/like", async (req, res)=>{
  try{
    const post = await Post.findById(req.params.id);
    if(!post.likes.includes(req.body.userId)){
      await post.updateOne({ $push : {likes: req.body.userId} });
      res.status(200).json("the post has been liked");
    }
    else{
      await post.updateOne({ $pull : {likes: req.body.userId} });
      res.status(200).json("the post has been disliked");
    }
  }

  catch(err){
    res.status(500).json(err);
  }
  }
);

router.get("/:id", async(req, res)=>{

  try{
    const foundPost = await Post.findById(req.params.id);
    res.status(200).json(foundPost);

  }catch(err){
    res.status(500).json(err);
  };
});



router.get("/", async(req, res)=>{

  try{
    const foundPost = await Post.find(req.params.id);
    res.status(200).json(foundPost);

  }catch(err){
    res.status(500).json(err);
  };
});



router.get("/timeline/all", async (req, res) => {
  try {
    const currentUser = await User.findById(req.body.userId); // Get current user's ID from query parameters
    console.log(currentUser);
    const userPosts = await Post.find({userId: currentUser._id}); // Find posts of the current user
    console.log(userPosts);
    const friendsPosts = await Promise.all(
      currentUser.following.map((friendId) => {
        return Post.find({ userId: friendId }); // Find posts of all friends
      })
    );
    
    res.json(userPosts.concat(...friendsPosts));
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});





module.exports = router