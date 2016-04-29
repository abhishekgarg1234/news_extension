(function(window) {
    var utils = (function(document) {

        var words_to_check_for_news = config.words_to_check;
        var cities_list = config.city;
        var state_to_check = config.state;

        var setCitiesToLocalStorage = function() {
            if (localStorage.getItem("cities")) {
                console.log("cities local storage already present");
            } else {
                console.log(cities_list);
                localStorage.setItem("cities", JSON.stringify(cities_list));
            }
        };

        var removePunchuations = function(str) {
            str = str.replace(/\s+/g, '');
            str = str.replace(/\'/g, "");
            str = str.replace(/\"/g, "");
            str = str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
            str = str.replace(/\?/g, "");
            return str;
        };

        var checkMatchTwoArrays = function(city_arr1, final_arr) {
            var check = 0;
            if (final_arr == "other") {
                final_arr = ["other"];
            }
            for (var key in final_arr) {
                for (var key1 in city_arr1) {
                    if (city_arr1[key1] == final_arr[key]) {
                        check = 1;
                    }
                }
            }
            return check;
        };

        var change_time_type_fn = function(input_time) {
            //return a string with ago;
            var ans;
            var d = new Date();
            d = Number(d);

            var d2 = Date.parse(input_time);
            // console.log("parse: " + d2);
            var diff = d - d2;
            diff = parseInt((diff / 1000) / 60);
            if (diff < 60) {
                ans = diff + " minutes ago";
            } else if (diff >= 60 && diff < 1440) {
                var min = diff % 60;
                diff = parseInt(diff / 60);
                ans = diff + " hours ago";
            } else if (diff >= 1440 && diff < 43200) {
                var days = parseInt((diff / 60) / 24);
                ans = days + " days ago";
            } else {
                ans = input_time;
                // input_time=input_time.toString();
                // ans = input_time.substr(0, 24);
            }

            return ans;
        };

        var find_city = function(str) {
            var temp = 0;
            var ans = false;
            str = str.toLowerCase();
            for (var key in cities_list) {
                if (str.indexOf(cities_list[key]) != -1) {
                    if (temp == 0) {
                        temp = 1;
                        ans = [];
                    }
                    ans.push(cities_list[key]);
                }
            }

            return ans;
        };

        var find_state = function(str) {
            var temp = 0;
            var ans = false;
            str = str.toLowerCase();
            for (var key in state_to_check) {
                if (str.indexOf(state_to_check[key]) != -1) {
                    if (temp == 0) {
                        temp = 1;
                        ans = [];
                    }
                    ans.push(state_to_check[key]);
                }
            }
            return ans;
        };

        var getCityOfNewsFromDetails = function(title, description, news_href) {
            var ans = [];
            var city_from_title = find_city(title);
            var city_from_description = find_city(description);
            // var city_from_image_href = find_city(image_href);
            var city_from_news_href = find_city(news_href);
            if (city_from_title) {
                for (var key in city_from_title) {
                    if (ans.indexOf(city_from_title) == -1) {
                        ans.push(city_from_title[key]);
                    }
                }
            }
            if (city_from_description) {
                for (var key in city_from_description) {
                    if (ans.indexOf(city_from_description) == -1) {
                        ans.push(city_from_description[key]);
                    }
                }
            }
            if (city_from_news_href) {
                for (var key in city_from_news_href) {
                    if (ans.indexOf(city_from_news_href[key]) == -1) {
                        ans.push(city_from_news_href[key]);
                    }
                }
            }

            if (ans.length == 0) {
                return "other";
            } else {
                return ans;
            }
        };

        var getStateOfNewsFromDetails = function(title, description, news_href) {
            var state_from_title = find_state(title);
            var state_from_description = find_state(description);
            var state_from_news_href = find_state(news_href);
            if (state_from_title) {
                return state_from_title;
            } else if (state_from_description) {
                return state_from_description;
            } else if (state_from_news_href) {
                return state_from_news_href;
            } else {
                return "global state";
            }
        };

        var checkForTitleAlreadyPresent = function(data, title) {
            for (var key in data) {
                if (data[key].title == title) {
                    return 1;
                }
            }
            return 0;
        };

        var checkForNewshrefAlreadypresent = function(data, newsHref) {
            for (var key in data) {
                if (data[key].newsHref == newsHref) {
                    return 1;
                }
            }
            return 0;
        };

        var checkForImagehrefAlreadypresent = function(data, imageHref) {
            for (var key in data) {
                if (data[key].imageHref == imageHref) {
                    return 1;
                }
            }
            return 0;
        };

        return {
            setCitiesToLocalStorage: setCitiesToLocalStorage,
            removePunchuations: removePunchuations,
            checkMatchTwoArrays: checkMatchTwoArrays,
            change_time_type_fn:change_time_type_fn,
            getCityOfNewsFromDetails: getCityOfNewsFromDetails,
            getStateOfNewsFromDetails: getStateOfNewsFromDetails,
            checkForTitleAlreadyPresent: checkForTitleAlreadyPresent,
            checkForNewshrefAlreadypresent: checkForNewshrefAlreadypresent,
            checkForImagehrefAlreadypresent: checkForImagehrefAlreadypresent
        };

    })(window.document);

    window.utils = utils;
})(window);
