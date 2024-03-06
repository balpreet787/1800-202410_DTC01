function info_handler() {

    jQuery('#info-box').slideToggle()
}
function redirect_to_login() {
    window.location.href = 'login.html';
}


function setup() {
    jQuery('#info').click(info_handler);
    $('#login').click(redirect_to_login);
    $('#signup').click(redirect_to_login);

    $("#datepicker").datepicker();
}

jQuery(document).ready(setup);
