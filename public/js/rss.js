var feed;
$(document).ready(function () {
    $("form").submit(function () {

        var data = new Object();
        data.url = $('#url').val();
        $.ajax({
            url: 'getFeeds',
            data: data
        })
            .done(function (data) {
                if (data == "error") {
                    alert("Invalid url");
                }
                else {
                    $("h2").html(data.title);
                    $("h3").html(data.description);
                    $("#feeds").html("");
                    $.each(data.items, function (k, v) {
                        $("#feeds").append('<br><br><a href="' + v.url + '" target="_blank" >' + v.title);
                    });
                    feed = data;
                    $("button").show();
                }
            })
            .fail(function () {
                console.log("error");
            })
    });

    $("button").click(function () {
        $.ajax({
            url: 'saveFeeds',
            data: JSON.stringify(feed.items),
            type: 'POST',
            contentType: 'application/json; charset=UTF-8'
        })
            .done(function (res) {
                console.log(res);
                if (res == "success")
                    alert("Saved");
                else
                    alert("Save failed");

            })
            .fail(function () {
                console.log("error");
            })
    })
});
