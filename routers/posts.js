const router = require("express").Router();
const Post = require("../models/Posts");


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
)




module.exports = router