function info_handler() {

    jQuery('#info-box').slideToggle()
}


function setup() {
    jQuery('#info').click(info_handler);
    $("#datepicker").datepicker();
}

jQuery(document).ready(setup);
