(function(window) {
    var app = (function(document) {

        var tabOpen = "news";

        var head_displayId = config.head_displayId,
            feedId = config.feedId,
            change_city_id = config.change_city,
            slider_id = config.slider;

        var input_data = config.newsLinks,
            maxNewsPerSite = config.maxNewsPerSite,
            numberOfNewsInSinglePage = config.numberOfNewsInSinglePage;
        var background_working = false;
        var settingsPageOpen = false;
        var dataPresentInLocalStorage = false;
        var numberOfNews = 0;

        var headMetaTagsArray = [];

        var prev_date = null,
            numberOfNews = 0;

        var promiseArray = [];

        var previous_saved_date = localStorage.getItem("previousDate");
        var finalNewsData = [],
            finalNewsData2 = [],
            tempNewsData = [],
            newNewsData = [];

        // if we got updated news then we will remove the previous news and add the updated to the front
        var updateAlreadyPresentNews = function(newsObj) {
            console.log("News Updated");
            for (var key in finalNewsData2) {
                if (finalNewsData2[key].newsHref == newsObj.newsHref) {
                    finalNewsData2.splice(key, 1);
                }
                var class_name = utils.removePunchuations(finalNewsData2[key].title);
                $("." + class_name).remove();
            }
        };

        var makeHeadMetaTagsArray = function(meta_obj) {
            headMetaTagsArray = [];
            for (var key in meta_obj) {
                headMetaTagsArray.push(meta_obj[key]);
            }
        };

        var findImageHref = function() {
            var image_href = "image/images2.jpg";
            for (var key in headMetaTagsArray) {
                if (headMetaTagsArray[key].hasOwnProperty("property")) {
                    if (headMetaTagsArray[key].property.toLowerCase() == "og:image") {
                        image_href = headMetaTagsArray[key].content;
                        break;
                    }
                }
            }
            return image_href;
        };

        var crawlSingleNewsPageFunctionForImageOnly = function(data) {
            var single_news_data = data;
            for (var key in single_news_data.query.results) {
                if (key == "meta") {
                    makeHeadMetaTagsArray(single_news_data.query.results[key]);
                }
            }
            var image_href = findImageHref();
            return image_href;
        };
        var crawlFunction = function(format, site, priority) {
            var _site = site;
            if (!_site) {
                alert('No site was passed.');
                return false;
            }

            var yql = ajaxUtils.prepareLink(_site, format);
            promiseArray.push(ajaxUtils.ajaxCallFunction(yql).then(function(data) {
                if (data == "err") {} else {
                    crawlRssFeedLinkFunction(_site, data, priority);
                }
            }));
        };

        var crawlRssFeedLinkFunction = function(_site, data, priority) {
            if (data.query.results == null) {
                return;
            }

            for (var i = 0; i < data.query.results.item.length && i <= maxNewsPerSite; i++) {

                var newsObj = {};
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
                newsObj.city = utils.getCityOfNewsFromDetails(newsObj.title, newsObj.description, newsObj.newsHref);
                newsObj.state = utils.getStateOfNewsFromDetails(newsObj.title, newsObj.description, newsObj.newsHref);

                if ((background_working == true) || (dataPresentInLocalStorage == true)) {
                    var x = Date.parse(newsObj.time);
                    var y = Date.parse(previous_saved_date);
                    if (x > y) {
                        noOfNewNews++;
                        console.log("got new news");
                        newsObj.time = newsObj.time.toString();
                        if ((utils.checkForTitleAlreadyPresent(finalNewsData2, newsObj.title)) || (utils.checkForNewshrefAlreadypresent(finalNewsData2, newsObj.newsHref))) {
                            updateAlreadyPresentNews(newsObj);
                        }
                        pushInNewNewsArray(newsObj);
                    }
                } else {
                    if (newsObj.imageHref == "image/images2.jpg") {
                        pushNewsDataToTemp(newsObj);
                    } else {
                        pushNewsData(newsObj);
                    }
                }
            }
        };

        var crawlForImageLinkFromMeta = function(link, key) {
            var yql = ajaxUtils.prepareLink(link, "single_news");
            promiseArray.push(ajaxUtils.ajaxCallFunction(yql).then(function(data) {
                if (data == "err") {} else {
                    var img = crawlSingleNewsPageFunctionForImageOnly(data);
                    for (var key2 in finalNewsData2) {
                        if (finalNewsData2[key2].newsHref == link) {
                            finalNewsData2[key2].imageHref = img;
                            var str = finalNewsData2[key2].title;
                            str = utils.removePunchuations(str);
                            $("." + str).find("img").attr("data-src", img);
                            $("img").unveil();
                        }
                    }
                }
            }))
        };

        var pushNewsData = function(newsObj) {
            console.log("pushed data");
            if ((utils.checkForTitleAlreadyPresent(finalNewsData, newsObj)) || (utils.checkForNewshrefAlreadypresent(finalNewsData, newsObj.newsHref))) {
                return;
            }

            if (newsObj.imageHref == "image/images2.jpg") {} else {
                if (utils.checkForImagehrefAlreadypresent(finalNewsData, newsObj.imageHref)) {
                    return;
                }
            }

            if ((newsObj.title != null) && (newsObj.title != undefined) && newsObj.title != "") {} else {
                return;
            }

            if ((newsObj.newsHref != null) && (newsObj.newsHref != undefined) && (newsObj.newsHref != "")) {} else {
                return;
            }

            if ((newsObj.description != null) && (newsObj.description != undefined) && (newsObj.description != "")) {} else {
                newsObj.description = "none";
            }

            if ((newsObj.imageHref != null) && (newsObj.imageHref != undefined) && (newsObj.imageHref != "")) {} else {
                newsObj.imageHref = "image/images2.jpg";
            }

            if ((newsObj.time != null) && (newsObj.time != undefined) && (newsObj.time != "")) {} else {
                if (prev_date != null) {
                    newsObj.time = prev_date;
                } else {
                    newsObj.time = new Date();
                }
            }
            finalNewsData.push(newsObj);
            prev_date = newsObj.time;
            numberOfNews++;
        };

        var pushNewsDataToTemp = function(newsObj) {
            if (utils.checkForTitleAlreadyPresent(tempNewsData, newsObj.title)) {
                return;
            }
            newsObj.imagehref = "meta";
            tempNewsData.push(newsObj);
            numberOfNews++;
        };

        var pushInNewNewsArray = function(newsObj) {
            if (utils.checkForTitleAlreadyPresent(newNewsData, newsObj.title)) {
                return;
            }
            if (newsObj.imageHref == "image/images2.jpg") {
                newsObj.imageHref = "meta";
            } else {
                newsObj.imageHref = newsObj.imageHref;
            }
            newNewsData.push(newsObj);
        };

        var changeDatesToSameFormat = function(obj) {
            var n = obj.length;
            for (var i = 0; i < n; i++) {
                var d = new Date(obj[i].time);
                obj[i].time = d.toString();
            }
            return obj;
        };

        var moveFromTempToFinal = function() {
            for (var key in tempNewsData) {
                if (utils.checkForTitleAlreadyPresent(finalNewsData, tempNewsData[key].title)) {
                    continue;
                }
                finalNewsData.push(tempNewsData[key]);
            }
        };

        var moveFromNewNewsToFinal = function() {
            var i = newNewsData.length - 1;
            for (var key in newNewsData) {
                if (utils.checkForTitleAlreadyPresent(finalNewsData2, newNewsData[i].title)) {
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

        var render_function = function() {
            var feed_id_instance = document.getElementById(feedId);
            $("#twitter-wjs").remove();
            $(feed_id_instance).css("overflow-y", "scroll");
            $(feed_id_instance).addClass("news_display");

            console.log("render function called");
            var cityArr = JSON.parse(localStorage.getItem("cities"));

            var i = 0;
            $(feed_id_instance).html("");
            var haveSomeNews = 0;

            for (var key in finalNewsData2) {
                if (utils.checkMatchTwoArrays(cityArr, finalNewsData2[key].city)) {
                    if (finalNewsData2[i].imageHref == "meta") {
                        finalNewsData2[i].imageHref = "image/images2.jpg";
                    }
                    haveSomeNews = 1;
                    $(feed_id_instance).append(view.makeDiv(finalNewsData2[i]));
                }
                i++;
            }

            if (haveSomeNews == 0) {
                cityArr.push("other");
                var p = document.createElement("p");
                p.appendChild(document.createTextNode("Showing other news. "));
                $(feed_id_instance).append(p);
                i = 0;
                for (var key in finalNewsData2) {
                    if (utils.checkMatchTwoArrays(cityArr, finalNewsData2[key].city)) {
                        if (finalNewsData2[i].imageHref == "meta") {
                            finalNewsData2[i].imageHref = "image/images2.jpg";;
                        }
                        haveSomeNews = 1;
                        $(feed_id_instance).append(view.makeDiv(finalNewsData2[i]));
                    }
                    i++;
                }
            }

            $("img").unveil();
            $(feed_id_instance).scroll(function() {
                $("img").unveil();
            });
        };

        var make_final_array2_from_local = function(obj) {
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
            console.log(dataPresentInLocalStorage);
            // render_function();
            // twitterjs.render_tweets();
            // about.render_aboutus();
            $(".twitter_display").hide();
            $(".aboutus_display").hide();

            $(twitter_tab_instance).one("click", function() {
                $(slider_instance).hide();

                tabOpen = "twitter";
                twitterjs.render_tweets();
                $(twitter_tab_instance).addClass("tw_class");
                $(".news_display").hide();
                $(".aboutus_display").hide();
                $(".twitter_display").show();

                $(".tw_class").on("click", function() {
                    $(slider_instance).hide();
                    tabOpen = "twitter";
                    $(".news_display").hide();
                    $(".aboutus_display").hide();
                    $(".twitter_display").show();
                    // twitterjs.render_tweets();
                });
            });

            $(aboutus_tab_instance).one("click", function() {
                $(slider_instance).hide();

                tabOpen = "us";
                about.render_aboutus();
                $(aboutus_tab_instance).addClass("ab_class");
                $(".news_display").hide();
                $(".twitter_display").hide();
                $(".aboutus_display").show();

                $(".ab_class").on("click", function() {
                    $(slider_instance).hide();

                    tabOpen = "us";
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
                settingsPageOpen = true;
                $(feed_id_instance).scrollTop(0);
                $(feed_id_instance).html("");

                var div = document.createElement("div");
                div.setAttribute("class", "select_city");
                var span = document.createElement("span");
                span.setAttribute("style", "font-size: larger;");
                span.appendChild(document.createTextNode("Select city"));

                div.appendChild(span);
                $(feed_id_instance).append(div);;
                $(feed_id_instance).append(view.makeCheckboxForm());
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
                    settingsPageOpen = false;
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

        var initialBind = function() {
            if (typeof(Storage) !== "undefined") {
                var local_data = localStorage.getItem("data1");
                if (local_data) {
                    if (local_data == "") {
                        return;
                    }
                    dataPresentInLocalStorage = true;
                    var parsed_data = JSON.parse(local_data);
                    make_final_array2_from_local(parsed_data);
                    initialRender(parsed_data);
                }
            } else {}
        };

        var initialRender = function(obj) {
            console.log("initialRender");
            var cityArr = JSON.parse(localStorage.getItem("cities"));
            var feed_id_instance = document.getElementById(feedId);
            $(feed_id_instance).html("");
            $(feed_id_instance).attr("class", "loaded");

            //added changes
            $("#twitter-wjs").remove();
            $(feed_id_instance).css("overflow-y", "scroll");
            $(feed_id_instance).addClass("news_display");

            var i = 0;
            var x = Date.parse(obj[0].time);
            // previous_saved_date = obj[0].time;
            for (var key in obj) {
                var y = Date.parse(obj[i].time);
                if (utils.checkMatchTwoArrays(cityArr, obj[i].city)) {
                    $(feed_id_instance).append(view.makeDiv(obj[i]));
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
            utils.setCitiesToLocalStorage();

            noOfNewNews = 0;
            if (arguments.length > 0) {
                background_working = true;
                promiseArray = [];
                finalNewsData = [];
                console.log("got arguments");
            } else {
                if (dataPresentInLocalStorage == false) {

                    $(change_city_instance).hide();
                }
                //binding events on settings when we got data from local storage
                event_bind();
            }

            return new Promise(function(resolve, reject) {
                var head_displayInstance = document.getElementById(head_displayId);
                var feed_id_instance = document.getElementById(feedId);

                if (background_working == false) {
                    if (dataPresentInLocalStorage == false) {
                        $(feed_id_instance).addClass("loading");
                    }
                    $(slider_instance).hide();
                } else {}

                // call crawl function for news links
                for (var key in input_data.data) {
                    crawlFunction("rss", input_data.data[key].url, input_data.data[key].priority);
                }

                Promise.all(promiseArray).then(function() {
                    if ((background_working == true) || (dataPresentInLocalStorage == true)) {

                        console.log("noOfNewNews: " + noOfNewNews);
                        if (noOfNewNews > 0) {
                            console.log("background_working");
                            promiseArray = [];
                            newNewsData.sort(function(a, b) {
                                return Number(Date.parse(b.time)) - Number(Date.parse(a.time));
                            });
                            moveFromNewNewsToFinal();
                            var checkForSlideDown = 0;
                            var temp_i = newNewsData.length - 1;

                            do {
                                if (settingsPageOpen == true) {} else {
                                    var cityArr = JSON.parse(localStorage.getItem("cities"));
                                    if (utils.checkMatchTwoArrays(cityArr, newNewsData[temp_i].city)) {
                                        $(feed_id_instance).prepend(view.makeDiv(newNewsData[temp_i]));
                                        checkForSlideDown = 1;
                                    }
                                }
                                crawlForImageLinkFromMeta(newNewsData[temp_i].newsHref, temp_i);
                                temp_i--;
                            }
                            while (temp_i >= 0);

                            if (checkForSlideDown == 1) {
                                checkForSlideDown = 0;
                                if (tabOpen == "news") {
                                    $(slider_instance).slideDown();
                                }
                            }

                            Promise.all(promiseArray).then(function() {
                                // previous_saved_date = finalNewsData2[0].time;
                                var data = JSON.stringify(finalNewsData2);
                                newNewsData = [];
                                localStorage.setItem("data1", data);
                                console.log(Date.parse(finalNewsData2[0].time));
                                localStorage.setItem("previousDate", Date.parse(finalNewsData2[0].time));
                                promiseArray = [];
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
                        moveFromTempToFinal();
                        finalNewsData = changeDatesToSameFormat(finalNewsData);
                        finalNewsData.sort(function(a, b) {
                            return a.priority - b.priority;
                        });
                        finalNewsData.sort(function(a, b) {
                            return Number(Date.parse(b.time)) - Number(Date.parse(a.time));
                        });
                        finalNewsData2 = finalNewsData;
                        $(feed_id_instance).attr("class", "loaded");
                        render_function();
                        promiseArray = [];
                        for (var key in tempNewsData) {
                            crawlForImageLinkFromMeta(tempNewsData[key].newsHref, key);
                        }
                        Promise.all(promiseArray).then(function() {
                            console.log("done");
                            previous_saved_date = finalNewsData2[0].time;
                            localStorage.setItem("previousDate", Date.parse(previous_saved_date));
                            $(change_city_instance).show();
                            var x = JSON.stringify(finalNewsData2);
                            localStorage.setItem("data1", x);
                            promiseArray = [];
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
