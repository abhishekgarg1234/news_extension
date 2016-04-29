(function(window) {
    var twitterjs = (function(document) {
        var render_tweets = function() {
            var twitter_feed_instance = document.getElementById(config.twitter_feed);
            $("#twitter-wjs").remove();
            console.log("enter twitter js render");

            // $("#feed").html("");
            var anchor = document.createElement("a");
            anchor.setAttribute("class", "twitter-timeline");
            anchor.setAttribute("href", "https://twitter.com/search?q=realestate%2520OR%2520estate%2520OR%2520%2523proptiger%2520%2523realestate");
            anchor.setAttribute("data-widget-id", "715842495947608064");
            anchor.setAttribute("width", "376px");
            anchor.setAttribute("height", "515px");
            anchor.setAttribute("data-chrome", "noheader nofooter");
            anchor.setAttribute("data-src-2x", "false");

            $(twitter_feed_instance).append(anchor);
            $(twitter_feed_instance).addClass("twitter_display");

            ! function(d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                p = /^http:/.test(d.location) ? 'http' : 'https';
                if (!d.getElementById(id)) {
                    js = d.createElement(s);
                    js.id = id;
                    js.src = p + "://platform.twitter.com/widgets.js";
                    fjs.parentNode.insertBefore(js, fjs);
                }
            }(document, "script", "twitter-wjs");
        };

        return {
            render_tweets: render_tweets
        };

    })(window.document);

    window.twitterjs = twitterjs;
})(window);
