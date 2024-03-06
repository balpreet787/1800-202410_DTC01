function info_handler() {
    jQuery('#info-box').slideToggle()
}

function homepage_handler() {
    if (jQuery('#homepage').css("display") == "none") {
        jQuery('#homepage').toggle();
        jQuery('#leaderboard').css("display", "none");
        jQuery('#activity_feed').css("display", "none");
        jQuery('#datepicker').css("display", "none");
        jQuery('#settings').css("display", "none");
    }
}

function leaderboard_handler() {
    if (jQuery('#leaderboard').css("display") == "none") {
    jQuery('#leaderboard').toggle();
    jQuery('#homepage').css("display", "none");
    jQuery('#activity_feed').css("display", "none");
    jQuery('#datepicker').css("display", "none");
    jQuery('#settings').css("display", "none");
    }
}

function activity_handler() {
    if (jQuery('#activity_feed').css("display") == "none") {
    jQuery('#activity_feed').toggle();
    jQuery('#homepage').css("display", "none");
    jQuery('#leaderboard').css("display", "none");
    jQuery('#datepicker').css("display", "none");
    jQuery('#settings').css("display", "none");
    }
}

function calendar_handler() {
    if (jQuery('#datepicker').css("display") == "none") {
    jQuery('#datepicker').toggle()
    jQuery('#homepage').css("display", "none");
    jQuery('#leaderboard').css("display", "none");
    jQuery('#activity_feed').css("display", "none");
    jQuery('#settings').css("display", "none");
    }
}

function settings_handler() {
    if (jQuery('#settings').css("display") == "none") {
    jQuery('#settings').toggle()
    jQuery('#homepage').css("display", "none");
    jQuery('#leaderboard').css("display", "none");
    jQuery('#activity_feed').css("display", "none");
    jQuery('#datepicker').css("display", "none");
    }
}

function setup() {
    jQuery('#info').click(info_handler);
    jQuery('#homepage_button').click(homepage_handler);
    jQuery('#leaderboard_button').click(leaderboard_handler);
    jQuery('#activity_button').click(activity_handler);
    jQuery('#calendar_button').click(calendar_handler);
    jQuery('#settings_button').click(settings_handler);
    $("#datepicker").datepicker();
}

jQuery(document).ready(setup);
