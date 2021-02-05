$("#postTextarea").keyup(event => {
    let textbox = $(event.target);
    let value = textbox.val().trim();

    let submitButton = $("#submitPostButton");

    if (submitButton.length == 0) return alert("No submit button found");

    if (value == "") {
        submitButton.prop("disabled", true);
        return;
    }

    submitButton.prop("disabled", false);
});

$("#replyTextarea").keyup(event => {
    let textbox = $(event.target);
    let value = textbox.val().trim();

    let submitButton = $("#submitReplyButton");

    if (submitButton.length == 0) return alert("No submit button found");

    if (value == "") {
        submitButton.prop("disabled", true);
        return;
    }

    submitButton.prop("disabled", false);
});

$("#submitPostButton, #submitReplyButton").click((event) => {
    const button = $(event.target);

    const isModal = button.parents('.modal').length == 1;
    const textbox = isModal ? $("#replyTextarea") : $("#postTextarea");

    const data = {
        content: textbox.val()
    }

    if (isModal) {
        const id = button.data().id;
        if (id == null) return alert('button id is null');
        data.replyTo = id;
    }

    $.post("/api/posts", data, postData => {

        if (postData.replyTo) {
            location.reload();
        } else {
            const html = createPostHtml(postData);
            $(".postsContainer").prepend(html);
            textbox.val("");
            button.prop("disabled", true);
        }
    });
});

$("#replyModel").on("show.bs.modal", (event) => {
    const button = $(event.relatedTarget);
    let postId = getPostIdFromElement(button);
    $("#submitReplyButton").data("id", postId);

    $.get(`/api/posts/${postId}`, results => {
        outputPosts(results.postData, $('#originalPostContainer'));
    })
});

$("#replyModel").on("hidden.bs.modal", () => $('#originalPostContainer').html(""));

$("#deletePostModal").on("show.bs.modal", (event) => {
    const button = $(event.relatedTarget);
    let postId = getPostIdFromElement(button);
    $("#deletePostButton").data("id", postId);
    console.log($("#deletePostButton").data().id)

    // $.get(`/api/posts/${postId}`, results => {
    //     outputPosts(results.postData, $('#originalPostContainer'));
    // })
});

$(document).on("click", ".likeButton", (event) => {
    const button = $(event.target);
    let postId = getPostIdFromElement(button);

    if (postId === undefined) return;

    $.ajax({
        url: `/api/posts/${postId}/like`,
        type: "PUT",
        success: (postData) => {

            button.find("span").text(postData.likes.length || "");

            if (postData.likes.includes(userLoggedIn._id)) {
                button.addClass("active");
            }
            else {
                button.removeClass("active");
            }

        }
    })

})

$(document).on("click", ".retweetButton", (event) => {
    const button = $(event.target);
    let postId = getPostIdFromElement(button);

    if (postId === undefined) return;

    $.ajax({
        url: `/api/posts/${postId}/retweet`,
        type: "POST",
        success: (postData) => {
            button.find("span").text(postData.retweetUsers.length || "");

            if (postData.retweetUsers.includes(userLoggedIn._id)) {
                button.addClass("active");
            }
            else {
                button.removeClass("active");
            }

        }
    })

})

$(document).on("click", ".post", (event) => {
    const element = $(event.target);
    let postId = getPostIdFromElement(element);

    if (postId !== undefined && !element.is("button")) {
        window.location.href = '/post/' + postId;
    }
});

const getPostIdFromElement = (element) => {
    const isRoot = element.hasClass("post");
    const rootElement = isRoot == true ? element : element.closest(".post");
    let postId = rootElement.data().id;

    if (postId === undefined) return alert("Post id undefined");

    return postId;
}

const createPostHtml = (postData, largeFont = false) => {

    if (postData == null) return alert("post object is null");

    const isRetweet = postData.retweetData !== undefined;
    const retweetedBy = isRetweet ? postData.postedBy.username : null;
    postData = isRetweet ? postData.retweetData : postData;

    const postedBy = postData.postedBy;

    if (postedBy._id === undefined) {
        return console.log("User object not populated");
    }

    const displayName = postedBy.firstName + " " + postedBy.lastName;
    const timestamp = timeDifference(new Date(), new Date(postData.createdAt));

    const likeButtonActiveClass = postData.likes.includes(userLoggedIn._id) ? "active" : "";
    const retweetButtonActiveClass = postData.retweetUsers.includes(userLoggedIn._id) ? "active" : "";
    const largeFontClass = largeFont ? 'largeFont' : '';

    let retweetText = '';
    if (isRetweet) {
        retweetText = `<span>
                        <i class='fas fa-retweet'></i>
                        Retweeted by <a href='/profile/${retweetedBy}'>@${retweetedBy}</a>    
                    </span>`
    }

    let replyFlag = '';
    if (postData.replyTo && postData.replyTo._id) {
        if (!postData.replyTo._id) {
            return alert("Reply to is not populated");
        } else if (!postData.replyTo.postedBy._id) {
            return alert("Posted by is not populated");
        }

        const replyToUsername = postData.replyTo.postedBy.username;
        replyFlag = `<div class='replyFlag'>
                        Replying to <a href='/profile/${replyToUsername}'>@${replyToUsername}</a>            
                     </div>`

    }

    let buttons = "";
    if (postData.postedBy._id == userLoggedIn._id) {
        buttons = `<button data-id="${postData._id}" data-toggle="modal" data-target="#deletePostModal"><i class='fas fa-times'></i></button>`;
    }

    return `<div class='post ${largeFontClass}' data-id='${postData._id}'>
                <div class='postActionContainer'>
                    ${retweetText}
                </div>
                <div class='mainContentContainer'>
                    <div class='userImageContainer'>
                        <img src='${postedBy.profilePic}'>
                    </div>
                    <div class='postContentContainer'>
                        <div class='header'>
                            <a href='/profile/${postedBy.username}' class='displayName'>${displayName}</a>
                            <span class='username'>@${postedBy.username}</span>
                            <span class='date'>${timestamp}</span>
                            ${buttons}
                        </div>
                        ${replyFlag}
                        <div class='postBody'>
                            <span>${postData.content}</span>
                        </div>
                        <div class='postFooter'>
                            <div class='postButtonContainer'>
                                <button data-toggle='modal' data-target='#replyModel'>
                                    <i class='far fa-comment'></i>
                                </button>
                            </div>
                            <div class='postButtonContainer green'>
                                <button class='retweetButton ${retweetButtonActiveClass}'>
                                    <i class='fas fa-retweet'></i>
                                    <span>${postData.retweetUsers.length || ""}</span>
                                </button>
                            </div>
                            <div class='postButtonContainer red'>
                                <button class='likeButton ${likeButtonActiveClass}'>
                                    <i class='far fa-heart'></i>
                                    <span>${postData.likes.length || ""}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
}

const timeDifference = (current, previous) => {

    const msPerMinute = 60 * 1000;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;
    const msPerMonth = msPerDay * 30;
    const msPerYear = msPerDay * 365;

    const elapsed = current - previous;

    if (elapsed < msPerMinute) {
        if (elapsed / 1000 < 30) return "Just now";

        return Math.round(elapsed / 1000) + ' seconds ago';
    }

    else if (elapsed < msPerHour) {
        return Math.round(elapsed / msPerMinute) + ' minutes ago';
    }

    else if (elapsed < msPerDay) {
        return Math.round(elapsed / msPerHour) + ' hours ago';
    }

    else if (elapsed < msPerMonth) {
        return Math.round(elapsed / msPerDay) + ' days ago';
    }

    else if (elapsed < msPerYear) {
        return Math.round(elapsed / msPerMonth) + ' months ago';
    }

    else {
        return Math.round(elapsed / msPerYear) + ' years ago';
    }
}

const outputPosts = (results, container) => {
    container.html("");

    if (!Array.isArray(results)) {
        results = [results];
    }

    results.forEach(result => {
        const html = createPostHtml(result)
        container.append(html);
    });

    if (results.length == 0) {
        container.append("<span class='noResults'>Nothing to show.</span>")
    }
}

const outputPostsWithReplies = (results, container) => {
    container.html("");

    if (results.replyTo !== undefined && results.replyTo._id !== undefined) {
        let html = createPostHtml(results.replyTo)
        container.append(html);
    }

    let mainPostHtml = createPostHtml(results.postData, true)
    container.append(mainPostHtml);

    results.replyies.forEach(result => {
        let html = createPostHtml(result)
        container.append(html);
    });
}