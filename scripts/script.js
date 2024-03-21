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

async function give_user_badge(exerciseType) {
    return new Promise((resolve, reject) => {
        firebase.auth().onAuthStateChanged(async (user) => {
            if (user) {
                var uid = user.uid;
                var weightlifting_count = (await db.collection("users").doc(uid).collection("exerciseCounter").doc("exercises").get()).get("weightlifting");
                var yoga_count = (await db.collection("users").doc(uid).collection("exerciseCounter").doc("exercises").get()).get("yoga");
                var running_count = (await db.collection("users").doc(uid).collection("exerciseCounter").doc("exercises").get()).get("running");
                var walking_count = (await db.collection("users").doc(uid).collection("exerciseCounter").doc("exercises").get()).get("walking");
                var cycling_count = (await db.collection("users").doc(uid).collection("exerciseCounter").doc("exercises").get()).get("cycling");
                var badge = null;

                if (exerciseType == "weightlifting") {
                    if (weightlifting_count >= 20) {
                        badge = "platinum weightlifting badge";
                    } else if (weightlifting_count >= 15) {
                        badge = "gold weightlifting badge";
                    } else if (weightlifting_count >= 10) {
                        badge = "silver weightlifting badge";
                    } else if (weightlifting_count >= 5) {
                        badge = "bronze weightlifting badge";
                    }
                } else if (exerciseType == "yoga") {
                    if (yoga_count >= 20) {
                        badge = "platinum yoga badge";
                    } else if (yoga_count >= 15) {
                        badge = "gold yoga badge";
                    } else if (yoga_count >= 10) {
                        badge = "silver yoga badge";
                    } else if (yoga_count >= 5) {
                        badge = "bronze yoga badge";
                    }
                } else if (exerciseType == "running") {
                    if (running_count >= 20) {
                        badge = "platinum running badge";
                    } else if (running_count >= 15) {
                        badge = "gold running badge";
                    } else if (running_count >= 10) {
                        badge = "silver running badge";
                    } else if (running_count >= 5) {
                        badge = "bronze running badge";
                    }
                } else if (exerciseType == "walking") {
                    if (walking_count >= 20) {
                        badge = "platinum walking badge";
                    } else if (walking_count >= 15) {
                        badge = "gold walking badge";
                    } else if (walking_count >= 10) {
                        badge = "silver walking badge";
                    } else if (walking_count >= 5) {
                        badge = "bronze walking badge";
                    }
                } else if (exerciseType == "cycling") {
                    if (cycling_count >= 20) {
                        badge = "platinum cycling badge";
                    } else if (cycling_count >= 15) {
                        badge = "gold cycling badge";
                    } else if (cycling_count >= 10) {
                        badge = "silver cycling badge";
                    } else if (cycling_count >= 5) {
                        badge = "bronze cycling badge";
                    }
                } else {
                    badge = null;
                }

                resolve(badge);

                try {
                    // Code to be executed
                } catch (error) {
                    // Error handling
                    reject(error);
                }
            }
        });
    });
}



function get_calories_burned(exerciseType, startDate, endDate, exercise_intensity) {
    const startTime = new Date(startDate);
    const endTime = new Date(endDate);
    const difference = (endTime - startTime) / (1000 * 60); // Difference in minutes

    return new Promise((resolve, reject) => {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                // User is signed in, you can get the user ID.
                const currentUser = db.collection("users").doc(user.uid); // Go to the Firestore document of the user
                currentUser.get().then(userDoc => {
                    if (userDoc.exists) {
                        // Get the document data
                        const userData = userDoc.data();
                        const user_weight = userData.weight;
                        let calories; // Define calories here so it's accessible throughout
                        let met = 0; // Initialize met to avoid reference errors

                        if (exerciseType === "Weightlifting" || exerciseType === "yoga") {
                            calories = exercise_intensity * user_weight * (difference / 60);
                        } else if (exerciseType === "running") {
                            calories = exercise_intensity * user_weight;
                        } else if (exerciseType === "walking") {
                            calories = .354 * exercise_intensity * user_weight * (difference / 60);
                        } else {
                            const speed = exercise_intensity / (difference / 60); // Speed in your desired unit per hour
                            if (speed <= 16.0) {
                                met = 4;
                            } else if (speed <= 19.0) {
                                met = 6;
                            } else if (speed > 19.0) {
                                met = 8;
                            }
                            calories = met * user_weight * (difference / 60);
                        }
                        console.log(calories, met);
                        resolve(calories); // Resolve the promise with calories
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


async function exercise_counter(exercise_type) {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            var uid = user.uid;
            // User is signed in, you can get the user ID.
            db.collection("users").doc(uid).collection("exerciseCounter").doc("exercises").get().then((exerciseCounter) => {
                console.log(exerciseCounter.exists)
                if (exerciseCounter.exists) {
                    if (exerciseCounter.data()[exercise_type] == undefined || exerciseCounter.data()[exercise_type] == null) {
                        db.collection("users").doc(uid).collection("exerciseCounter").doc("exercises").set({
                            [exercise_type]: 1,
                        }, { merge: true })
                            .then(() => {
                                console.log("done");
                            })
                            .catch((error) => {
                                console.error("Error updating document: ", error);
                            });;
                    }
                    else {
                        let exerciseCount = parseInt(exerciseCounter.data()[exercise_type]);
                        db.collection("users").doc(uid).collection("exerciseCounter").doc("exercises").update({
                            [exercise_type]: 1 + exerciseCount,
                        });
                    }

                }
                else {
                    db.collection("users").doc(uid).collection("exerciseCounter").doc("exercises").set({
                        [exercise_type]: 1,
                    }, { merge: true })
                        .then(() => {
                            console.log("done");
                        })
                        .catch((error) => {
                            console.error("Error updating document: ", error);
                        });;
                }
            }).then(() => {
                console.log("done")
            }).catch((error) => {
                console.error("Error fetching documents: ", error);
            });

        } else {
            // No user is signed in.
            console.log("No user is signed in.");
        }
    });
}


async function addWorkout() {
    startDate = jQuery("#startDate").val();
    endDate = jQuery("#endDate").val();
    exercise_type = jQuery("#exercises").val();
    await exercise_counter(exercise_type);
    if (exercise_type != "" && startDate != "" && endDate != "" && jQuery(".intensity").val() != "") {
        console.log(exercise_type)
        if (exercise_type == "weightlifting") {
            intensity = jQuery("#intensity").val();
            console.log(intensity)
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
        else if (exercise_type == "yoga") {
            intensity = jQuery("#intensity").val();
            console.log(intensity)
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
            intensity = jQuery("#distance").val();
            console.log(intensity)
            exercise_intensity = parseFloat(jQuery("#distance").val())
        }
        let calories_burned = await get_calories_burned(exercise_type, startDate, endDate, exercise_intensity);
        let badges_earned = await give_user_badge(exercise_type);
        let start_Date = firebase.firestore.Timestamp.fromDate(new Date(startDate));
        let end_Date = firebase.firestore.Timestamp.fromDate(new Date(endDate));


        console.log(calories_burned)
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
                        exerciseType: exercise_type,
                        startDate: start_Date,
                        endDate: end_Date,
                        intensity: intensity,
                        calories: calories_burned,
                        earned: badges_earned,
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
                jQuery("#name-goes-here").text(userName); // jQuery
            })
        } else {
            console.log("No user is logged in."); // Log a message when no user is logged in
        }
    });
}


function insertHomepageInfoFromFirestore() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            // User is signed in, you can get the user ID.
            var uid = user.uid;
            console.log(uid);
            var todays_date = new Date(new Date().toDateString());
            var dates = [];
            var current_date = todays_date.getDay();
            var start_of_week = new Date(todays_date);
            start_of_week.setDate(start_of_week.getDate() - current_date);
            var number_of_workouts = 0;
            var calories_in_a_week = 0;

            for (i = 0; i < 7; i++) {
                var start_date = new Date(start_of_week);
                start_date.setDate(start_date.getDate() + i);
                dates.push(start_date.toDateString());
            }

            db.collection("users").doc(uid).collection("workouts").where('startDate', '>=', start_of_week).get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    var workoutDate = new Date(doc.data().startDate.toDate().toDateString());
                    if(dates.includes(workoutDate.toDateString())) {
                        calories_in_a_week += doc.data().calories;
                        console.log(calories_in_a_week)
                    }
                    jQuery("#calories-go-here").text(calories_in_a_week);
                });
            });

            db.collection("users").doc(uid).collection("workouts").where('startDate', '>=', start_of_week).get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    var workoutDate = new Date(doc.data().startDate.toDate().toDateString());
                    if (dates.includes(workoutDate.toDateString())) {
                        number_of_workouts++;
                    }
                    jQuery("#workout-number-goes-here").text(number_of_workouts);
                });

            });
        }
    });
}

function insertTodaysWorkoutInfoFromFirestore() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            var uid = user.uid;
            console.log(uid);
            var selected_date = new Date();
            var selected_endDay = new Date();
            selected_date.setHours(0, 0, 0, 0);
            selected_endDay.setHours(23, 59, 59, 999);
            var firebase_Startdate = firebase.firestore.Timestamp.fromDate(selected_date);
            var firebase_Enddate = firebase.firestore.Timestamp.fromDate(selected_endDay);
            var todays_time = 0;
            var todays_calories = 0;
            var todays_workouts = 0;

            db.collection("users").doc(user.uid).collection('workouts').where('startDate', '>=', firebase_Startdate).where('startDate', '<=', firebase_Enddate).get().then(recordedWorkout => {
                recordedWorkout.forEach(workouts => {
                    todays_time += (workouts.data().endDate - workouts.data().startDate) / 60;
                    jQuery("#todays-time-goes-here").text(todays_time);
                })
            })

            db.collection("users").doc(user.uid).collection('workouts').where('startDate', '>=', firebase_Startdate).where('startDate', '<=', firebase_Enddate).get().then(recordedWorkout => {
                recordedWorkout.forEach(workouts => {
                    todays_calories += workouts.data().calories
                    jQuery("#todays-calories-go-here").text(todays_calories);
                })
            })

            db.collection("users").doc(user.uid).collection('workouts').where('startDate', '>=', firebase_Startdate).where('startDate', '<=', firebase_Enddate).get().then(recordedWorkout => {
                recordedWorkout.forEach(workouts => {
                    todays_workouts ++;
                    jQuery("#todays-workouts-go-here").text(todays_workouts);
                })
            })

        }
    })
}

function insertYesterdaysWorkoutInfoFromFirestore() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            var uid = user.uid;
            console.log(uid);
            var yesterdays_date = new Date();
            var yesterdays_end = new Date();
            yesterdays_date.setDate(yesterdays_date.getDate() - 1);
            yesterdays_end.setDate(yesterdays_end.getDate() - 1)
            yesterdays_date.setHours(0, 0, 0, 0);
            yesterdays_end.setHours(23, 59, 59, 999);
            var firebase_Startdate = firebase.firestore.Timestamp.fromDate(yesterdays_date);
            var firebase_Enddate = firebase.firestore.Timestamp.fromDate(yesterdays_end);
            var yesterdays_time = 0;
            var yesterdays_calories = 0;
            var yesterdays_workouts = 0;

            db.collection("users").doc(user.uid).collection('workouts').where('startDate', '>=', firebase_Startdate).where('startDate', '<=', firebase_Enddate).get().then(recordedWorkout => {
                recordedWorkout.forEach(workouts => {
                    yesterdays_time += (workouts.data().endDate - workouts.data().startDate) / 60;
                    jQuery("#yesterdays-time-goes-here").text(yesterdays_time);
                })
            })

            db.collection("users").doc(user.uid).collection('workouts').where('startDate', '>=', firebase_Startdate).where('startDate', '<=', firebase_Enddate).get().then(recordedWorkout => {
                recordedWorkout.forEach(workouts => {
                    yesterdays_calories += workouts.data().calories
                    jQuery("#yesterdays-calories-go-here").text(yesterdays_calories);
                })
            })

            db.collection("users").doc(user.uid).collection('workouts').where('startDate', '>=', firebase_Startdate).where('startDate', '<=', firebase_Enddate).get().then(recordedWorkout => {
                recordedWorkout.forEach(workouts => {
                    yesterdays_workouts ++;
                    jQuery("#yesterdays-workouts-go-here").text(yesterdays_workouts);
                })
            })

        }
    })
}

async function get_leaderboard_data() {
    $("#leaderboardInfo").empty();
    let weekValue = $('#week').val();
    console.log(weekValue);
    const [year, weekNumber] = weekValue.split('-W').map(Number);
    const janFirst = new Date(year, 0, 1);
    const daysToAdd = (weekNumber - 1) * 7 - janFirst.getDay();
    const weekStart = new Date(janFirst);
    weekStart.setDate(janFirst.getDate() + daysToAdd);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    const firestoreStartDate = firebase.firestore.Timestamp.fromDate(weekStart);
    const firestoreEndDate = firebase.firestore.Timestamp.fromDate(weekEnd);
    let leaderboardID = undefined;
    let friendIDs = [];
    let leaderboardinfo = {};
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("users").doc(user.uid);
            currentUser.get().then(userDoc => {
                leaderboardID = userDoc.data().leaderboardID;
                db.collection('users').where('leaderboardID', '==', leaderboardID)
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            friendIDs.push(doc.id)
                        });

                        let leaderboardpromises = friendIDs.map(function (id) {
                            console.log(id);
                            return db.collection("users").doc(id).get().then(userinfo => {
                                let nickname = userinfo.data().nickname;
                                leaderboardinfo[nickname] = {
                                    "calories": 0, "badges": ""
                                };
                                return db.collection("users").doc(id).collection('workouts').where('startDate', '>=', firestoreStartDate).get().then(historydoc => {
                                    historydoc.forEach(historydata => {
                                        if (historydata.data().startDate <= firestoreEndDate) {
                                            leaderboardinfo[nickname]["calories"] += parseInt(historydata.data().calories);
                                            leaderboardinfo[nickname]["badges"] = historydata.data().earned + " ";
                                        }
                                    });
                                });
                            });
                        });
                        Promise.all(leaderboardpromises).then(() => {
                            i = 0;
                            let calories_in_order = (Object.keys(leaderboardinfo).map(nickname => leaderboardinfo[nickname]["calories"])).sort().reverse();
                            console.log(calories_in_order);
                            for (index = 0; index < calories_in_order.length; index++) {
                                for (let nickname in leaderboardinfo) {
                                    if (leaderboardinfo[nickname]["calories"] === calories_in_order[index]) {
                                        text_to_inject = `<div class="grid grid-cols-4 text-center place-items-center bg-[#fff6e5] m-4 rounded-lg p-3">
                                    <span class="grid grid-cols-2 text-center place-items-center"> <span>${i + 1}.</span><img class="w-8 h-8"
                                            src="./images/profile_pic.svg" alt=""></span>
                                    <span>${nickname}</span>
                                    <span class="grid grid-cols-2 gap-2"><img class="w-6 h-6" src="./images/dumbbell1.svg" alt=""> <img
                                            class="w-6 h-6" src="./images/dumbbell1.svg" alt=""></span>
                                    <span>${leaderboardinfo[nickname]["calories"]}</span>
                                </div>`
                                        $('#leaderboardInfo').append(text_to_inject);
                                        i++
                                        delete leaderboardinfo[nickname];
                                        break;
                                    }

                                }
                            }

                        }).catch(error => {
                            console.error("Error processing all user data: ", error);
                        });
                    })
                    .catch((error) => {
                        console.error("Error getting documents: ", error);
                    });
            })
        } else {
            console.log("No user is logged in.");
        }
    });
}

function populateUserInfo() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        if (user) {

            //go to the correct user document by referencing to the user uid
            currentUser = db.collection("users").doc(user.uid)
            //get the document for current user.
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
        } else {
            // No user is signed in.
            console.log("No user is signed in");
        }
    });
}

function show_recorded_workouts() {
    $("#recorded_workouts").empty();
    input_date = $('#selectedDate').val();
    selected_date = new Date(input_date);
    selected_endDay = new Date(input_date);
    selected_date.setHours(0, 0, 0, 0);

    selected_endDay.setHours(23, 59, 59, 999);
    firebase_Startdate = firebase.firestore.Timestamp.fromDate(selected_date);
    firebase_Enddate = firebase.firestore.Timestamp.fromDate(selected_endDay);
    console.log(firebase_Enddate);
    console.log(firebase_Startdate);
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            db.collection("users").doc(user.uid).collection('workouts').where('startDate', '>=', firebase_Startdate).where('startDate', '<=', firebase_Enddate).get().then(recordedWorkout => {
                recordedWorkout.forEach(workouts => {
                    if (workouts.data().exerciseType == 'weightlifting' || workouts.data().exerciseType == 'yoga') {
                        $("#recorded_workouts").append(
                            `<div class="flex flex-row justify-evenly">
                            <div class="flex flex-col justify-evenly  text-[16px] p-4">
                            <span>Workout: ${workouts.data().exerciseType}</span>
                            <span>Intensity: ${workouts.data().intensity}</span>
                            </div>
                            <div class="flex flex-col justify-evenly  text-[16px] p-4">
                            <span>Calories burned: ${workouts.data().calories}</span>
                            <span>KM: ${(workouts.data().endDate - workouts.data().startDate) / 60} mins</span>
                            </div>
                        </div>`
                        );
                    }
                    else {
                        $("#recorded_workouts").append(
                            `<div>
                            Workout: ${workouts.data().exerciseType}

                        </div>`
                        );
                    }
                })
            });
        }
    });

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
        jQuery('#intensity-div').css("display", "none");
    }
    else {
        jQuery('#distance-div').css("display", "none");
        jQuery('#intensity-div').css("display", "flex");
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
    populateUserInfo();
    if (jQuery('#profile_info').css("display") == "none") {
        jQuery('#profile_info').toggle()
        jQuery('#add_workout').css("display", "none");
        jQuery('#homepage').css("display", "none");
        jQuery('#leaderboard').css("display", "none");
        jQuery('#activity_feed').css("display", "none");
        jQuery('#settings').css("display", "none");
    }
}

function leaderboard_current_date() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const weekNumber = Math.ceil(((currentDate - new Date(currentDate.getFullYear(), 0, 1)) / 86400000 + new Date(currentDate.getFullYear(), 0, 1).getDay() + 1) / 7);
    const formattedWeekNumber = weekNumber.toString().padStart(2, '0');
    $('#week').val(`${year}-W${formattedWeekNumber}`);
}

function show_workout_page_date() {
    const currentDate = new Date();
    $('#selectedDate').val(currentDate.toISOString().split('T')[0]);
}

function setup() {

    leaderboard_current_date();
    show_workout_page_date();
    show_recorded_workouts();
    $('#week').change(get_leaderboard_data)
    $('#selectedDate').change(show_recorded_workouts);
    get_leaderboard_data();
    insertNameFromFirestore();
    insertHomepageInfoFromFirestore();
    insertTodaysWorkoutInfoFromFirestore();
    insertYesterdaysWorkoutInfoFromFirestore();
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


    jQuery("#save_workout_button").click(addWorkout);
    jQuery("#save_profile_info_button").click(updateInfo);
}

jQuery(document).ready(setup);




