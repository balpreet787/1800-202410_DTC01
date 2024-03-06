function info_handler() {

    jQuery('#info-box').slideToggle()
}
function redirect_to_login() {
    window.location.href = 'login.html';
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
    $('#login').click(redirect_to_login);
    $('#signup').click(redirect_to_login);

    $("#datepicker").datepicker();
}

jQuery(document).ready(setup);
