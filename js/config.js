(function(window) {
    var config = {
        'head_displayId': 'head_display',
        'feedId': 'feed',
        'change_city': 'change_city',
        'slider': 'slider',
        'max_news_per_site': 100,
        'number_of_news_in_single_page': 10,
        'timeout': 40,
        'input_data2': {
            "data": [
                { "priority": 1, "url": "http://www.cnbc.com/id/10000115/device/rss/rss.html", "type": "rss" },
                // { "priority": 2, "url": "https://news.google.com/news?cf=all&hl=en&pz=1&ned=in&q=real+estate+india&output=rss", "type": "rss" },
                { "priority": 4, "url": "http://realty.economictimes.indiatimes.com/rss/topstories", "type": "rss" },
                { "priority": 5, "url": "http://realty.economictimes.indiatimes.com/rss/recentstories", "type": "rss" },
                // { "priority": 6, "url": "http://realty.economictimes.indiatimes.com/rss/residential", "type": "rss" },
                // { "priority": 7, "url": "http://realty.economictimes.indiatimes.com/rss/commercial", "type": "rss" },
                // { "priority": 8, "url": "http://realty.economictimes.indiatimes.com/rss/retail", "type": "r ss" },
                // { "priority": 10, "url": "http://realty.economictimes.indiatimes.com/rss/regulatory", "type": "rss" },
                // { "priority": 11, "url": "http://realty.economictimes.indiatimes.com/rss/industry", "type": "rss" },
                // { "priority": 12, "url": "http://realty.economictimes.indiatimes.com/rss/technology", "type": "rss" },
                // { "priority": 13, "url": "http://realty.economictimes.indiatimes.com/rss/allied-industries", "type": "rss" },
                // { "priority": 14, "url": "http://feeds2.feedburner.com/rismedia/lgnb", "type": "rss" },
                // { "priority": 15, "url": "http://feeds.feedburner.com/RISMedia", "type": "rss" },
                // { "priority": 20, "url": "http://feeds2.feedburner.com/RismediaTechnology", "type": "rss" },
                // { "priority": 21, "url": "http://feeds2.feedburner.com/RismediaTodaysHomeSpunWisdom", "type": "rss" },
                // { "priority": 22, "url": "http://feeds2.feedburner.com/RismediaTodaysMarketplace", "type": "rss" },
                // { "priority": 23, "url": "http://feeds2.feedburner.com/RismediaTodaysTopStory", "type": "rss" },
                // { "priority": 24, "url": "http://feeds2.feedburner.com/RismediaConsumerNewsAndAdvice", "type": "rss" },
                // { "priority": 25, "url": "http://feeds2.feedburner.com/RismediaHomeBuying101", "type": "rss" },
                // { "priority": 26, "url": "http://feeds2.feedburner.com/RismediaTodaysHomeSpunWisdom", "type": "rss" },
                // { "priority": 27, "url": "http://feeds2.feedburner.com/RismediaTodaysTopStory-Consumer", "type": "rss" },
                // { "priority": 28, "url": "http://www.propertywire.com/rss-feed/news/", "type": "rss" },
                { "priority": 29, "url": "http://www.jdsupra.com/resources/syndication/docsRSSfeed.aspx?ftype=RealEstate", "type": "rss" }
            ]
        },
        'city': [
            "agra", "jaipur", "gurgaon",
            "ghaziabad", "pune", "mumbai",
            "chandigarh", "bangalore", "haryana",
            "delhi", "punjab", "rajasthan",
            "maharashtra", "assam", "bihar",
            "goa", "gujarat", "himachal pradesh",
            "karnataka", "kerala", "uttar pradesh",
            "other"
        ],
        // 'city': ["delhi", "chandigarh", "pune", "mumbai", "noida", "ghaziabad", "bangalore", "gurgaon"],
        'state': [
            "haryana", "delhi", "punjab", "rajasthan", "maharashtra",
            "assam", "bihar", "goa", "gujarat", "himachal pradesh", "karnataka",
            "kerala", "uttar pradesh"
        ]
    };

    window.config = config;

})(window);
