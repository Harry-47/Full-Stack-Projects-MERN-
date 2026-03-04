const express = require('express');
const router = express.Router();

const { checkToken } = require('../../controllers/authController');
const { createPost, toggleLike, getFeed, getProfile, deleteProfilePic, updateProfile, toggleFollow , getLikedReels, addComment, getComments, getConversations, getMessageHistory, sendMessage, getNotifications, getShareUsers, sharePost
} = require('../../controllers/User/uploadPost');
const upload = require('../../Utils/multerConfig');

router.post('/createPost', upload.single('media'), checkToken, createPost);
router.get('/:postId/like', checkToken, toggleLike);
router.get('/posts/feed', checkToken, getFeed);
router.get('/profile/:id', checkToken, getProfile);
router.delete('/removeDP', checkToken, deleteProfilePic);
router.put('/updateProfile', upload.single('media'), checkToken, updateProfile)
router.post('/:id/follow', checkToken, toggleFollow)
router.get('/:id/liked', checkToken, getLikedReels)
router.get('/comments/:postId', checkToken, getComments)
router.post('/comments/:postId', checkToken, addComment)
router.get('/conversations', checkToken, getConversations);
router.get('/messages/history/:receiverId', checkToken, getMessageHistory);
router.post('/messages/send',upload.single('mediaFile'), checkToken, sendMessage);
router.post('/messages/sharePost', checkToken, sharePost);
router.get('/notifications', checkToken, getNotifications);
router.get('/share/contacts', checkToken, getShareUsers);

module.exports = router;