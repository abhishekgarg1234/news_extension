(function(window) {
    var about = (function(document) {
        var aboutus_feed_id = config.aboutus_feed;
        var aboutus_instance = document.getElementById(aboutus_feed_id);

        var aboutus_input = config.aboutus_data;
        console.log(aboutus_input.data[0].url);
        $(aboutus_instance).addClass("aboutus_display");

        var render_aboutus = function() {
            console.log("about us render called");
            $(aboutus_instance).addClass("loading");
            functions.ajax_call_function(aboutus_input.data[0].url).then(function(data) {
                console.log(data);
                if (data != "err") {
                    $(aboutus_instance).removeClass("loading");
                }
                for (var key in data.data) {
                    var date = data.data[key].postDate;
                    var new_d = new Date(date.substr(0, 19));
                    var s = functions.make_div(data.data[key].postTitle, data.data[key].postContent, data.data[key].primaryImageUrl, data.data[key].guid, new_d);
                    $(aboutus_instance).append(s);
                }
                $("img").unveil();
                $(aboutus_instance).scroll(function() {
                    $("img").unveil();
                });
            })
        }

        return {
            render_aboutus: render_aboutus
        };

    })(window.document);

    window.about = about;
})(window);
