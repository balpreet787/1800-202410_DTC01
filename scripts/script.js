
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

function redirect_to_signup() {
    window.location.href = 'index.html';
}

function logout() {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        console.log("logging out user");
    }).catch((error) => {
        // An error happened.
    });
}

function insertNameFromFirestore() {
    // Check if the user is logged in:
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            console.log(user.uid); // Let's know who the logged-in user is by logging their UID
            currentUser = db.collection("users").doc(user.uid); // Go to the Firestore document of the user
            currentUser.get().then(userDoc => {
                // Get the user name
                let userName = userDoc.data().name;
                console.log(userName);
                //$("#name-goes-here").text(userName); // jQuery
                document.getElementById("username").innerText = userName;
            })
        } else {
            console.log("No user is logged in."); // Log a message when no user is logged in
        }
    })
}

function homepage_handler() {
    if (jQuery('#homepage').css("display") == "none") {
        jQuery('#homepage').toggle();
        jQuery('#leaderboard').css("display", "none");
        jQuery('#activity_feed').css("display", "none");
        jQuery('#datepicker').css("display", "none");
        jQuery('#settings').css("display", "none");
        jQuery('#add_workout').css("display", "none");
        jQuery('#filter_activity').css("display", "none");
        jQuery('#profile_info').css("display", "none");
    }
}

function leaderboard_handler() {
    if (jQuery('#leaderboard').css("display") == "none") {
        jQuery('#leaderboard').toggle();
        jQuery('#homepage').css("display", "none");
        jQuery('#activity_feed').css("display", "none");
        jQuery('#datepicker').css("display", "none");
        jQuery('#settings').css("display", "none");
        jQuery('#add_workout').css("display", "none");
        jQuery('#filter_activity').css("display", "none");
        jQuery('#profile_info').css("display", "none");
    }
}

function activity_handler() {
    if (jQuery('#activity_feed').css("display") == "none") {
        jQuery('#activity_feed').toggle();
        jQuery('#homepage').css("display", "none");
        jQuery('#leaderboard').css("display", "none");
        jQuery('#datepicker').css("display", "none");
        jQuery('#settings').css("display", "none");
        jQuery('#add_workout').css("display", "none");
        jQuery('#filter_activity').css("display", "none");
        jQuery('#profile_info').css("display", "none");
    }
}

function calendar_handler() {
    if (jQuery('#datepicker').css("display") == "none") {
        jQuery('#datepicker').toggle()
        jQuery('#homepage').css("display", "none");
        jQuery('#leaderboard').css("display", "none");
        jQuery('#activity_feed').css("display", "none");
        jQuery('#settings').css("display", "none");
        jQuery('#add_workout').css("display", "none");
        jQuery('#filter_activity').css("display", "none");
        jQuery('#profile_info').css("display", "none");
    }
}

function settings_handler() {
    if (jQuery('#settings').css("display") == "none") {
        jQuery('#settings').toggle()
        jQuery('#homepage').css("display", "none");
        jQuery('#leaderboard').css("display", "none");
        jQuery('#activity_feed').css("display", "none");
        jQuery('#datepicker').css("display", "none");
        jQuery('#add_workout').css("display", "none");
        jQuery('#filter_activity').css("display", "none");
        jQuery('#profile_info').css("display", "none");
    }
}

function add_workout_handler() {
    if (jQuery('#add_workout').css("display") == "none") {
        jQuery('#add_workout').toggle()
        jQuery('#homepage').css("display", "none");
        jQuery('#leaderboard').css("display", "none");
        jQuery('#activity_feed').css("display", "none");
        jQuery('#settings').css("display", "none");
        jQuery('#filter_activity').css("display", "none");
        jQuery('#profile_info').css("display", "none");
    }
}

function filter_handler() {
    if (jQuery('#filter_activity').css("display") == "none") {
        jQuery('#filter_activity').toggle()
        jQuery('#add_workout').css("display", "none");
        jQuery('#homepage').css("display", "none");
        jQuery('#leaderboard').css("display", "none");
        jQuery('#activity_feed').css("display", "none");
        jQuery('#settings').css("display", "none");
        jQuery('#profile_info').css("display", "none");
    }
}

function profile_info_handler() {
    if (jQuery('#profile_info').css("display") == "none") {
        jQuery('#profile_info').toggle()
        jQuery('#add_workout').css("display", "none");
        jQuery('#homepage').css("display", "none");
        jQuery('#leaderboard').css("display", "none");
        jQuery('#activity_feed').css("display", "none");
        jQuery('#settings').css("display", "none");
    }
}




function setup() {
    jQuery('#info').click(info_handler);
    jQuery('#homepage_button').click(homepage_handler);
    jQuery('#leaderboard_button').click(leaderboard_handler);
    jQuery('#activity_button').click(activity_handler);
    jQuery('#calendar_button').click(calendar_handler);
    jQuery('#settings_button').click(settings_handler);
    jQuery('#add_workout_button').click(add_workout_handler);
    jQuery('#filter_button').click(filter_handler);
    jQuery('#cancel_button').click(activity_handler);
    jQuery('#profile_info_button').click(profile_info_handler);
    jQuery('#save_profile_info_button').click(settings_handler);
    jQuery('#cancel_profile_info_button').click(settings_handler);
    jQuery('#save_workout_button').click(homepage_handler);
    jQuery('#cancel_workout_button').click(homepage_handler);
    jQuery('#logout_button').click(redirect_to_signup);
    jQuery('#logout_button').click(logout);
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

insertNameFromFirestore();
jQuery(document).ready(setup);
