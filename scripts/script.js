
function updateInfo() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // User is signed in, you can get the user ID.
            var uid = user.uid;

            db.collection("users").doc(uid).set({
                gender: jQuery("#gender").val(),
                height: jQuery("#height").val(),
                weight: jQuery("#weight").val(),
            }, { merge: true })
                .then(() => {
                    console.log("Document successfully updated!");
                })
                .catch((error) => {
                    // The document probably doesn't exist.
                    console.error("Error updating document: ", error);
                });
        } else {
            // No user is signed in.
            console.log("No user is signed in.");
        }
    });
    jQuery('#homepage').css("display", "flex")
    jQuery("#profile_info").css("display", "none")
}

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
    jQuery('#homepage_button').click(homepage_handler);
    jQuery('#leaderboard_button').click(leaderboard_handler);
    jQuery('#activity_button').click(activity_handler);
    jQuery('#calendar_button').click(calendar_handler);
    jQuery('#settings_button').click(settings_handler);
    $('#login').click(redirect_to_login);
    $('#signup').click(redirect_to_login);

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // User is signed in, you can get the user ID.
            currentUser = db.collection("users").doc(user.uid); // Go to the Firestore document of the user
            currentUser.get().then(userDoc => {
                // Get the user name
                if (currentUser.doc("nickname") === undefined) {
                    jQuery('#homepage').css("display", "none")
                    jQuery('#leaderboard').css("display", "none");
                    jQuery('#activity_feed').css("display", "none");
                    jQuery('#datepicker').css("display", "none");
                    jQuery('#settings').css("display", "none");
                    jQuery("#profile_info").css("display", "flex")
                    jQuery("#save").click(updateInfo)
                }
            })

        } else {
            // No user is signed in.
            console.log("No user is signed in.");
        }
    });

    $("#datepicker").datepicker();
}

jQuery(document).ready(setup);
