import { useLoaderData } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify'; 
import PostCard from '../../../components/PostCard'; 
import BottomNav from '../../../components/BottomNav';
import CommentsOverlay from '../../../components/CommentsOverlay';
import PostShareModal from '../../../components/PostShareModel';
import Header from '../../../components/Header';


const fetchNextPage = async (page) => {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    const response = await fetch(`${API_BASE_URL}/user/posts/feed?page=${page}`, {
        credentials: 'include' 
    });
    
    if (!response.ok) {
        throw new Error('Failed to load next page.');
    }
    return response.json(); // Returns { posts: [...], nextPage: 3, ... }
};


const FeedPage = () => {
    // 1. Initial data loader se nikalo
    const initialData = useLoaderData(); 
    
    // 2. Main Feed States (Pagination k liye)
    // Loader se sirf initial data set karo
    const [allPosts, setAllPosts] = useState(initialData.posts || []);
    const [page, setPage] = useState(initialData.nextPage || 2); // Next page number
    const [hasMore, setHasMore] = useState(!!initialData.nextPage); // Aur pages hain ya nahi
    const [loading, setLoading] = useState(false);
    const [mediaUrl, setMediaUrl] = useState('');  //For share overlay
    const [caption, setCaption] = useState('');    //For share overlay
    
    const { currentUser } = initialData; // Current User ko loader se nikal lo


    const [commentTargetPost, setCommentTargetPost] = useState(null); 
    const openCommentsModal = (postId) => setCommentTargetPost(postId);
    const closeCommentsModal = () => setCommentTargetPost(null);


    const [shareTargetPost, setShareTargetPost] = useState(null);
        const openShareModal = (postId, mediaUrl, caption) => {setShareTargetPost(postId)
        setMediaUrl(mediaUrl);
        setCaption(caption);
        }
    const closeShareModal = () => setShareTargetPost(null);


    // 3. Data fetching function (Scroll par call hoga)
    const loadMoreData = useCallback(async () => {
        if (loading || !hasMore) return; 
        
        setLoading(true);
        try {
            const newPageData = await fetchNextPage(page);
            
            // a. Naye posts ko existing array mein add karo
            setAllPosts(prevPosts => [...prevPosts, ...newPageData.posts]);
            
            // b. Next page number update karo
            setPage(prevPage => prevPage + 1);
            
            // c. HasMore check
            if (!newPageData.nextPage) {
                setHasMore(false);
            }
            
        } catch (error) {
            console.error("Error loading feed:", error);
            toast.error("Failed to load more posts.");
            setHasMore(false); // Error par loading rok do
        } finally {
            setLoading(false);
        }
    }, [page, hasMore, loading]);


    // Initial setup: Ensure initialData is correctly set on mount (optional but safer)
    useEffect(() => {
        setAllPosts(initialData.posts || []);
        setPage(initialData.nextPage || 2);
        setHasMore(!!initialData.nextPage);
    }, [initialData]);


    // Empty Feed Message (Ab allPosts state use hoga)
    if (!allPosts || allPosts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 poppins-regular">
                <Header />
                <h1 className="text-2xl font-bold text-gray-700 mb-4">No Posts to show!</h1>
                <p className="text-gray-500">Be the first to upload post to our platform 🥰</p>
                <BottomNav currentUser={currentUser} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20 poppins-regular">
            <Header />

            <main className="max-w-[80%] mx-auto pt-2 px-4">
                
                {/* 4. InfiniteScroll Wrapper */}
                <InfiniteScroll
                    dataLength={allPosts.length}
                    next={loadMoreData}
                    hasMore={hasMore}
                    loader={<h4 className="text-center p-4">{loading ? 'Loading more posts...' : 'Fetching...'}</h4>}
                    endMessage={<p className="text-center p-4 text-gray-500"><b>Yay! You have seen it all.</b></p>}
                    scrollThreshold={1.0} // Jab 100% scroll ho jaye tab fetch karo
                >
                    {/* Map lagakar PostCard component ko call karna */}
                    {allPosts.map((post, index) => (
                        <PostCard 
                            key={post._id} // MongoDB ID as key is best
                            post={post}
                            index={index}
                            currentUser={currentUser}
                            onCommentClick={openCommentsModal}
                            onShareClick={openShareModal}

                        />
                    ))}
                </InfiniteScroll>
            </main>

            {/* Comments Overlay */}
            <AnimatePresence>
                {commentTargetPost && (
                    <CommentsOverlay 
                        postId={commentTargetPost} 
                        onClose={closeCommentsModal} 
                    />
                )}
            </AnimatePresence>

            {/*Shares Overlay*/ }
            
                <AnimatePresence>
            {
                shareTargetPost && (
                    <PostShareModal
                        postId={shareTargetPost}
                        onClose={closeShareModal}
                        mediaUrl={mediaUrl}
                        caption={caption}
                        
                    />
)}
</AnimatePresence>
            
            <BottomNav currentUser={currentUser} />
        </div>
    );
};

export default FeedPage;