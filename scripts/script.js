
function updateInfo() {
    nickname = jQuery("#nickname").val();
    gender = jQuery("#gender").val();
    height = jQuery("#height").val();
    weight = jQuery("#weight").val();
    leaderboardID = jQuery("#leaderboard_id").val();
    dob = jQuery("#dob").val();

    if (nickname != "" && height != "" && weight != "" && leaderboardID != "" && dob != "")

        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                // User is signed in, you can get the user ID.
                var uid = user.uid;
                db.collection("users").doc(uid).set({
                    nickname: nickname,
                    gender: gender,
                    height: height,
                    weight: weight,
                    dob: dob,
                    leaderboardID: leaderboardID,
                }, { merge: true })
                    .then(() => {
                        console.log("Document successfully updated!");
                        jQuery('#homepage').toggle();
                        jQuery("#profile_info").css("display", "none");
                        jQuery('#settings').toggle();
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
}


function get_calories_burned(exerciseType, startDate, endDate, exercise_intensity) {
    startTime = new Date(startDate);
    endTime = new Date(endDate);
    difference = (endTime - startTime) / (1000 * 60);

    return new Promise((resolve, reject) => {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                // User is signed in, you can get the user ID.
                const currentUser = db.collection("users").doc(user.uid); // Go to the Firestore document of the user
                currentUser.get().then(userDoc => {
                    if (userDoc.exists) {
                        // Get the document data
                        const userData = userDoc.data();
                        user_height = userData.height;
                        user_weight = userData.weight;
                        user_intensity = userData.exercise_intensity

                        if (exerciseType == "Weightlifting" || exerciseType == "yoga") {
                            calories = exercise_intensity * user_weight * (difference / 60);
                        }
                        else if (exerciseType == "running") {
                            calories = exercise_intensity * user_weight;
                        }
                        else if (exerciseType == "walking") {
                            calories = .354 * exercise_intensity * user_weight;
                        }
                        else if (exerciseType == "cycling") {
                            speed = exercise_intensity / (difference / 60);
                            if (speed <= 16.0) {
                                met = 4;
                            }
                            else if (speed <= 19.0) {
                                met = 6;
                            }
                            else if (speed > 19.0) {
                                met = 8;
                            }
                            calories = met * user_weight * (difference / 60);
                        }
                        resolve(calories); // Resolve the promise with height and weight
                    } else {
                        console.log("No such document!");
                        reject("No such document!"); // Reject the promise if the document doesn't exist
                    }
                }).catch(error => {
                    console.log("Error getting document:", error);
                    reject(error); // Reject the promise on error
                });
            } else {
                // No user is signed in.
                console.log("No user is signed in.");
                reject("No user is signed in."); // Reject the promise if no user is signed in
            }
        });
    });
}


async function addWorkout() {
    exerciseType = jQuery("#exercises").val();
    startDate = jQuery("#startDate").val();
    endDate = jQuery("#endDate").val();





    if (exerciseType != "" && startDate != "" && endDate != "" && jQuery(".intensity").val() != "") {
        if (exerciseType == "Weightlifting") {
            intensity = jQuery("#intensity").val();
            if (intensity == "Light") {
                exercise_intensity = 3
            }
            else if (intensity == "Moderate") {
                exercise_intensity = 5
            }
            else if (intensity == "Hard") {
                exercise_intensity = 6
            }
            else if (intensity == "Very-hard") {
                exercise_intensity = 7
            }
        }
        else if (exerciseType == "yoga") {
            intensity = jQuery("#intensity").val();
            if (intensity == "Light") {
                exercise_intensity = 2.5
            }
            else if (intensity == "Moderate") {
                exercise_intensity = 4
            }
            else if (intensity == "Hard") {
                exercise_intensity = 6
            }
            else if (intensity == "Very-hard") {
                exercise_intensity = 7
            }
        }
        else {
            exercise_intensity = parseFloat(jQuery("#distance").val())
        }
        calories_burned = await get_calories_burned(exerciseType, startDate, endDate, exercise_intensity);
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                // User is signed in, you can get the user ID.
                var uid = user.uid;
                console.log(uid)
                let history_doc = []; // Assuming this is initialized earlier in your code
                let history_num;
                db.collection("users").doc(uid).collection("workouts").get().then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        history_doc.push(doc.id);
                    });

                    // Now that we have the documents, we can work with them here
                    console.log(history_doc.length);
                    if (history_doc.length == 0) {
                        history_num = "history1";
                    } else {
                        history_num = "history" + (history_doc.length + 1).toString();
                    }
                    console.log(history_num);
                    db.collection("users").doc(uid).collection("workouts").doc(history_num).set({
                        exerciseType: exerciseType,
                        startDate: startDate,
                        endDate: endDate,
                        intensity: intensity,
                        calories: calories_burned,
                    }, { merge: true })
                        .then(() => {
                            console.log("Document successfully updated!");
                            jQuery('#homepage').toggle();
                            jQuery("#add_workout").css("display", "none");
                            jQuery('#activity_feed').toggle();
                        })
                        .catch((error) => {
                            console.error("Error updating document: ", error);
                        });

                }).catch((error) => {
                    console.error("Error fetching documents: ", error);
                });


            } else {
                // No user is signed in.
                console.log("No user is signed in.");
            }
        });
    }
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
                document.getElementById("name-goes-here").innerText = userName;
            })
        } else {
            console.log("No user is logged in."); // Log a message when no user is logged in
        }
    })
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

function additional_information_handler() {
    if (jQuery(this).val() == "cycling" || jQuery(this).val() == "running" || jQuery(this).val() == "walking") {
        jQuery('#distance-div').css("display", "flex");
    }
    else {
        jQuery('#distance-div').css("display", "none");
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
    insertNameFromFirestore();
    jQuery('#info').click(info_handler);
    jQuery('#homepage_button').click(homepage_handler);
    jQuery('#leaderboard_button').click(leaderboard_handler);
    jQuery('#activity_button').click(activity_handler);
    jQuery('#calendar_button').click(calendar_handler);
    jQuery('#settings_button').click(settings_handler);
    jQuery('#add_workout_button').click(add_workout_handler);
    jQuery('#exercises').click(additional_information_handler)
    jQuery('#filter_button').click(filter_handler);
    jQuery('#cancel_button').click(activity_handler);
    jQuery('#profile_info_button').click(profile_info_handler);
    // jQuery('#save_profile_info_button').click(settings_handler);
    jQuery('#cancel_profile_info_button').click(settings_handler);
    //jQuery('#save_workout_button').click(homepage_handler);
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
                if (userDoc.exists) {
                    // Get the document data
                    const userData = userDoc.data();
                    // Check if the 'nickname' field exists
                    if (userData.nickname === undefined || userData.nickname === null) {
                        jQuery('#homepage, #leaderboard, #activity_feed, #datepicker, #settings').css("display", "none");
                        jQuery("#profile_info").css("display", "flex");
                    }
                } else {
                    console.log("No such document!");
                }
            }).catch(error => {
                console.log("Error getting document:", error);
            });

        } else {
            // No user is signed in.
            console.log("No user is signed in.");
        }
    });


    $("#datepicker").datepicker();
    jQuery("#save_workout_button").click(addWorkout);
    jQuery("#save_profile_info_button").click(updateInfo);
}

jQuery(document).ready(setup);
