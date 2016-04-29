(function(window) {
    var viewUtils = (function(document) {

        var words_to_check_for_news = config.words_to_check;
        var cities_list = config.city;
        var state_to_check = config.state;

         var capitalise_string = function(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        };

        var makeCheckboxForm = function() {
            var checked_items = cities_list;
            var from_local = JSON.parse(localStorage.getItem("cities"));
            var form = document.createElement("form");
            form.setAttribute("id", "form_city");

            var x = document.createElement("input");
            x.setAttribute("class", "select_all_class");
            x.setAttribute("id", "select_all_id");
            x.setAttribute("type", "checkbox");
            x.setAttribute("name", "select_all");
            x.setAttribute("value", "select_all");

            var temp = 0;
            for (var key in checked_items) {
                if (from_local.indexOf(checked_items[key]) != -1) {} else {
                    temp = 1;
                    break;
                }
            }
            if (temp == 0) {
                x.setAttribute("checked", "checked");
            }

            var label = document.createElement("label");
            label.setAttribute("for", "select_all_id");
            label.setAttribute("class", "checkbox_labels");
            label.innerHTML = "All";

            form.appendChild(x);
            form.appendChild(label);

            var i = 2;

            for (var key in checked_items) {
                var x = document.createElement("input");
                x.setAttribute("class", "checkbox_class");
                x.setAttribute("id", checked_items[key]);
                x.setAttribute("type", "checkbox");
                x.setAttribute("name", "cities_list");
                x.setAttribute("value", checked_items[key]);
                if (from_local.indexOf(checked_items[key]) != -1) {
                    x.setAttribute("checked", "checked");
                } else {}

                var label = document.createElement("label");
                label.setAttribute("for", checked_items[key]);
                label.setAttribute("class", "checkbox_labels");
                label.innerHTML = capitalise_string(checked_items[key]);

                form.appendChild(x);
                form.appendChild(label);
                if (((i % 2) == 0)) {
                    form.appendChild(document.createElement("br"));
                    form.appendChild(document.createElement("br"));
                }
                i++;
            }

            form.appendChild(document.createElement("br"));

            var span = document.createElement("span");
            span.appendChild(document.createTextNode("Done"));
            span.setAttribute("style", "font-weight: bold");
            span.setAttribute("class", "done");
            form.appendChild(span);
            return form;
        };

        var makeDiv = function(newsObj) {

            var title = newsObj.title;
            var description_of_news = newsObj.description;
            var image_href = newsObj.imageHref;
            var news_href = newsObj.news_Href;
            var news_feed_time = newsObj.time;


            if (image_href == "meta") {
                image_href = "image/images2.jpg";
            }

            var main_div = document.createElement("div");
            main_div.setAttribute("class", "news_feed_div");

            var left_div = document.createElement("div");
            left_div.setAttribute("class", "news_feed left_div");

            var image_div = document.createElement("div");
            image_div.setAttribute("class", "news_feed_image_div");
            var image = document.createElement("img");
            // image.setAttribute("src", image_href);
            // image.setAttribute("src", "image/images2.jpg");

            if (image_href == "image/images2.jpg") {
                image.setAttribute("src", "image/images2.jpg");
                image.setAttribute("data-src", image_href);
            } else {
                image.setAttribute("src", "image/images2.jpg");
                image.setAttribute("data-src", image_href);
            }

            image.setAttribute("alt", "Image not available");
            image.setAttribute("onError", "this.src='image/images2.jpg'");
            image.setAttribute("style", "width:90px;height:90px;");

            var str = title;
            str = utils.removePunchuations(str);
            main_div.setAttribute("class", str);

            image_div.appendChild(image);

            left_div.appendChild(image_div);

            var right_div = document.createElement("div");
            right_div.setAttribute("class", "news_feed right_div");

            var title_div = document.createElement("div");
            title_div.setAttribute("class", "news_feed_title_div");
            var anchor = document.createElement("a");
            anchor.setAttribute("href", news_href);
            anchor.setAttribute("class", "news_feed_anchor_tag");
            anchor.setAttribute("target", "_blank");
            var text = document.createTextNode(title);
            anchor.appendChild(text);
            title_div.appendChild(anchor);

            if ((description_of_news == "none")) {
                description_of_news = "";
                title_div.setAttribute("class", "title_div_without_description");
            } else {
                var description_div = document.createElement("div");
                description_div.setAttribute("class", "news_feed_description_div");
                description_div.innerHTML = description_of_news;
            }

            var time_div = document.createElement("div");
            time_div.setAttribute("class", "news_feed_time_div");
            var time_span = document.createElement("span");
            time_span.setAttribute("class", "time_span_class");
            var changed_time_type = utils.change_time_type_fn(news_feed_time);
            // console.log(changed_time_type);
            var text = document.createTextNode(changed_time_type);
            time_span.appendChild(text);

            time_div.appendChild(time_span);

            right_div.appendChild(title_div);
            if (description_of_news != "") {
                right_div.appendChild(description_div);
            }
            right_div.appendChild(time_div);

            main_div.appendChild(left_div);
            main_div.appendChild(right_div);
            return main_div;
        };

        return {
            makeCheckboxForm: makeCheckboxForm,
            makeDiv: makeDiv
        };

    })(window.document);

    window.viewUtils = viewUtils;
})(window);
