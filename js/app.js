(function(window) {
    var app = (function(document) {

        var head_displayId = config.head_displayId,
            feedId = config.feedId,
            change_city_id = config.change_city,
            slider_id = config.slider;

        var input_data = config.input_data2,
            words_to_check_for_news = config.words_to_check,
            max_news_per_site = config.max_news_per_site,
            number_of_news_in_single_page = config.number_of_news_in_single_page,
            cities_list = config.city;
        var background_working = false;
        var settings_page_open = false;
        var data_present_in_localStorage = false;
        var number_of_news = 0;

        var head_metaTags_array = [];

        var final_titles_array = [],
            final_description_array = [],
            final_newsHref_array = [],
            final_imageHref_array = [],
            final_time_array = [],
            final_priority_array = [],
            final_city_array = [],
            final_state_array = [];

        var final_titles_array2 = [],
            final_description_array2 = [],
            final_newsHref_array2 = [],
            final_imageHref_array2 = [],
            final_time_array2 = [],
            final_priority_array2 = [],
            final_city_array2 = [],
            final_state_array2 = [];

        var temp_titles_array = [],
            temp_description_array = [],
            temp_newsHref_array = [],
            temp_imageHref_array = [],
            temp_time_array = [],
            temp_priority_array = [],
            temp_city_array = [],
            temp_state_array = [];

        var new_news_titles_array = [],
            new_news_description_array = [],
            new_news_newsHref_array = [],
            new_news_imageHref_array = [],
            new_news_time_array = [],
            new_news_priority_array = [],
            new_news_city_array = [],
            new_news_state_array = [];

        var prev_date = null,
            number_of_news = 0;

        var promise_array = [];

        var previous_saved_date;

        // if we got updated news then we will remove the previous news and add the updated to the front
        var update_already_present_news = function(set_title, set_description, set_image_href, set_news_href, news_feed_time, priority, city, state) {
            console.log("News Updated");
            for (var key in final_newsHref_array2) {
                if (final_newsHref_array2[key] == set_news_href) {
                    final_newsHref_array2.splice(key, 1);
                    final_titles_array2.splice(key, 1);
                    final_description_array2.splice(key, 1);
                    final_imageHref_array2.splice(key, 1);
                    final_newsHref_array2.splice(key, 1);
                    final_time_array2.splice(key, 1);
                    final_priority_array2.splice(key, 1);
                    final_city_array2.splice(key, 1);
                    final_state_array2.splice(key, 1);
                    var class_name = functions.remove_punchuations(final_titles_array2[key]);
                    console.log(class_name);
                    $("." + class_name).remove();
                }
            }
        };

        var make_head_metaTags_array = function(meta_obj) {
            head_metaTags_array = [];
            for (var key in meta_obj) {
                head_metaTags_array.push(meta_obj[key]);
            }
        };

        var find_image_href = function() {
            var image_href = "image/images2.jpg";
            for (var key in head_metaTags_array) {
                if (head_metaTags_array[key].hasOwnProperty("property")) {
                    if (head_metaTags_array[key].property.toLowerCase() == "og:image") {
                        image_href = head_metaTags_array[key].content;
                        break;
                    }
                }
            }
            return image_href;
        };

        var crawl_single_news_page_function_for_imageOnly = function(data) {
            var single_news_data = data;
            for (var key in single_news_data.query.results) {
                if (key == "meta") {
                    make_head_metaTags_array(single_news_data.query.results[key]);
                }
            }
            var image_href = find_image_href();
            return image_href;
        };

        var crawl_rss_feed_link_function = function(_site, data, priority) {
            if (data.query.results == null) {
                return;
            }
            for (var i = 0; i < data.query.results.item.length && i <= max_news_per_site; i++) {
                var temp = data.query.results.item[i].title.toLowerCase();
                var set_title = data.query.results.item[i].title;
                var set_description = data.query.results.item[i].description;

                var set_image_href;
                if (data.query.results.item[i].image) {
                    set_image_href = data.query.results.item[i].image.src;
                } else {
                    set_image_href = "image/images2.jpg";
                }
                var html2 = /(<([^>]+)>)/gi;
                set_description = set_description.replace(html2, '');
                var set_news_href = data.query.results.item[i].link;
                var news_feed_time = data.query.results.item[i].pubDate;
                var set_news_city = functions.get_city_of_news_from_details(set_title, set_description, set_news_href);
                var set_news_state = functions.get_state_of_news_from_details(set_title, set_description, set_news_href);

                if ((background_working == true) || (data_present_in_localStorage == true)) {
                    console.log(previous_saved_date);
                    var x = Date.parse(news_feed_time);
                    var y = Date.parse(previous_saved_date);
                    if (x > y) {
                        no_of_new_news++;
                        console.log("got new news");
                        news_feed_time = news_feed_time.toString();
                        if ((final_titles_array2.indexOf(set_title) != -1) || (final_newsHref_array2.indexOf(set_news_href) != -1)) {
                            update_already_present_news(set_title, set_description, set_image_href, set_news_href, news_feed_time, priority, set_news_city, set_news_state);
                        }
                        push_in_new_news_array(set_title, set_description, set_image_href, set_news_href, news_feed_time, priority, set_news_city, set_news_state);
                    }
                } else {
                    if (set_image_href == "image/images2.jpg") {
                        push_news_data_to_temp(set_title, set_description, set_image_href, set_news_href, news_feed_time, priority, set_news_city, set_news_state);
                    } else {
                        push_news_data(set_title, set_description, set_image_href, set_news_href, news_feed_time, priority, set_news_city, set_news_state);
                    }
                }
            }
        };

        var crawl_function = function(format, site, priority) {
            var _site = site;
            if (!_site) {
                alert('No site was passed.');
                return false;
            }

            var yql = functions.prepare_link(_site, format);
            promise_array.push(functions.ajax_call_function(yql).then(function(data) {
                if (data == "err") {} else {
                    crawl_rss_feed_link_function(_site, data, priority);
                }
            }));
        };

        var crawl_for_imageLink_from_meta = function(link, key) {
            var yql = functions.prepare_link(link, "single_news");
            promise_array.push(functions.ajax_call_function(yql).then(function(data) {
                if (data == "err") {} else {
                    var img = crawl_single_news_page_function_for_imageOnly(data);
                    temp_imageHref_array[key] = img;

                    for (var key2 in final_newsHref_array2) {
                        if (final_newsHref_array2[key2] == link) {
                            final_imageHref_array2[key2] = img;
                            var str = final_titles_array2[key2];
                            str = functions.remove_punchuations(str);
                            $("." + str).find("img").attr("data-src", img);
                            $("img").unveil();
                        }
                    }
                }
            }))
        };

        var push_news_data = function(set_title, set_description, set_image_href, set_news_href, news_feed_time, priority, set_city, set_state) {

            console.log("pushed data");
            if ((final_titles_array.indexOf(set_title) != -1) || (final_newsHref_array.indexOf(set_news_href) != -1)) {
                return;
            }
            if (set_image_href == "image/images2.jpg") {} else {
                if ((final_imageHref_array.indexOf(set_image_href) != -1)) {
                    return
                }
            }
            if ((set_title != null) && (set_title != undefined) && (set_title != "")) {
                final_titles_array.push(set_title);
            } else {
                return;
            }

            if ((set_news_href != null) && (set_news_href != undefined) && (set_news_href != "")) {
                final_newsHref_array.push(set_news_href);
            } else {
                return;
            }

            if ((set_description != null) && (set_description != undefined) && (set_description != "")) {
                final_description_array.push(set_description);
            } else {
                final_description_array.push("none");
            }

            if ((set_image_href != null) && (set_image_href != undefined) && (set_image_href != "")) {
                final_imageHref_array.push(set_image_href);
            } else {
                final_imageHref_array.push("image/images2.jpg");
            }

            if ((news_feed_time != null) && (news_feed_time != undefined) && (news_feed_time != "")) {
                final_time_array.push(news_feed_time);
            } else {
                if (prev_date != null) {
                    final_time_array.push(prev_date);
                } else {
                    final_time_array.push(new Date());
                }
            }

            final_city_array.push(set_city);
            final_state_array.push(set_state);

            // var x = Date.parse(news_feed_time);

            // var y = Date.parse(previous_saved_date);
            // if (x > y) {
            //     previous_saved_date = news_feed_time;
            // }

            final_priority_array.push(priority);

            prev_date = news_feed_time;
            number_of_news++;
        };

        var push_news_data_to_temp = function(set_title, set_description, set_image_href, set_news_href, news_feed_time, priority, city, state) {

            if ((temp_titles_array.indexOf(set_title) != -1)) {
                return;
            }

            // var x = Date.parse(news_feed_time);

            // var y = Date.parse(previous_saved_date);
            // if (x > y) {
            //     previous_saved_date = news_feed_time;
            // }
            temp_titles_array.push(set_title);
            temp_description_array.push(set_description);
            temp_imageHref_array.push("meta");
            temp_newsHref_array.push(set_news_href);
            temp_time_array.push(news_feed_time);
            temp_priority_array.push(priority);
            temp_city_array.push(city);
            temp_state_array.push(state);
            number_of_news++;
        };

        var push_in_new_news_array = function(set_title, set_description, set_image_href, set_news_href, news_feed_time, priority, city, state) {
            if ((new_news_titles_array.indexOf(set_title) != -1)) {
                return;
            }

            new_news_titles_array.push(set_title);
            new_news_description_array.push(set_description);
            if (set_image_href == "image/images2.jpg") {
                new_news_imageHref_array.push("meta");
            } else {
                new_news_imageHref_array.push(set_image_href);
            }
            new_news_newsHref_array.push(set_news_href);
            new_news_time_array.push(news_feed_time);
            new_news_priority_array.push(priority);
            new_news_city_array.push(city);
            new_news_state_array.push(state);
        };

        var store_data_in_final2 = function() {
            for (var key in final_titles_array) {
                final_titles_array2.push(final_titles_array[key]);
                final_time_array2.push(final_time_array[key]);
                final_priority_array2.push(final_priority_array[key]);
                final_imageHref_array2.push(final_imageHref_array[key]);
                final_description_array2.push(final_description_array[key]);
                final_newsHref_array2.push(final_newsHref_array[key]);
                final_city_array2.push(final_city_array[key]);
                final_state_array2.push(final_state_array[key]);
            }
        };

        var cleanup_array2 = function() {
            final_titles_array2 = [];
            final_time_array2 = [];
            final_priority_array2 = [];
            final_imageHref_array2 = [];
            final_description_array2 = [];
            final_newsHref_array2 = [];
            final_city_array2 = [];
            final_state_array2 = [];
        };

        var cleanup_new_news_array = function() {
            new_news_titles_array = [];
            new_news_description_array = [];
            new_news_imageHref_array = [];
            new_news_newsHref_array = [];
            new_news_time_array = [];
            new_news_priority_array = [];
            new_news_city_array = [];
            new_news_state_array = [];
        };

        var change_dates_to_same_format = function() {
            var n = number_of_news;
            for (i = 0; i < n; i++) {
                var d = new Date(final_time_array[i]);
                final_time_array[i] = d.toString();
            }
        };

        var move_from_temp_to_final = function() {
            for (var key in temp_titles_array) {
                if (final_titles_array.indexOf(temp_titles_array[key]) != -1) {
                    continue;
                }
                final_titles_array.push(temp_titles_array[key]);
                final_time_array.push(temp_time_array[key]);
                final_priority_array.push(temp_priority_array[key]);
                final_imageHref_array.push(temp_imageHref_array[key]);
                final_description_array.push(temp_description_array[key]);
                final_newsHref_array.push(temp_newsHref_array[key]);
                final_city_array.push(temp_city_array[key]);
                final_state_array.push(temp_state_array[key]);
            }
        };

        var move_from_new_news_to_final = function() {
            var i = new_news_titles_array.length - 1;
            for (var key in new_news_titles_array) {
                if (final_titles_array.indexOf(new_news_titles_array[i]) != -1) {
                    continue;
                }
                final_titles_array2.unshift(new_news_titles_array[i]);
                final_time_array2.unshift(new_news_time_array[i]);
                final_priority_array2.unshift(new_news_priority_array[i]);
                if (new_news_imageHref_array[i] == "meta") {
                    new_news_imageHref_array[i] = "image/images2.jpg";
                }
                final_imageHref_array2.unshift(new_news_imageHref_array[i]);
                final_description_array2.unshift(new_news_description_array[i]);
                final_newsHref_array2.unshift(new_news_newsHref_array[i]);
                final_city_array2.unshift(new_news_city_array[i]);
                final_state_array2.unshift(new_news_state_array[i]);
                i--;
                if (i < 0) {
                    break;
                }
            }
        };

        var render_function = function() {
            console.log("render function called");
            var city_arr = JSON.parse(localStorage.getItem("cities"));
            var feed_id_instance = document.getElementById(feedId);
            var i = 0;
            $(feed_id_instance).html("");
            for (var key in final_titles_array2) {
                if (functions.check_match_two_arrays(city_arr, final_city_array2[key])) {
                    if (final_imageHref_array2[i] == "meta") {
                        final_imageHref_array2[i] = "image/images2.jpg";
                    }
                    $(feed_id_instance).append(functions.make_div(final_titles_array2[i], final_description_array2[i], final_imageHref_array2[i], final_newsHref_array2[i], final_time_array2[i]));
                }
                i++;
            }
            $("img").unveil();
            $(feed_id_instance).scroll(function() {
                $("img").unveil();
            });
        };


        var render_tweets = function() {
            console.log("enter twitter render");

            ! function(d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0],
                    p = /^http:/.test(d.location) ? 'http' : 'https';
                if (!d.getElementById(id)) {
                    js = d.createElement(s);
                    js.id = id;
                    js.src = p + "://platform.twitter.com/widgets.js";
                    fjs.parentNode.insertBefore(js, fjs);
                }
            }(document, "script", "twitter-wjs");

        };

        var make_final_array2_from_local = function(obj) {
            for (var key in obj) {
                final_titles_array2[key] = obj[key].title;
                final_description_array2[key] = obj[key].description;
                final_imageHref_array2[key] = obj[key].imageHref;
                final_newsHref_array2[key] = obj[key].newsHref;
                final_time_array2[key] = obj[key].time;
                final_priority_array2[key] = obj[key].priority;
                final_city_array2[key] = obj[key].city;
                final_state_array2[key] = obj[key].state;
            }
        };

        var change_city_data_in_local_storage = function() {
            var arr = [];
            $('#form_city').find(':input').each(function() {
                if ($(this).attr("checked") == undefined) {} else {
                    arr.push($(this).attr("value"));
                }
            })
            localStorage.setItem("cities", JSON.stringify(arr));
        };

        var event_bind = function() {
            var feed_id_instance = document.getElementById(feedId);
            var change_city_instance = document.getElementById(change_city_id);
            $("img").unveil();
            $(feed_id_instance).scroll(function() {
                $("img").unveil();
            });

            $(change_city_instance).on("click", function(e) {
                console.log("aaa");
                settings_page_open = true;
                $(feed_id_instance).scrollTop(0);
                $(feed_id_instance).html("");

                var div = document.createElement("div");
                div.setAttribute("class", "select_city");
                var span = document.createElement("span");
                span.setAttribute("style", "font-size: larger;");
                span.appendChild(document.createTextNode("Select city"));

                div.appendChild(span);
                $(feed_id_instance).append(div);;
                $(feed_id_instance).append(functions.make_checkbox_form());
                $(change_city_instance).hide();
                $(".checkbox_class").on("change", function(event) {
                    if (event.target.attributes.getNamedItem("checked")) {
                        $("#select_all_id").removeAttr("checked");
                        $(this).removeAttr("checked");
                    } else {
                        $(this).attr("checked", true);
                    }
                });
                $(".done").on("click", function(event) {
                    settings_page_open = false;
                    $(feed_id_instance).scrollTop(0);
                    $(change_city_instance).show();
                    console.log("done clicked");
                    change_city_data_in_local_storage();
                    render_function();
                });

                $('#select_all_id').click(function(event) {
                    if (this.checked) {
                        $('.checkbox_class').each(function() {
                            this.checked = true;
                            $(this).attr("checked", "checked");
                        });
                    } else {
                        $('.checkbox_class').each(function() {
                            this.checked = false;
                            $(this).removeAttr("checked");
                        });
                    }
                });
            });
        };

        var sort_acc_to_date = function() {
            var n = number_of_news;
            var c, d;
            for (c = 0; c < (n - 1); c++) {
                for (d = 0; d < n - c - 1; d++) {
                    var first_date = Date.parse(final_time_array[d]);
                    first_date = Number(first_date);
                    var sec_date = Date.parse(final_time_array[d + 1]);
                    sec_date = Number(sec_date);
                    if (first_date < sec_date) {
                        var swap;
                        swap = final_time_array[d];
                        final_time_array[d] = final_time_array[d + 1];
                        final_time_array[d + 1] = swap;

                        swap = final_titles_array[d];
                        final_titles_array[d] = final_titles_array[d + 1];
                        final_titles_array[d + 1] = swap;

                        swap = final_description_array[d];
                        final_description_array[d] = final_description_array[d + 1];
                        final_description_array[d + 1] = swap;

                        swap = final_imageHref_array[d];
                        final_imageHref_array[d] = final_imageHref_array[d + 1];
                        final_imageHref_array[d + 1] = swap;

                        swap = final_newsHref_array[d];
                        final_newsHref_array[d] = final_newsHref_array[d + 1];
                        final_newsHref_array[d + 1] = swap;

                        swap = final_priority_array[d];
                        final_priority_array[d] = final_priority_array[d + 1];
                        final_priority_array[d + 1] = swap;

                        swap = final_city_array[d];
                        final_city_array[d] = final_city_array[d + 1];
                        final_city_array[d + 1] = swap;

                        swap = final_state_array[d];
                        final_state_array[d] = final_state_array[d + 1];
                        final_state_array[d + 1] = swap;
                    }
                }
            }
        };

        var sort_acc_to_priority = function() {
            var n = number_of_news;
            var c, d;
            for (c = 0; c < (n - 1); c++) {
                for (d = 0; d < n - c - 1; d++) {
                    first_prio = final_priority_array[d];
                    sec_prio = final_priority_array[d + 1];

                    if (first_prio > sec_prio) {
                        var swap;
                        swap = final_time_array[d];
                        final_time_array[d] = final_time_array[d + 1];
                        final_time_array[d + 1] = swap;

                        swap = final_titles_array[d];
                        final_titles_array[d] = final_titles_array[d + 1];
                        final_titles_array[d + 1] = swap;

                        swap = final_description_array[d];
                        final_description_array[d] = final_description_array[d + 1];
                        final_description_array[d + 1] = swap;

                        swap = final_imageHref_array[d];
                        final_imageHref_array[d] = final_imageHref_array[d + 1];
                        final_imageHref_array[d + 1] = swap;

                        swap = final_newsHref_array[d];
                        final_newsHref_array[d] = final_newsHref_array[d + 1];
                        final_newsHref_array[d + 1] = swap;

                        swap = final_priority_array[d];
                        final_priority_array[d] = final_priority_array[d + 1];
                        final_priority_array[d + 1] = swap;

                        swap = final_city_array[d];
                        final_city_array[d] = final_city_array[d + 1];
                        final_city_array[d + 1] = swap;

                        swap = final_state_array[d];
                        final_state_array[d] = final_state_array[d + 1];
                        final_state_array[d + 1] = swap;
                    }
                }
            }

            for (var key in final_priority_array) {}
        };

        var sort_new_news_acc_to_date = function() {
            var n = new_news_titles_array.length;
            var c, d;
            for (c = 0; c < (n - 1); c++) {
                for (d = 0; d < n - c - 1; d++) {
                    var first_date = Date.parse(new_news_time_array[d]);
                    first_date = Number(first_date);
                    var sec_date = Date.parse(new_news_time_array[d + 1]);
                    sec_date = Number(sec_date);
                    if (first_date < sec_date) {
                        var swap;
                        swap = new_news_time_array[d];
                        new_news_time_array[d] = new_news_time_array[d + 1];
                        new_news_time_array[d + 1] = swap;

                        swap = new_news_titles_array[d];
                        new_news_titles_array[d] = new_news_titles_array[d + 1];
                        new_news_titles_array[d + 1] = swap;

                        swap = new_news_description_array[d];
                        new_news_description_array[d] = new_news_description_array[d + 1];
                        new_news_description_array[d + 1] = swap;

                        swap = new_news_imageHref_array[d];
                        new_news_imageHref_array[d] = new_news_imageHref_array[d + 1];
                        new_news_imageHref_array[d + 1] = swap;

                        swap = new_news_newsHref_array[d];
                        new_news_newsHref_array[d] = new_news_newsHref_array[d + 1];
                        new_news_newsHref_array[d + 1] = swap;

                        swap = new_news_priority_array[d];
                        new_news_priority_array[d] = new_news_priority_array[d + 1];
                        new_news_priority_array[d + 1] = swap;

                        swap = new_news_city_array[d];
                        new_news_city_array[d] = new_news_city_array[d + 1];
                        new_news_city_array[d + 1] = swap;

                        swap = new_news_state_array[d];
                        new_news_state_array[d] = new_news_state_array[d + 1];
                        new_news_state_array[d + 1] = swap;
                    }
                }
            }
        };

        var sort_new_news_acc_to_priority = function() {
            var n = new_news_titles_array.length;
            var c, d;
            for (c = 0; c < (n - 1); c++) {
                for (d = 0; d < n - c - 1; d++) {
                    first_prio = new_news_priority_array[d];
                    sec_prio = new_news_priority_array[d + 1];

                    if (first_prio > sec_prio) {
                        var swap;
                        swap = new_news_time_array[d];
                        new_news_time_array[d] = new_news_time_array[d + 1];
                        new_news_time_array[d + 1] = swap;

                        swap = new_news_titles_array[d];
                        new_news_titles_array[d] = new_news_titles_array[d + 1];
                        new_news_titles_array[d + 1] = swap;

                        swap = new_news_description_array[d];
                        new_news_description_array[d] = new_news_description_array[d + 1];
                        new_news_description_array[d + 1] = swap;

                        swap = new_news_imageHref_array[d];
                        new_news_imageHref_array[d] = new_news_imageHref_array[d + 1];
                        new_news_imageHref_array[d + 1] = swap;

                        swap = new_news_newsHref_array[d];
                        new_news_newsHref_array[d] = new_news_newsHref_array[d + 1];
                        new_news_newsHref_array[d + 1] = swap;

                        swap = new_news_priority_array[d];
                        new_news_priority_array[d] = new_news_priority_array[d + 1];
                        new_news_priority_array[d + 1] = swap;

                        swap = new_news_city_array[d];
                        new_news_city_array[d] = new_news_priority_array[d + 1];
                        new_news_city_array[d + 1] = swap;

                        swap = new_news_state_array[d];
                        new_news_state_array[d] = new_news_state_array[d + 1];
                        new_news_state_array[d + 1] = swap;
                    }
                }
            }
        };

        var initialBind = function() {
            if (typeof(Storage) !== "undefined") {
                var local_data = localStorage.getItem("data1");
                if (local_data) {
                    if (local_data == "") {
                        return;
                    }
                    data_present_in_localStorage = true;
                    var parsed_data = JSON.parse(local_data);
                    make_final_array2_from_local(parsed_data);
                    initial_render(parsed_data);
                }
            } else {}
        };

        var initial_render = function(obj) {
            var city_arr = JSON.parse(localStorage.getItem("cities"));
            var feed_id_instance = document.getElementById(feedId);
            $(feed_id_instance).html("");
            $(feed_id_instance).attr("class", "loaded");
            var i = 0;
            var x = Date.parse(obj[0].time);
            previous_saved_date = obj[0].time;

            for (var key in obj) {
                var y = Date.parse(obj[i].time);
                if (y > x) {
                    console.log("problem");
                    previous_saved_date = obj[i].time;
                    x = Date.parse(obj[i].time);
                } else {}
                if (functions.check_match_two_arrays(city_arr, obj[i].city)) {

                    $(feed_id_instance).append(functions.make_div(obj[i].title, obj[i].description, obj[i].imageHref, obj[i].newsHref, obj[i].time));
                }
                i++;
            }
            $("img").unveil();
            $(feed_id_instance).scroll(function() {
                $("img").unveil();
            });
            console.log(obj[0].time);
        };

        var bindForm = function() {

            // chrome.storage.local.set(input_data);
            // chrome.storage.local.clear(function() {
            //     var error = chrome.runtime.lastError;
            //     if (error) {
            //         console.error(error);
            //     }
            // });
            // StorageArea.clear();
            // chrome.storage.local.get(input_data, function(result) {
            //     console.log(result);
            // });

            

            var change_city_instance = document.getElementById(change_city_id);
            var slider_instance = document.getElementById(slider_id);
            functions.set_cities_to_local_storage();
            no_of_new_news = 0;
            if (arguments.length > 0) {
                background_working = true;
                promise_array = [];
                final_titles_array = [];
                final_description_array = [];
                final_imageHref_array = [];
                final_newsHref_array = [];
                final_time_array = [];
                final_priority_array = [];
                console.log("got arguments");
            } else {
                if (data_present_in_localStorage == false) {

                    $(change_city_instance).hide();
                }
                //binding events on settings when we got data from local storage
                event_bind();
            }

            return new Promise(function(resolve, reject) {

                var head_displayInstance = document.getElementById(head_displayId);
                var feed_id_instance = document.getElementById(feedId);

                for (var key in input_data.data) {
                    crawl_function("rss", input_data.data[key].url, input_data.data[key].priority);
                }

                if (background_working == false) {
                    if (data_present_in_localStorage == false) {
                        $(feed_id_instance).addClass("loading");
                    }
                    $(slider_instance).hide();
                } else {
                    console.log(background_working);
                    console.log(promise_array);
                }

                Promise.all(promise_array).then(function() {
                    $("img").unveil();
                    $(feed_id_instance).scroll(function() {
                        $("img").unveil();
                    });
                    if ((background_working == true) || (data_present_in_localStorage == true)) {

                        console.log("no_of_new_news: " + no_of_new_news);
                        if (no_of_new_news > 0) {

                            console.log("background_working");

                            promise_array = [];

                            sort_new_news_acc_to_date();
                            move_from_new_news_to_final();
                            var check_for_slide_down = 0;
                            var temp_i = new_news_titles_array.length - 1;
                            // for (var key in new_news_titles_array) {
                            do {
                                if (settings_page_open == true) {} else {
                                    var city_arr = JSON.parse(localStorage.getItem("cities"));
                                    if (functions.check_match_two_arrays(city_arr, new_news_city_array[temp_i])) {
                                        $(feed_id_instance).prepend(functions.make_div(new_news_titles_array[temp_i], new_news_description_array[temp_i], new_news_imageHref_array[temp_i], new_news_newsHref_array[temp_i], new_news_time_array[temp_i]));
                                        check_for_slide_down = 1;
                                    }
                                }
                                crawl_for_imageLink_from_meta(new_news_newsHref_array[temp_i], temp_i);
                                temp_i--;
                            }
                            while (temp_i >= 0);
                            if (check_for_slide_down == 1) {
                                check_for_slide_down = 0;
                                // console.log(slider_instance);
                                $(slider_instance).slideDown();
                            }

                            Promise.all(promise_array).then(function() {
                                previous_saved_date = final_time_array2[0];
                                var data = JSON.stringify(functions.make_data_a_json_object(final_titles_array2, final_description_array2, final_imageHref_array2, final_newsHref_array2, final_time_array2, final_priority_array2, final_city_array2, final_state_array2));
                                cleanup_new_news_array();
                                localStorage.setItem("data1", data);
                                promise_array = [];
                                resolve("final");
                                console.log("local storage changed");
                            });

                            $(slider_instance).on("click", function() {
                                $(slider_instance).slideUp();
                                $(feed_id_instance).scrollTop(0);
                            });
                        } else {
                            resolve("final");
                        }
                    } else {
                        move_from_temp_to_final();
                        change_dates_to_same_format();
                        sort_acc_to_priority();
                        sort_acc_to_date();
                        store_data_in_final2();

                        $(feed_id_instance).attr("class", "loaded");
                        render_function();
                        promise_array = [];
                        for (var key in temp_titles_array) {
                            crawl_for_imageLink_from_meta(temp_newsHref_array[key], key);
                        }
                        Promise.all(promise_array).then(function() {
                            console.log("done");
                            previous_saved_date = final_time_array2[0];
                            $(change_city_instance).show();
                            var x = functions.make_data_a_json_object(final_titles_array2, final_description_array2, final_imageHref_array2, final_newsHref_array2, final_time_array2, final_priority_array2, final_city_array2, final_state_array2);
                            x = JSON.stringify(x);
                            localStorage.setItem("data1", x);
                            promise_array = [];
                            resolve("final");
                            event_bind();
                        });
                    }
                });
            });
        };

        return {
            initialBind: initialBind,
            bindForm: bindForm,
            input_data: input_data
        };

    })(window.document);

    window.app = app;
})(window);
