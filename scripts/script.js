/** Description: Manage user profile, authentication and functionality of the website */
var ImageFile;
var CurrentUser;

/** 
* Upload the image to the Cloud Storage
* @param {firebase.firestore.DocumentReference} postDocID: The document ID of the user
*/
function uploadPic(postDocID) {
    var storageRef = storage.ref("images/" + postDocID + ".jpg");
    storageRef.put(ImageFile)
        .then(function () {
            storageRef.getDownloadURL()
                .then(function (url) {
                    db.collection("users").doc(postDocID).set({
                        "image": url
                    }, { merge: true })
                        .then(function () {
                            homepageHandler();
                            insertMotivationalMessage(currentUser);
                            insertHomepageInfoFromFirestore(currentUser);
                            insertTodaysWorkoutInfoFromFirestore(currentUser);
                            insertYesterdaysWorkoutInfoFromFirestore(currentUser);
                            showRecordedWorkouts(currentUser);
                            getLeaderboardData(currentUser);
                            getActivityFeedInfo(currentUser);

                        })
                })
        })
        .catch(() => {
            console.log("error uploading to cloud storage");
        })
}

/**  
* Update the user information in the Firestore
* @param {firebase.firestore.DocumentReference} currentUser: The document of the current user
*/
async function updateInfo(currentUser) {

    $("#profile_info").css("display", "none");
    $('#settings').css("display", "none");
    var nickname = $("#nickname").val();
    var gender = $("#gender").val();
    var height = $("#height").val();
    var weight = $("#weight").val();
    var leaderboardID = $("#leaderboard_id").val();
    var dob = $("#dob").val();

    if (nickname != "" && height != "" && weight != "" && dob != "") {
        currentUser.set({
            nickname: nickname,
            gender: gender,
            height: height,
            weight: weight,
            dob: dob,
            leaderboardID: leaderboardID,
        }, { merge: true })
            .then(() => {
                if (ImageFile) {
                    uploadPic(currentUser.id);
                }
                else {
                    homepageHandler();
                    insertMotivationalMessage(currentUser);
                    insertHomepageInfoFromFirestore(currentUser);
                    insertTodaysWorkoutInfoFromFirestore(currentUser);
                    insertYesterdaysWorkoutInfoFromFirestore(currentUser);
                    showRecordedWorkouts(currentUser);
                    getLeaderboardData(currentUser);
                    getActivityFeedInfo(currentUser);
                }
            })
            .catch((error) => {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });
    }

}

/** 
* Insert the user information from Firestore to the profile page
* @param {firebase.firestore.DocumentReference} currentUser: The document of the current user
*/
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

/**
 * Show the app information on index page
 */
function infoHandler() {
    jQuery('#info-box').slideToggle()
}


/**
 * Show about us on settings section of the page
 */
function aboutUsHandler() {
    jQuery('#aboutUs-box').slideToggle()
}

/**
 * redirect to login page from index page
 */
function redirectToLogin() {
    window.location.href = 'login.html';
}

/**
 * redirect to index page after user logs out
 */
function redirectToSignup() {
    window.location.href = 'index.html';
}

/**
 *  Logout the user
 */
function logout() {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        console.log("logging out user");
    }).catch((error) => {
        console.log(error);
    });
}

/**
 * Display the setting section of the page and do nothing if it is already displayed
 */
function settingsHandler() {
    if (jQuery('#settings').css("display") == "none") {
        jQuery("#homepage-icon").attr('src', './images/nav-icons/home-black.svg')
        jQuery("#calender-icon").attr('src', './images/nav-icons/calender-black.svg')
        jQuery("#leaderboard-icon").attr('src', './images/nav-icons/leaderboard-black.svg')
        jQuery("#activity-icon").attr('src', './images/nav-icons/activity-feed-black.svg')
        jQuery("#settings-icon").attr('src', './images/nav-icons/setting-white.svg')
        jQuery("#add-workout-icon").attr('src', './images/nav-icons/add-workout-black.svg')
        jQuery('#settings').toggle()
        jQuery('#filter-and-search, #username-and-pic, #homepage, #leaderboard, #activity-feed, #datepicker, #add_workout, #filter_activity, #profile_info').css('display', 'none')
    }
}

/**
 * Display the edit profile info section of the page
 */
function profileInfoHandler(currentUser) {
    populateUserInfo(currentUser);
    jQuery("#homepage-icon").attr('src', './images/nav-icons/home-black.svg')
    jQuery("#calender-icon").attr('src', './images/nav-icons/calender-black.svg')
    jQuery("#leaderboard-icon").attr('src', './images/nav-icons/leaderboard-black.svg')
    jQuery("#activity-icon").attr('src', './images/nav-icons/activity-feed-black.svg')
    jQuery("#settings-icon").attr('src', './images/nav-icons/setting-white.svg')
    jQuery("#add-workout-icon").attr('src', './images/nav-icons/add-workout-black.svg')
    jQuery('#username-and-pic, #filter-and-search, #profile_info, #add_workout, #homepage, #leaderboard, #activity-feed, #settings').css('display', 'none')
    jQuery('#profile_info').toggle()
}

/**
 * Authenticate the user and get the user Id to use for other documents
 * @param {Blob} image: The image element
 */
async function userAuthentication(image) {
    profilepic = undefined;
    return new Promise((resolve, reject) => {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                // User is signed in, you can get the user ID.
                let currentUser = db.collection("users").doc(user.uid); // Go to the Firestore document of the user

                currentUser.get().then(userDoc => {
                    if (userDoc.exists) {
                        // Get the document data
                        const userData = userDoc.data();
                        if (userData.nickname === undefined || userData.nickname === null) {
                            jQuery('#homepage, #leaderboard, #activity-feed, #datepicker, #settings, #username-and-pic').css("display", "none");
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
                    resolve(currentUser);
                }).catch(error => {
                    console.log("Error getting document:", error);
                    reject("No user is signed in.");
                });

            } else {
                // No user is signed in.
                console.log("No user is signed in.");
            }
        });
    });
}

/**
 * Manage all functions and event listeners
 */
async function setup() {
    leaderboardCurrentDate();
    showWorkoutPageDate();
    jQuery('#info').click(infoHandler);
    jQuery('#aboutUs').click(aboutUsHandler);
    jQuery('#homepage-icon').click(homepageHandler);
    jQuery('#leaderboard_button').click(leaderboardHandler);
    jQuery('#activity_button').click(activityHandler);
    jQuery('#calendar_button').click(calendarHandler);
    jQuery('#settings-button').click(settingsHandler);
    jQuery('#add_workout_button').click(addWorkoutHandler);
    jQuery('#exercises').change(additionalInformationHandler);// fix this
    jQuery('#filter-button').click(filterHandler);
    jQuery('#username-search-button').click(userSearchInActivityFeed)
    jQuery('.reset-button').click(resetFilteredActivityFeed);
    jQuery('.reset-filtered-page').click(resetFilteredActivityFeed);
    jQuery('#cancel_button').click(activityHandler);
    jQuery('#cancel_profile_info_button').click(settingsHandler);
    jQuery('#cancel_workout_button').click(homepageHandler);
    jQuery('#logout_button').click(redirectToSignup);
    jQuery('#logout_button').click(logout);
    $('#login').click(redirectToLogin);
    $('#signup').click(redirectToLogin);
    $("#view-feed-button").click(filterActivityFeed);
    var fileInput = $('#file-input');

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
    CurrentUser = await userAuthentication(image);
    insertMotivationalMessage(CurrentUser);
    insertNameAndPicFromFirestore(CurrentUser);
    insertHomepageInfoFromFirestore(CurrentUser);
    insertTodaysWorkoutInfoFromFirestore(CurrentUser);
    insertYesterdaysWorkoutInfoFromFirestore(CurrentUser);
    jQuery("#save_workout_button").click(function () { addWorkout(CurrentUser) });
    jQuery("#save_profile_info_button").click(function () { updateInfo(CurrentUser) });
    jQuery('#profile_info_button').click(function () { profileInfoHandler(CurrentUser) });
    jQuery('#homepagepic').click(function () { profileInfoHandler(CurrentUser) })
    jQuery('#logo').click(homepageHandler);
    showRecordedWorkouts(CurrentUser);
    $('#week').change(function () { getLeaderboardData(CurrentUser) })
    $('#selectedDate').change(function () { showRecordedWorkouts(CurrentUser) });
    getLeaderboardData(CurrentUser);
    getActivityFeedInfo(CurrentUser);
}

jQuery(document).ready(setup);
