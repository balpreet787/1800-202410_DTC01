function info_handler() {

    jQuery('#info-box').slideToggle()
}

function setup() {
    jQuery('#info').click(info_handler);
}

jQuery(document).ready(setup);
