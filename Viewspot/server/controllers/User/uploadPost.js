const Post = require('../../models/postSchema');
const {User} = require('../../models/userSchema'); 
const Comment = require('../../models/comSchema');
const Conversation  = require('../../models/convoSchema');
const Message = require('../../models/msgSchema');
const Notification = require('../../models/notifSchema'); 



//Helper notification function to create and send notification
const sendNotification = async (recipientId, senderId, type, postId = null, io) => {
    try {
        if (recipientId.toString() === senderId.toString()) return; // Khud ko notification mat bhejo


        // 1. DB Entry
        const notification = await Notification.create({
            recipient: recipientId,
            sender: senderId,
            type,
            post: postId,
        });

        // 2. Populate for Frontend display
        await notification.populate('sender', 'displayName name');

        // 3. Real-Time Push (Using Socket.io)
        // Ensure 'io' object is accessible here (pass via req or global)
        if (io) {
            io.to(recipientId.toString()).emit('new_notification', notification);
        }
    } catch (err) {
        console.error("Notification Error:", err);
    }
};

exports.getNotifications = async (req, res) => {
    try {
        const userId = req.user.id; // Logged in user

        // Find notifications for this recipient
        const notifications = await Notification.find({ recipient: userId })
            .populate('sender', 'name displayName profilePic') // Sender ki details
            .populate('post', 'mediaUrl') // Agar post like/comment hui hai to uska thumbnail
            .sort({ createdAt: -1 }); // Latest pehle

        res.status(200).json(notifications);

    } catch (error) {
        console.error("Notif Error:", error);
        res.status(500).json({ msg: "Failed to fetch notifications" });
    }
};

exports.createPost = async(req, res) => {
    
        

    // 1. Multer Check (Jo pehle controller mein tha, ab seedha check karo)
    if (!req.file) {
      return res.status(400).json({ error: 'Media file is required.' });
    }

    try {
        const { caption, mediaType } = req.body;
        
        // Agar yahan mediaType null mila, to problem Frontend se hai.
        // Lekin ab ye null nahi milna chahiye.
        if (!mediaType) {
            return res.status(400).json({ error: 'mediaType is missing in request body.' });
        }

        // JWT ke baad, req.user set ho chuka hoga
        const userId = req.user.id; 

        // 2. Create new Post object
        const newPost = new Post({
            caption: caption,
            mediaUrl: '/uploads/' + req.file.filename,
            mediaType: mediaType, 
            owner: userId,
        });

        const savedPost = await newPost.save();

        // 3. Update User's posts array
        await User.findByIdAndUpdate(userId, { $push: { posts: savedPost._id } }, { new: true });

        res.status(201).json({ message: 'Post created successfully!', post: savedPost , id: req.user.id});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.toggleLike = async (req, res) => {
    const postId = req.params.postId;
    const userId = req.user.id; // Ye String hai
    const io = req.app.get('socketio'); // Socket.io instance

    try {
        const post = await Post.findById(postId);
        if (!post)
            return res.status(404).json({ error: 'Post not found.' });
        

        
        // Hum .some() use karenge aur ID ko string bana kr compare karenge
        const isLiked = post.likes.some(id => id.toString() === userId); 

        if (isLiked) {
            // --- UNLIKE SCENE ---
            await Post.findByIdAndUpdate(postId, { $pull: { likes: userId } });
            await User.findByIdAndUpdate(userId, { $pull: { likedReels: postId } });

            res.status(200).json({ message: 'Post unliked', isLiked: false });
        } else {
            // --- LIKE SCENE ---
            // FIX 2: $push ki jagah $addToSet use kar (Safety against duplicates)
            await Post.findByIdAndUpdate(postId, { $addToSet: { likes: userId } });
            await User.findByIdAndUpdate(userId, { $addToSet: { likedReels: postId } });
             
            // Send Notification to Post Owner
            await sendNotification(post.owner, userId, 'like', postId, io);

            res.status(200).json({ message: 'Post liked', isLiked: true });
        }

    } catch (error) {
        res.status(500).json({ error: 'Failed to toggle like status.' });
    }
};

exports.getFeed = async (req, res) => {
    
    const currentUser = req.user ? req.user.id : null;
    
    // 1. Pagination Parameters Nikalo
    const page = parseInt(req.query.page) || 1; // Default page 1
    const limit = 2; // Har page par 2 posts
    const skip = (page - 1) * limit; // Kitne posts skip karne hain

    try {
        // 2. Posts Query
        // Abhi simplicity ke liye saare posts paginate kar rahe hain.
        const posts = await Post.find()
            .populate('owner', 'name displayName profilePic')
            .sort({ createdAt: -1 })
            .skip(skip) // Puraane posts ko skip karo
            .limit(limit); // Sirf 2 posts laao

        // 3. Next Page Logic (Important for Infinite Scroll)
        // Check karo ke aur posts hain ya nahi
        const totalPosts = await Post.countDocuments();
        const hasNextPage = totalPosts > page * limit;
        
        // 4. Response mein pagination details bhejo
        res.status(200).json({
            posts, 
            currentUser,
            nextPage: hasNextPage ? page + 1 : undefined,
            totalResults: totalPosts,
        });
        
    } catch (error) {
        console.error("Feed Fetch Error:", error);
        res.status(500).json({ error: 'Failed to fetch paginated feed.' });
    }
};

exports.getProfile = async (req, res) => {
    const profileId = req.params.id; // Jiski profile kholni hai
    
    // Token se logged-in user ki ID (Agar middleware laga hai)
    const loggedInUserId = req.user ? req.user.id : null; 

    try {
        // 1. User dhoondo
        const user = await User.findById(profileId);
        if (!user) {
            return res.status(404).json({ error: 'User not found!' });
        }

        // 2. Uss user ki Posts dhoondo 
        const posts = await Post.find({ owner: profileId }).sort({ createdAt: -1 });

        // 3. Check karo: Kya ye banda apni hi profile dekh raha hai?
        // "req.user.id" (Login) vs "profileId" (URL)
        const isOwnProfile = loggedInUserId === profileId;

        // 4. Data Return karo
        res.status(200).json({ 
            user: user,
            posts: posts,
            isOwnProfile: isOwnProfile,// <--- Ye flag frontend use karega
            loggedInUserId: loggedInUserId 
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.deleteProfilePic = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user.id, { profilePic: "" });
        res.status(200).json({ message: "DP Removed" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.updateProfile = async (req, res) => {
    const { bio } = req.body; 
    const file = req.file; // Ye undefined ho sakta hai agar user ne photo change nahi ki

    try {
        // 1. Update Object banao
        // Jo cheez user ne bheji hai, sirf wohi update hogi
        let updateData = {
            bio: bio // Bio hamesha update hoga (agar empty hai to empty ho jayega)
        };

        // 2. Agar FILE aayi hai, tabhi Profile Pic update karo
        if (file) {
            updateData.profilePic = '/uploads/' + file.filename;
        }

        // 3. Database Update
        // { new: true } ka matlab hai updated user data wapis milega
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id, 
            updateData, 
            { new: true } 
        );

        if (!updatedUser) {
            return res.status(404).json({ msg: "User not found" });
        }

        res.status(200).json({ msg: "Profile updated successfully!", user: updatedUser });

    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.toggleFollow = async (req, res) => {
    const targetUserId = req.params.id; // User being followed/unfollowed (The ID from URL)
    const currentUserId = req.user.id;   // The logged-in user (Our own ID from JWT)
    const io = req.app.get('socketio'); 

    try {
        // 1. Basic Validation (ID is present and check self-follow)
        if (!targetUserId) {
            return res.status(400).json({ msg: 'Target user ID not present in the request!' });
        }

        if (targetUserId === currentUserId) {
            return res.status(400).json({ msg: 'You cannot follow yourself!' });
        }

        // 2. Fetch the target user to check current status
        const targetUser = await User.findById(targetUserId);
        if (!targetUser) {
            return res.status(404).json({ msg: 'Target user not found.' });
        }

        // 3. Check the following status (Crucial: String vs ObjectId comparison)
        const isFollowing = targetUser.followers.some(id => id.toString() === currentUserId);

        if (isFollowing) {
            // --- UNFOLLOW SCENE (Target User has current user's ID) ---
            
            // a. Remove current user from target's followers
            await User.findByIdAndUpdate(targetUserId, { $pull: { followers: currentUserId } });

            // b. Remove target user from current user's following
            await User.findByIdAndUpdate(currentUserId, { $pull: { following: targetUserId } });

            res.status(200).json({ msg: 'User unfollowed successfully.', isFollowing: false });
        } else {
            // --- FOLLOW SCENE (Target User does NOT have current user's ID) ---
            // Safety: Use $addToSet to prevent duplicates
            
            // a. Add current user to target's followers
            await User.findByIdAndUpdate(targetUserId, { $addToSet: { followers: currentUserId } });

            // b. Add target user to current user's following
            await User.findByIdAndUpdate(currentUserId, { $addToSet: { following: targetUserId } });

            await sendNotification(targetUserId, currentUserId, 'follow', null, io);

            res.status(200).json({ msg: 'User followed successfully!', isFollowing: true });
        }

    } catch (error) {
        res.status(500).json({ msg: error.message || 'Failed to toggle follow status.' });
    }
};

exports.getLikedReels = async (req, res) => {

    const userId = req.params.id; 
    const loggedInUserId = req.user.id;

    if (!userId) {
        return res.status(400).json({ msg: 'User ID not present in your request!' });
    }

    try {
        const user = await User.findById(userId).select('likedReels');

        if (!user || user.likedReels.length === 0) {
            return res.status(200).json({ likedReels: [] }); 
        }
        
        const likedReels = await Post.find({
            _id: { $in: user.likedReels }
        })
        .populate('owner', 'username profilePic') // Ye frontend k liye owner ki details load karega
        .sort({ createdAt: -1 });

        return res.status(200).json({ likedReels: likedReels, loggedInUserId: loggedInUserId  });

    } catch (err) {
        console.error("Error fetching liked reels:", err);
        return res.status(500).json({ msg: 'Failed to load liked reels.' });
    }
};


exports.getComments = async(req,res) => {

    const postId =  req.params.postId;

    if(!postId)
        return res.status(400).json({msg: 'Id not present in your request!'})

    try{
        const data = await Comment.find({post: postId}).populate('user', 'name displayName profilePic')
        const comments = Array.from(data)

        res.status(200).json({comments: comments})
    }catch(err)
      {
        res.status(500).json({msg: 'Failed to load comments!'})
      }
}

exports.addComment = async (req, res) => {

    const io = req.app.get('socketio'); 

    const postId = req.params.postId;
    const commentText = req.body.commentText

    if(!postId)
        return res.status(400).json({msg: 'Id not present in your request!'})

    try{
        const newComment =  new Comment({
            text: commentText,
            user: req.user.id,
            post: postId
        })

        const postOwner = await Post.findById(postId).select('owner');
        if (!postOwner) {
            return res.status(404).json({ msg: 'Post Owner not found.' });
        }

        const result = await newComment.save()

        await sendNotification(postOwner.owner, req.user.id, 'comment', postId, io);

        res.status(201).json({msg:'Comment created successfully!', newComment: result})

    }
    catch(err)
    {
        res.status(500).json({msg: 'Failed to add comment . Server side Error!'})
    }
}

exports.getConversations = async (req, res) => {
    const currentUserId = req.user.id; 

    try {
        
        const conversations = await Conversation.find({
            members: currentUserId 
        })
        
        
        .populate('members', ' profilePic name displayName') 
        
        // 4. Sort: Jo conversation sabse aakhir mein update hui, wo sabse upar aayegi
        .sort({ updatedAt: -1 }); 

        res.status(200).json({ 
            conversations: conversations,
            currentUserId: currentUserId
        });

    } catch (error) {
        res.status(500).json({ msg: 'Failed to load messages.' });
    }
};

exports.getMessageHistory = async (req, res) => {
    // 1. IDs lo
    const receiverId = req.params.receiverId; 
    const currentUserId = req.user.id; // Logged-in user ki ID from token

    try {
        // 2. Conversation dhoondo ya naya banao
        // $all operator se dekho k members array mein dono IDs maujood hain
        let conversation = await Conversation.findOne({
            members: { $all: [currentUserId, receiverId] }
        })
        .populate('members', 'name displayName profilePic'); // Members ko populate karo

        // Agar conversation nahi mili toh naya banao (First message scenario)
        if (!conversation) {
            // Naya Conversation bana dete hain
            conversation = await Conversation.create({
                members: [currentUserId, receiverId]
            });
            // Populate dobara karna parega taake frontend ko member details mil jayein
            conversation = await conversation.populate('members', 'name displayName profilePic');
        }

        // 3. Uss conversation ki messages fetch karo
        // Note: Agar tum message schema mein conversationId field rakhte toh ye step zyada clean hota.
        // Filhal hum sender/receiver pair se query karenge:
        const messages = await Message.find({
            $or: [ // Either sent by current to receiver OR sent by receiver to current
                { sender: currentUserId, receiver: receiverId },
                { sender: receiverId, receiver: currentUserId }
            ]
        })
        .sort({ createdAt: 1 }) // Purane messages pehle
        .lean(); // Faster query result

        // 4. Response
        res.status(200).json({
            messages: messages,
            conversation: conversation,
            currentUserId: currentUserId
        });

    } catch (error) {
        console.error('Error fetching chat history:', error);
        res.status(500).json({ msg: 'Failed to load chat history.' });
    }
};

exports.sendMessage = async (req, res) => {
    
    const { receiverId, text, conversationId } = req.body;
    const senderId = req.user.id

    try {
        // 1. Create Message
        let newMessage = await Message.create({
            sender: senderId,
            receiver: receiverId,
            text: text,
            mediaUrl: req.file ? '/uploads/' + req.file.filename : null,
            conversationId: conversationId || null});

        // 2. Update Conversation (Last message & time)
        let conversation;
        if (conversationId) {
            conversation = await Conversation.findByIdAndUpdate(conversationId, {
                lastMessage: text,
            }, { new: true });
        }

        // 3. Populate Sender (Zaroori hai frontend k liye)
        newMessage = await newMessage.populate("sender", " name displayName profilePic");
        newMessage = await newMessage.populate("receiver", " name displayName profilePic");
        
        // Hack: Add conversationId explicitly to the response object for Socket room logic
        const responseData = {
            ...newMessage._doc,
            conversationId: conversationId // Frontend socket isko use karega room target karne k liye
        };

        res.status(200).json(responseData);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.sharePost = async (req, res) => {
    
    // Data jo frontend se FormData mein aayi hai (PostShareModal.jsx se)
    const { receiverId, postId, text } = req.body; 
    const senderId = req.user.id;

    try {
        // Step 1: Post ki details fetch karo (mediaUrl aur caption ke liye)
        const sharedPostDetail = await Post.findById(postId)
            .select('mediaUrl caption owner')
            .lean(); // Faster lookup
            
        if (!sharedPostDetail) {
            return res.status(404).json({ error: 'Shared post not found.' });
        }

        // Default text agar Frontend se empty aaya ho (though Frontend is sending it)
        const messageText = text || `Shared a post: ${sharedPostDetail.caption.substring(0, 30)}...`;
        
        // Step 2: Conversation ID dhoondo (agar existing hai) ya create karo
        let conversation = await Conversation.findOneAndUpdate(
            { members: { $all: [senderId, receiverId] } },
            { $set: { lastMessage: '🔗 Post Shared' } },
            { upsert: true, new: true } // Agar nahi mila to naya banao
        );

        // Step 3: Message Create karo (mediaUrl, postId aur conversationId ke saath)
        let newMessage = await Message.create({
            sender: senderId,
            receiver: receiverId,
            conversationId: conversation._id,
            text: messageText, 
            mediaUrl: sharedPostDetail.mediaUrl, // 🚨 Post se mediaUrl use ki 🚨
            sharedPost: postId,                 // 🚨 Post ID save ki 🚨
        });

        // Step 4: Populate fields (Sender, Receiver, aur Shared Post)
        newMessage = await newMessage.populate("sender", "name displayName profilePic");
        newMessage = await newMessage.populate("receiver", "name displayName profilePic");
        
        // Nested Populate for Shared Post Details
        newMessage = await newMessage.populate({
            path: 'sharedPost',
            select: 'mediaUrl caption owner',
            populate: {
                path: 'owner',
                select: 'name displayName profilePic'
            }
        }); 
        
        // Step 5: Response bhej do
        const responseData = {
            ...newMessage._doc,
            conversationId: conversation._id.toString() 
        };
        
        res.status(200).json(responseData);

    } catch (error) {
        console.error("Share Post Error:", error);
        res.status(500).json({ error: 'Failed to share post: ' + error.message });
    }
};

exports.getShareUsers = async (req, res) => {
    const currentUserId = req.user.id;
    
    try {
        // Sirf woh fields select karo jo sharing k liye zaroori hain
        const user = await User.findById(currentUserId)
            .select('followers following')
            .populate('followers', 'name displayName profilePic')
            .populate('following', 'name displayName profilePic')
            .lean(); // Faster results

        if (!user) {
            return res.status(404).json({ msg: 'User not found.' });
        }
        
        // Dono arrays ko merge karo aur duplicates hatao
        const allContacts = [
            ...(user.followers || []),
            ...(user.following || [])
        ];
        
        // Duplicate IDs ko filter karne k liye Set use karo
        const uniqueContacts = Array.from(new Set(allContacts.map(c => c._id.toString())))
            .map(id => allContacts.find(c => c._id.toString() === id));


        res.status(200).json({ contacts: uniqueContacts });

    } catch (error) {
        console.error("Share Users Fetch Error:", error);
        res.status(500).json({ msg: 'Failed to fetch share contacts.' });
    }
};

