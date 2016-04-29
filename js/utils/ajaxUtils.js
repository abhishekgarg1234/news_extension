(function(window) {
    var ajaxUtils = (function(document) {

        var prepareLink = function(_site, format) {
            var x1 = 'http://query.yahooapis.com/v1/public/yql?q=';
            if (format == "mainpage") {
                var yql = x1 + encodeURIComponent('select * from html where url="' + _site + '"') + '&format=json';
                return yql;
            } else if (format == "rss") {
                var yql = x1 + encodeURIComponent('select * from rss where url="' + _site + ' "') + '&format=json';
                return yql;
            } else if (format == "single_news") {
                var yql = x1 + encodeURIComponent('select * from html where url="' + _site + '"  and xpath="/html/head/*"  ') + '&format=json';
                return yql;
            }
        };

        var ajaxCallFunction = function(url) {
            return new Promise(function(resolve, reject) {
                $.ajax({
                    url: url
                }).done(function(data) {
                    resolve(data);
                }).fail(function(err) {
                    resolve("err");
                });
            });
        };

        return {
            prepareLink: prepareLink,
            ajaxCallFunction: ajaxCallFunction
        };

    })(window.document);

    window.ajaxUtils = ajaxUtils;
})(window);
