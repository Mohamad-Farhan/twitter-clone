$("#postTextarea").keyup(event => {
    const textbox = $(event.target);
    const vlaue = textbox.val().trim();
    const submitButton = $("#submitPostButton");

    if (submitButton.length == 0) return alert("No sumbit")
    if(vlaue == ""){
        submitButton.prop("disabled", true);
        return;
    }

    submitButton.prop("disabled", false)
})