(function(window) {
    var app = (function(document) {

        var tab_open = "news";

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

        var prev_date = null,
            number_of_news = 0;

        var promise_array = [];

        var previous_saved_date;


        //new datas
        var finalNewsData = [];
        var finalNewsData2 = [];
        var tempNewsData = [];
        var newNewsData = [];

        // if we got updated news then we will remove the previous news and add the updated to the front


        var update_already_present_news_2 = function(newsObj) {
            console.log("News Updated");
            for (var key in finalNewsData2) {
                if (finalNewsData2[key].newsHref == newsObj.newsHref) {
                    finalNewsData2.splice(key, 1);
                }
                var class_name = utils.remove_punchuations(finalNewsData2[key].title);
                $("." + class_name).remove();
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


        var crawl_rss_feed_link_function_2 = function(_site, data, priority) {
            if (data.query.results == null) {
                return;
            }


            for (var i = 0; i < data.query.results.item.length && i <= max_news_per_site; i++) {

                var newsObj = new Object();
                newsObj.title = data.query.results.item[i].title;
                newsObj.description = data.query.results.item[i].description;

                if (data.query.results.item[i].image) {
                    newsObj.imageHref = data.query.results.item[i].image.src;;
                } else {
                    newsObj.imageHref = "image/images2.jpg";
                }
                var html2 = /(<([^>]+)>)/gi;
                newsObj.description = newsObj.description.replace(html2, '');

                newsObj.newsHref = data.query.results.item[i].link;
                newsObj.time = data.query.results.item[i].pubDate;
                newsObj.city = utils.get_city_of_news_from_details(newsObj.title, newsObj.description, newsObj.newsHref);
                newsObj.state = utils.get_state_of_news_from_details(newsObj.title, newsObj.description, newsObj.newsHref);

                if ((background_working == true) || (data_present_in_localStorage == true)) {
                    var x = Date.parse(newsObj.time);
                    var y = Date.parse(previous_saved_date);
                    if (x > y) {
                        no_of_new_news++;
                        console.log("got new news");
                        newsObj.time = newsObj.time.toString();
                        if ((checkForTitleAlreadyPresent(finalNewsData2, newsObj.title)) || (checkForNewshrefAlreadypresent(finalNewsData2, newsObj.newsHref))) {
                            update_already_present_news(newsObj);
                        }
                        push_in_new_news_array(newsObj);
                    }
                } else {
                    if (newsObj.imageHref == "image/images2.jpg") {
                        push_news_data_to_temp(newsObj);
                    } else {
                        push_news_data(newsObj);
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

            var yql = utils.prepare_link(_site, format);
            promise_array.push(utils.ajax_call_function(yql).then(function(data) {
                if (data == "err") {} else {
                    crawl_rss_feed_link_function(_site, data, priority);
                }
            }));
        };



        var crawl_for_imageLink_from_meta_2 = function(link, key) {
            var yql = utils.prepare_link(link, "single_news");
            promise_array.push(utils.ajax_call_function(yql).then(function(data) {
                if (data == "err") {} else {
                    var img = crawl_single_news_page_function_for_imageOnly(data);
                    tempNewsData[key].imageHref = img;
                    for (var key2 in finalNewsData2) {
                        if (finalNewsData2[key2].newsHref == link) {
                            finalNewsData2[key2].imageHref = img;
                            var str = finalNewsData2[key2].title;
                            str = utils.remove_punchuations(str);
                            $("." + str).find("img").attr("data-src", img);
                            $("img").unveil();
                        }
                    }
                }
            }))
        };

        //done


        var push_news_data_2 = function(newsObj) {

            console.log("pushed data");
            if ((checkForTitleAlreadypresent(finalNewsData, newsObj)) || (checkForNewshrefAlreadypresent(finalNewsData, newsObj.newsHref))) {
                return;
            }

            if (newsObj.imageHref == "image/images2.jpg") {} else {
                if (checkForImagehrefAlreadypresent(finalNewsData, newsObj.imageHref)) {
                    return;
                }
            }

            if ((newsObj.title != null) && (newsObj.title != undefined) && newsObj.title != "") {
                newsObj.title = set_title;
            } else {
                return;
            }

            if ((newsObj.newsHref != null) && (newsObj.newsHref != undefined) && (newsObj.newsHref != "")) {
                newsObj.newsHref = set_news_href;
            } else {
                return;
            }

            if ((newsObj.description != null) && (newsObj.description != undefined) && (newsObj.description != "")) {
                newsObj.description = set_description;
            } else {
                newsObj.description = "none";
            }

            if ((newsObj.imageHref != null) && (newsObj.imageHref != undefined) && (newsObj.imageHref != "")) {
                newsObj.imageHref = set_image_href;
            } else {
                newsObj.imageHref = "image/images2.jpg";
            }

            if ((newsObj.time != null) && (newsObj.time != undefined) && (newsObj.time != "")) {
                newsObj.time = news_feed_time;
            } else {
                if (prev_date != null) {
                    newsObj.time = prev_date;
                } else {
                    newsObj.time = new Date();
                }
            }

            finalNewsData.push(newsObj);

            prev_date = news_feed_time;
            number_of_news++;
        }

        //done

        var push_news_data_to_temp_2 = function(newsObj) {
            if (checkForTitleAlreadyPresent(tempNewsData, newsObj.title)) {
                return;
            }

            newsObj.imagehref = "meta";

            tempNewsData.push(newsObj);

            //end of new

            number_of_news++;
        };

        //done

        var push_in_new_news_array_2 = function(newsObj) {
            if (checkForTitleAlreadyPresent(newNewsData, newsObj.title)) {
                return;
            }
            if (newsObj.imageHref == "image/images2.jpg") {
                newsObj.imageHref = "meta";
            } else {
                newsObj.imageHref = newsObj.imageHref;
            }
            newNewsData.push(newsObj);
        };

        //done


        var store_data_in_final2_2 = function() {
            for (var key in finalNewsData) {
                finalNewsData2.push(finalNewsData[key]);
            }
        }

        //done


        var cleanup_array2_2 = function() {
            finalNewsData = [];
        };



        //done

        var cleanup_new_news_array_2 = function() {
            newNewsData = [];
        };


        //done

        var change_dates_to_same_format_2 = function() {
            var n = number_of_news;
            for (i = 0; i < n; i++) {
                var d = new Date(finalNewsData[i].time);
                finalNewsData[i].time = d.toString();
            }
        };



        //done


        var move_from_temp_to_final_2 = function() {
            for (var key in tempNewsData) {
                if (checkForTitleAlreadyPresent(finalNewsData, tempNewsData[key].title)) {
                    continue;
                }
                finalNewsData.push(tempNewsData[key]);
            }
        };





        var move_from_new_news_to_final_2 = function() {
            var i = newNewsData.length - 1;
            for (var key in newNewsData) {
                if (checkForTitleAlreadyPresent(finalNewsData2, newNewsData[i].title)) {
                    continue;
                }
                if (newNewsData[key].imageHref == "meta") {
                    newNewsData[key].imageHref = "image/images2.jpg";
                }
                finalNewsData2.unshift(newNewsData[i]);
                i--;
                if (i < 0) {
                    break;
                }
            }
        };

        var checkForTitleAlreadyPresent = function(data, title) {
            for (var key in data) {
                if (data[key].title == title) {
                    return 1;
                }
            }
            return 0;
        }
        var checkForNewshrefAlreadypresent = function(data, newsHref) {
            for (var key in data) {
                if (data[key].newsHref == newsHref) {
                    return 1;
                }
            }
            return 0;
        }
        var checkForImagehrefAlreadypresent = function(data, imageHref) {
            for (var key in data) {
                if (data[key].imageHref == imageHref) {
                    return 1;
                }
            }
            return 0;
        }

        var render_function_2 = function() {
            var feed_id_instance = document.getElementById(feedId);
            $("#twitter-wjs").remove();
            $(feed_id_instance).css("overflow-y", "scroll");
            $(feed_id_instance).addClass("news_display");

            console.log("render function called");
            var city_arr = JSON.parse(localStorage.getItem("cities"));

            var i = 0;
            $(feed_id_instance).html("");
            var have_some_news = 0;

            for (var key in finalNewsData2) {
                if (utils.check_match_two_arrays(city_arr, finalNewsData2[key].city)) {
                    if (finalNewsData2[i].imageHref == "meta") {
                        finalNewsData2[i].imageHref = "image/images2.jpg";
                    }
                    have_some_news = 1;
                    $(feed_id_instance).append(utils.make_div(finalNewsData2[i].title, finalNewsData2[i].description, finalNewsData2[i].imageHref, finalNewsData2[i].newsHref, finalNewsData2[i].time));
                }
                i++;
            }

            if (have_some_news == 0) {
                city_arr.push("other");
                var p = document.createElement("p");
                p.appendChild(document.createTextNode("Showing other news. "));
                $(feed_id_instance).append(p);
                i = 0;
                for (var key in finalNewsData2) {
                    if (utils.check_match_two_arrays(city_arr, finalNewsData2[key].city)) {
                        if (finalNewsData2[i].imageHref == "meta") {
                            finalNewsData2[i].imageHref = "image/images2.jpg";;
                        }
                        have_some_news = 1;
                        $(feed_id_instance).append(utils.make_div(finalNewsData2[i].title, finalNewsData2[i].description, finalNewsData2[i].imageHref, finalNewsData2[i].newsHref, finalNewsData2[i].time));
                    }
                    i++;
                }
            }

            $("img").unveil();
            $(feed_id_instance).scroll(function() {
                $("img").unveil();
            });
        };

        var make_final_array2_from_local_2 = function(obj) {
            for (var key in obj) {
                finalNewsData2.push(obj[key]);
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
            var slider_instance = document.getElementById(slider_id);
            var twitter_tab_instance = document.getElementById(config.twitter_tab);
            var news_tab_instance = document.getElementById(config.news_tab);
            var aboutus_tab_instance = document.getElementById(config.aboutus_tab);
            console.log(data_present_in_localStorage);
            // render_function();
            // twitterjs.render_tweets();
            // about.render_aboutus();
            $(".twitter_display").hide();
            $(".aboutus_display").hide();

            $(twitter_tab_instance).one("click", function() {
                $(slider_instance).hide();

                tab_open = "twitter";
                twitterjs.render_tweets();
                $(twitter_tab_instance).addClass("tw_class");
                $(".news_display").hide();
                $(".aboutus_display").hide();
                $(".twitter_display").show();

                $(".tw_class").on("click", function() {
                    $(slider_instance).hide();
                    tab_open = "twitter";
                    $(".news_display").hide();
                    $(".aboutus_display").hide();
                    $(".twitter_display").show();
                    // twitterjs.render_tweets();
                });
            });

            $(aboutus_tab_instance).one("click", function() {
                $(slider_instance).hide();

                tab_open = "us";
                about.render_aboutus();
                $(aboutus_tab_instance).addClass("ab_class");
                $(".news_display").hide();
                $(".twitter_display").hide();
                $(".aboutus_display").show();

                $(".ab_class").on("click", function() {
                    $(slider_instance).hide();

                    tab_open = "us";
                    $(".news_display").hide();
                    $(".twitter_display").hide();
                    $(".aboutus_display").show();
                    // twitterjs.render_tweets();
                });
            });

            $(news_tab_instance).on("click", function() {
                $(".news_display").show();
                $(".aboutus_display").hide();
                $(".twitter_display").hide();
                // render_function();
            });

            var feed_id_instance = document.getElementById(feedId);
            var change_city_instance = document.getElementById(change_city_id);
            $("img").unveil();
            $(feed_id_instance).scroll(function() {
                $("img").unveil();
            });

            $(change_city_instance).on("click", function(e) {
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
                $(feed_id_instance).append(utils.make_checkbox_form());
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

                $(".news_display").show();
                $(".twitter_display").hide();
                $(".aboutus_display").hide();
            });
        };

        //done
        var sortAccToDate = function(data) {
            var n = number_of_news;
            for (c = 0; c < (n - 1); c++) {
                for (d = 0; d < n - c - 1; d++) {
                    var first_date = Date.parse(data[d].time);
                    first_date = Number(first_date);
                    var sec_date = Date.parse(data[d + 1].time);
                    sec_date = Number(sec_date);
                    if (first_date < sec_date) {
                        var swap = data[d];
                        data[d] = data[d + 1];
                        data[d + 1] = swap;
                    }
                }
            }
            return data;
        };

        //done
        var sortAccToPriority = function(data) {
            var n = number_of_news;
            var c, d;
            for (c = 0; c < (n - 1); c++) {
                for (d = 0; d < n - c - 1; d++) {
                    first_prio = data[d].priority;
                    sec_prio = data[d + 1].priority;
                    if (first_prio > sec_prio) {
                        var swap = data[d];
                        data[d] = data[d + 1];
                        data[d + 1] = swap;
                    }
                }
            }
            return data;
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
            console.log("initial_render");
            var city_arr = JSON.parse(localStorage.getItem("cities"));
            var feed_id_instance = document.getElementById(feedId);
            $(feed_id_instance).html("");
            $(feed_id_instance).attr("class", "loaded");


            //added changes
            $("#twitter-wjs").remove();
            $(feed_id_instance).css("overflow-y", "scroll");
            $(feed_id_instance).addClass("news_display");


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
                if (utils.check_match_two_arrays(city_arr, obj[i].city)) {

                    $(feed_id_instance).append(utils.make_div(obj[i].title, obj[i].description, obj[i].imageHref, obj[i].newsHref, obj[i].time));
                }
                i++;
            }
            $("img").unveil();
            $(feed_id_instance).scroll(function() {
                $("img").unveil();
            });
        };

        var bindForm = function() {
            var change_city_instance = document.getElementById(change_city_id);
            var slider_instance = document.getElementById(slider_id);
            utils.set_cities_to_local_storage();

            no_of_new_news = 0;
            if (arguments.length > 0) {
                background_working = true;
                promise_array = [];
                finalNewsData = [];
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
                } else {}

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
                            do {
                                if (settings_page_open == true) {} else {
                                    var city_arr = JSON.parse(localStorage.getItem("cities"));
                                    if (utils.check_match_two_arrays(city_arr, new_news_city_array[temp_i])) {
                                        $(feed_id_instance).prepend(utils.make_div(new_news_titles_array[temp_i], new_news_description_array[temp_i], new_news_imageHref_array[temp_i], new_news_newsHref_array[temp_i], new_news_time_array[temp_i]));
                                        check_for_slide_down = 1;
                                    }
                                }
                                crawl_for_imageLink_from_meta(new_news_newsHref_array[temp_i], temp_i);
                                temp_i--;
                            }
                            while (temp_i >= 0);
                            if (check_for_slide_down == 1) {
                                check_for_slide_down = 0;
                                if (tab_open == "news") {
                                    $(slider_instance).slideDown();
                                }
                            }

                            Promise.all(promise_array).then(function() {
                                previous_saved_date = final_time_array2[0];
                                // var data = JSON.stringify(utils.make_data_a_json_object(final_titles_array2, final_description_array2, final_imageHref_array2, final_newsHref_array2, final_time_array2, final_priority_array2, final_city_array2, final_state_array2));
                                var data = JSON.stringify(finalNewsData2);

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
                        finalNewsData = sortAccToPriority(finalNewsData);
                        sort_acc_to_date();
                        finalNewsData = sortAccToDate(finalNewsData);

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
                            previous_saved_date = finalNewsData2[0].time;
                            $(change_city_instance).show();
                            // var x = utils.make_data_a_json_object(final_titles_array2, final_description_array2, final_imageHref_array2, final_newsHref_array2, final_time_array2, final_priority_array2, final_city_array2, final_state_array2);
                            var x = finalNewsData2;
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
