$(document).ready(() => {
    loadPosts();
});

const loadPosts = () => {
    $.get("/api/posts/", { postedBy: profileUserId, isReply: false }, results => {
        outputPosts(results, $(".postsContainer"));
    });
}