const router = require('express').Router();
const mongoose = require('mongoose');
const Posts = require('./PostModel');

// get all post
router.get('/', async (req, res) => {
    try {
        const posts = await Posts.find({})
        return res.json(posts)
    } catch (error) {
        return res.status(500).json({ message: 'Sorry, internal server error!' })
    }
});

// get post
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (mongoose.Types.ObjectId.isValid(id)) {
            const post = await Posts.findById(id)
            return res.json(post)
        } else {
            return res.status(404).json({ message: 'Your post id not found!' })
        }
    } catch (error) {
        return res.status(500).json({ message: 'Sorry, internal server error!' })
    }
});

// create post
router.post('/create', async (req, res) => {
    try {
        const { title, body } = req.body;
        if (!title || !body) {
            return res.json({ message: 'Title or Body required!' })
        }

        const post = new Posts(req.body);
        await post.save();
        return res.json(post);
    } catch (error) {
        return res.status(500).json({ message: 'Sorry, internal server error!' });
    }
});

// update post
router.patch('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, body } = req.body;
        if (mongoose.Types.ObjectId.isValid(id)) {
            let updatePost = await Posts.findOneAndUpdate(
                { _id: id },
                { $set: { title, body } },
                { new: true } // for get new data
            );
            return res.json(updatePost);
        } else {
            return res.status(404).json({ message: 'Your post id not found!' })
        }
    } catch (error) {
        return res.status(500).json({ message: 'Sorry, internal server error!' });
    }
});

// delete post
router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (mongoose.Types.ObjectId.isValid(id)) {
            await Posts.deleteOne({ _id: id })
            return res.json({ message: 'Your post has been deleted!', deleted: true })
        } else {
            return res.status(404).json({ message: 'Your post id not found!' })
        }
    } catch (error) {
        return res.status(500).json({ message: 'Sorry, internal server error!' })
    }
});


module.exports = router;