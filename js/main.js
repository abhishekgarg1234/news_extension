(function(config, app) {

    app.initialBind();

    var time_out = 1000 * config.timeout;

    function temp() {
        if (arguments.length == 0) {

            app.bindForm().then(function(data) {
                setTimeout(function() {
                    temp(1);
                }, time_out);
            });
        } else {
            app.bindForm(1).then(function(data) {
                setTimeout(function() {
                    temp(1);
                }, time_out);
            });
        }
    };
    temp();

})(window.config, window.app);
