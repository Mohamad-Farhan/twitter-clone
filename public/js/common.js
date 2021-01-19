$("#postTextarea").keyup(event => {
    const textbox = $(event.target);
    const vlaue = textbox.val().trim();
    const submitButton = $("#submitPostButton");

    if (submitButton.length == 0) return alert("No sumbit")
    if (vlaue == "") {
        submitButton.prop("disabled", true);
        return;
    }

    submitButton.prop("disabled", false)
});

$("#submitPostButton").click((event) => {
    const button = $(event.target);
    const textbox = $("#postTextarea");

    const data = {
        content: textbox.val(),
    }

    $.post("/api/posts", data, (postData, status, xhr) => {
        alert(postData)
    })
});