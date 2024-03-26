var ImageFile;

function uploadPic(postDocID) {
    console.log("inside uploadPic " + postDocID);
    console.log(ImageFile)
    var storageRef = storage.ref("images/" + postDocID + ".jpg");

    storageRef.put(ImageFile)

        .then(function () {
            console.log('2. Uploaded to Cloud Storage.');
            storageRef.getDownloadURL()

                .then(function (url) {
                    console.log("3. Got the download URL.");

                    db.collection("users").doc(postDocID).set({
                        "image": url
                    }, { merge: true })
                        .then(function () {
                            console.log('4. Added pic URL to Firestore.');

                        })
                })
        })
        .catch((error) => {
            console.log("error uploading to cloud storage");
        })
}



async function updateInfo(currentUser) {

    var nickname = jQuery("#nickname").val();
    var gender = jQuery("#gender").val();
    var height = jQuery("#height").val();
    var weight = jQuery("#weight").val();
    var leaderboardID = jQuery("#leaderboard_id").val();
    var dob = jQuery("#dob").val();

    if (nickname != "" && height != "" && weight != "" && leaderboardID != "" && dob != "") {
        currentUser.set({
            nickname: nickname,
            gender: gender,
            height: height,
            weight: weight,
            dob: dob,
            leaderboardID: leaderboardID,
        }, { merge: true })
            .then(() => {
                uploadPic(currentUser.id);
                console.log("Document successfully updated!");
                jQuery('#homepage').toggle();
                jQuery("#profile_info").css("display", "none");
                jQuery('#settings').toggle();
                jQuery('#confirmProfileUpdate').css("display", "flex").delay(3000).hide(0);

            })
            .catch((error) => {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });
    }

}



function populateUserInfo(currentUser) {

    currentUser.get()
        .then(userDoc => {
            //get the data fields of the user
            let leaderboard_id = userDoc.data().leaderboardID;
            let nickname = userDoc.data().nickname;
            let dob = userDoc.data().dob;
            let email = userDoc.data().email;
            let height = userDoc.data().height;
            let weight = userDoc.data().weight;
            let gender = userDoc.data().gender;
            console.log(userDoc.data())
            //if the data fields are not empty, then write them in to the form.
            if (leaderboard_id != null) {
                $("#leaderboard_id").val(leaderboard_id);
            }
            if (nickname != null) {
                $("#nickname").val(nickname);
            }
            if (dob != null) {
                $("#dob").val(dob);
            }
            if (email != null) {
                $("#email").val(email);
            }
            if (height != null) {
                $("#height").val(height);
            }
            if (weight != null) {
                $("#weight").val(weight);
            }
            if (gender != null) {
                $("#gender").val(gender);
            }

        })

}


function info_handler() {

    jQuery('#info-box').slideToggle()
}


function aboutUs_handler() {

    jQuery('#aboutUs-box').slideToggle()
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

function profile_info_handler(currentUser) {
    populateUserInfo(currentUser);
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
    leaderboard_current_date();
    show_workout_page_date();
    jQuery('#info').click(info_handler);
    jQuery('#aboutUs').click(aboutUs_handler)
    jQuery('#homepage_button').click(homepage_handler);
    jQuery('#leaderboard_button').click(leaderboard_handler);
    jQuery('#activity_button').click(activity_handler);
    jQuery('#calendar_button').click(calendar_handler);
    jQuery('#settings_button').click(settings_handler);
    jQuery('#add_workout_button').click(add_workout_handler);
    jQuery('#exercises').change(additional_information_handler);// fix this
    jQuery('#filter_button').click(filter_handler);
    jQuery('#cancel_button').click(activity_handler);
    // jQuery('#save_profile_info_button').click(settings_handler);
    jQuery('#cancel_profile_info_button').click(settings_handler);
    //jQuery('#save_workout_button').click(homepage_handler);
    jQuery('#cancel_workout_button').click(homepage_handler);
    jQuery('#logout_button').click(redirect_to_signup);
    jQuery('#logout_button').click(logout);
    $('#login').click(redirect_to_login);
    $('#signup').click(redirect_to_login);
    $("#view-feed-button").click(filterActivityFeed);
    var fileInput = $('#file-input');
    let profilepic = undefined
    // Pointer #2: Select the image element
    var image = $('#pppreview');

    // When a change happens to the File Chooser Input
    fileInput.change(function (e) {
        // Retrieve the selected file
        ImageFile = e.target.files[0];
        console.log("File selected:", ImageFile); // Debugging

        // Check if a file was selected
        if (ImageFile) {
            // Create a blob URL for the selected image
            var blob = URL.createObjectURL(ImageFile);
            console.log("Blob URL:", blob); // Debugging

            // Display the image by setting the src attribute
            image.attr('src', blob);
        } else {
            console.log("No file selected");
            image.attr('src', '');
        }
    });
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // User is signed in, you can get the user ID.
            currentUser = db.collection("users").doc(user.uid); // Go to the Firestore document of the user
            currentUser.get().then(userDoc => {
                if (userDoc.exists) {
                    // Get the document data
                    const userData = userDoc.data();
                    if (userData.nickname === undefined || userData.nickname === null) {
                        jQuery('#homepage, #leaderboard, #activity_feed, #datepicker, #settings').css("display", "none");
                        jQuery("#profile_info").css("display", "flex");
                    }
                    if (userData.image === undefined || userData.image === null) {
                        profilepic = "./images/profile_pic.svg";
                    }
                    else {
                        profilepic = userData.image;
                    }
                } else {
                    console.log("No such document!");
                }
                image.attr('src', profilepic);
                jQuery("#save_workout_button").click(function () { addWorkout(currentUser) });
                jQuery("#save_profile_info_button").click(function () { updateInfo(currentUser) });
                jQuery('#profile_info_button').click(function () { profile_info_handler(currentUser) });
                homepage_handler(currentUser);
                show_recorded_workouts(currentUser);
                $('#week').change(function () { get_leaderboard_data(currentUser) })
                $('#selectedDate').change(function () { show_recorded_workouts(currentUser) });
                get_leaderboard_data(currentUser);
                insertNameAndPicFromFirestore(currentUser);
                insertHomepageInfoFromFirestore(currentUser);
                insertTodaysWorkoutInfoFromFirestore(currentUser);
                insertYesterdaysWorkoutInfoFromFirestore(currentUser);
                getActivityFeedInfo(currentUser);
            }).catch(error => {
                console.log("Error getting document:", error);
            });

        } else {
            // No user is signed in.
            console.log("No user is signed in.");
        }
    });

}

jQuery(document).ready(setup);



