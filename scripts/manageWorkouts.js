/* Description: This file contains the functions that are used to add, remove, edit a workout to the user's profile. */

/**  give user badges if they have completed a certain number of exercises
 * @param {string} exerciseType - the type of exercise the user has completed
 * @param {firebase.firestore.DocumentReference} currentUser - the current user's document reference
 * @returns {Promise<[string, string]>} - the badge and badge name that the user has earned
*/
async function giveUserBadge(exerciseType, currentUser) {
    // get the count of the exercises the user has completed
    var count = (await currentUser.collection("exerciseCounter").doc("exercises").get()).get(exerciseType);

    var badge = null;
    var badge_name = null;
    //check the type of exercise the user has completed and assign the badge accordingly
    if (exerciseType == "weightlifting") {
        if (count === 20) {
            badge = "./images/weightliftingplatinum.svg";
            badge_name = "platinum weightlifting badge";
        } else if (count === 15) {
            badge = "./images/weightliftinggold.svg";
            badge_name = "gold weightlifting badge";
        } else if (count === 10) {
            badge = "./images/weightliftingsilver.svg";
            badge_name = "silver weightlifting badge";
        } else if (count === 5) {
            badge = "./images/weightliftingbronze.svg";
            badge_name = "bronze weightlifting badge";
        } else {
            badge = null;
            badge_name = null;
        }
    } else if (exerciseType == "yoga") {
        if (count === 20) {
            badge = "./images/yogaplatinum.svg";
            badge_name = "platinum yoga badge";
        } else if (count === 15) {
            badge = "./images/yogagold.svg";
            badge_name = "gold yoga badge";
        } else if (count === 10) {
            badge = "./images/yogasilver.svg";
            badge_name = "silver yoga badge";
        } else if (count === 5) {
            badge = "./images/yogabronze.svg";
            badge_name = "bronze yoga badge";
        } else {
            badge = null;
            badge_name = null;
        }
    } else if (exerciseType == "running") {
        if (count === 20) {
            badge = "./images/runningplatinum.svg";
            badge_name = "platinum running badge";
        } else if (count === 15) {
            badge = "./images/runninggold.svg";
            badge_name = "gold running badge"
        } else if (count === 10) {
            badge = "./images/runningsilver.svg";
            badge_name = "silver running badge"
        } else if (count === 5) {
            badge = "./images/runningbronze.svg";
            badge_name = "bronze running badge"
            console.log(count)
        } else {
            badge = null;
            badge_name = null;
            console.log("!!!!")
        }
    } else if (exerciseType == "walking") {
        if (count === 20) {
            badge = "./images/walkingplatinum.svg";
            badge_name = "platinum walking badge";
        } else if (count === 15) {
            badge = "./images/walkinggold.svg";
            badge_name = "gold walking badge";
        } else if (count === 10) {
            badge = "./images/walkingsilver.svg";
            badge_name = "silver walking badge";
        } else if (count === 5) {
            badge = "./images/walkingbronze.svg";
            badge_name = "bronze walking badge";
        } else {
            badge = null;
            badge_name = null;
        }
    } else if (exerciseType == "cycling") {
        if (count === 20) {
            badge = "./images/cyclingplatinum.svg";
            badge_name = "platinum cycling badge";
        } else if (count === 15) {
            badge = "./images/cyclinggold.svg";
            badge_name = "gold cycling badge";
        } else if (count === 10) {
            badge = "./images/cyclingsilver.svg";
            badge_name = "silver cycling badge";
        } else if (count === 5) {
            badge = "./images/cyclingbronze.svg";
            badge_name = "bronze cycling badge";
        } else {
            badge = null;
            badge_name = null;
        }
    }

    return [badge, badge_name];


}

/**  get the calories burned by the user for a specific exercise
 * @param {string} exerciseType - the type of exercise the user has completed
 * @param {string} startDate - the start date of the exercise
 * @param {string} endDate - the end date of the exercise
 * @param {number} exercise_intensity - the intensity of the exercise
 * @param {firebase.firestore.DocumentReference} currentUser - the current user's document reference
 * @returns {Promise<number>} - the number of calories burned by the user
 * */
async function getCaloriesBurned(exerciseType, startDate, endDate, exercise_intensity, currentUser) {
    const startTime = new Date(startDate);
    const endTime = new Date(endDate);
    const difference = (endTime - startTime) / (1000 * 60);

    return new Promise((resolve, reject) => {
        currentUser.get().then(userDoc => {// get the user's weight
            const userData = userDoc.data();
            const user_weight = userData.weight;
            let calories;
            let met = 0;

            // calculate the calories burned based on the type of exercise
            if (exerciseType === "Weightlifting" || exerciseType === "yoga") {
                calories = exercise_intensity * user_weight * (difference / 60);
                console.log(calories, exercise_intensity, user_weight, difference / 60)
            } else if (exerciseType === "running") {
                calories = exercise_intensity * user_weight;
            } else if (exerciseType === "walking") {
                calories = .354 * exercise_intensity * user_weight * (difference / 60);
            } else {
                const speed = exercise_intensity / (difference / 60);
                if (speed <= 16.0) {
                    met = 4;
                } else if (speed <= 19.0) {
                    met = 6;
                } else if (speed > 19.0) {
                    met = 8;
                }
                calories = met * user_weight * (difference / 60);
            }
            resolve(calories);// return the calories burned
        }).catch(error => {
            console.log("Error getting document:", error);
            reject(error);
        });
    });
}
/**  count the number of exercises the user has completed and add new count appropriately to the firestore
 * @param {string} exerciseType - the type of exercise the user has completed
 * @param {firebase.firestore.DocumentReference} currentUser - the current user's document reference
 * */
async function countTheExercises(exercise_type, currentUser) {
    currentUser.collection("exerciseCounter").doc("exercises").get().then((exerciseCounter) => {// get the count of the exercises the user has completed
        if (exerciseCounter.exists) {
            if (exerciseCounter.data()[exercise_type] == undefined || exerciseCounter.data()[exercise_type] == null || exerciseCounter.data()[exercise_type] == 0) {
                console.log("here")
                // add the new exercise count to the firestore
                currentUser.collection("exerciseCounter").doc("exercises").set({
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
                // update the exercise count in the firestore
                let exerciseCount = parseInt(exerciseCounter.data()[exercise_type]);
                currentUser.collection("exerciseCounter").doc("exercises").update({
                    [exercise_type]: 1 + exerciseCount,
                });
            }

        }
        else {
            // add the new exercise count to the firestore if the user has not completed any exercises
            currentUser.collection("exerciseCounter").doc("exercises").set({
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
}

/**  get the intensity of the exercise the user has completed
 * @param {string} exercise_type - the type of exercise the user has completed
 * @returns {number} - the intensity of the exercise
 * */
function intensityHandler(exercise_type) {
    if (exercise_type == "weightlifting") {
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
            console.log(exercise_intensity, exercise_type)
        }
    }
    else if (exercise_type == "yoga") {
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
        intensity = jQuery("#distance").val();
        exercise_intensity = parseFloat(jQuery("#distance").val())
    }
    return exercise_intensity;
}

/**  remove the badges the user has earned if the user has edited or deleted a workout
 * @param {firebase.firestore.DocumentReference} currentUser - the current user's document reference
 * @param {string} exerciseType - the type of exercise the user has completed
 * @param {number} exerciseCount - the number of exercises the user has completed
 * */
function removeBadges(currentUser, exerciseType, exerciseCount) {
    if (exerciseCount == 5) {
        // remove the badge if the user has completed 5 exercises and edited or deleted the workout in the firebase
        currentUser.collection("workouts").where("earned_name", "==", `bronze ${exerciseType} badge`).get().then((removedWorkout) => {
            removedWorkout.forEach(workout => {
                currentUser.collection("workouts").doc(workout.id).update({ earned_name: null, earned: null })
            })
        })
    } else if (exerciseCount == 10) {
        // remove the badge if the user has completed 10 exercises and edited or deleted the workout in the firebase
        currentUser.collection("workouts").where("earned_name", "==", `silver ${exerciseType} badge`).get().then((removedWorkout) => {
            removedWorkout.forEach(workout => {
                currentUser.collection("workouts").doc(workout.id).update({ earned_name: `bronze ${exerciseType} badge`, earned: `./images/${exerciseType}bronze.svg` })
            })
        })
    } else if (exerciseCount == 15) {
        // remove the badge if the user has completed 15 exercises and edited or deleted the workout in the firebase
        currentUser.collection("workouts").where("earned_name", "==", `gold ${exerciseType} badge`).get().then((removedWorkout) => {
            removedWorkout.forEach(workout => {
                currentUser.collection("workouts").doc(workout.id).update({ earned_name: `silver ${exerciseType} badge`, earned: `./images/${exerciseType}silver.svg` })
            })
        })

    } else if (exerciseCount == 20) {
        // remove the badge if the user has completed 20 exercises and edited or deleted the workout in the firebase
        currentUser.collection("workouts").where("earned_name", "==", `platinum ${exerciseType} badge`).get().then((removedWorkout) => {
            removedWorkout.forEach(workout => {
                currentUser.collection("workouts").doc(workout.id).update({ earned_name: `gold ${exerciseType} badge`, earned: `./images/${exerciseType}gold.svg` })
            })
        })
    }
}

/**  decrease the number of exercises the user has completed if the user has edited or deleted a workout
 * @param {string} exercise_type - the type of exercise the user has completed
 * @param {firebase.firestore.DocumentReference} currentUser - the current user's document reference
 * */
async function decreaseExerciseCount(exercise_type, currentUser) {
    const exerciseCounterSnapshot = await currentUser.collection("exerciseCounter").doc("exercises").get();
    let exerciseCount = parseInt(exerciseCounterSnapshot.data()[exercise_type]);
    console.log(exerciseCount);

    // call removeBadges function to remove the badges accordingly
    removeBadges(currentUser, exercise_type, exerciseCount);
    await currentUser.collection("exerciseCounter").doc("exercises").update({
        [exercise_type]: exerciseCount - 1,
    });
}


/**  add a workout to the firebase
 * @param {firebase.firestore.DocumentReference} currentUser - the current user's document reference
 * @param {string} history_id - the id of the workout if the user called function to update the workout
 * @param {string} updateWorkoutType - the type of workout the user called function to update the workout
 * */
async function addWorkout(currentUser, history_id = "", updateWorkoutType = "") {
    startDate = jQuery("#startDate").val();
    endDate = jQuery("#endDate").val();
    verifyStartDate = new Date(startDate);
    verifyEndDate = new Date(endDate);
    exercise_type = jQuery("#exercises").val();

    if ((verifyEndDate - verifyStartDate) > 0) {
        jQuery("#add-workout, #workout-warning").css("display", "none");
        jQuery('#confirm-add-workout').css("display", "flex").delay(3000).hide(0);
        jQuery('#homepage').toggle();

        if (exercise_type != "" && startDate != "" && endDate != "" && jQuery(".intensity").val() != "") {
            if (updateWorkoutType == "") {
                unique_id = currentUser.collection("workouts").doc().id;
                history_id = "history" + unique_id;
                await countTheExercises(exercise_type, currentUser);// call countTheExercises function to count the number of exercises the user has completed
            }
            else if (updateWorkoutType != "" && updateWorkoutType != exercise_type) {
                await decreaseExerciseCount(updateWorkoutType, currentUser);
                await countTheExercises(exercise_type, currentUser);
            }
            else if (updateWorkoutType == exercise_type) {
                console.log("same")
            }
            // store the information of the workout the user has completed
            let exercise_intensity = intensityHandler(exercise_type);
            let calories_burned = parseInt(await getCaloriesBurned(exercise_type, startDate, endDate, exercise_intensity, currentUser));
            let badges_earned = await giveUserBadge(exercise_type, currentUser);
            let start_Date = firebase.firestore.Timestamp.fromDate(new Date(startDate));
            let end_Date = firebase.firestore.Timestamp.fromDate(new Date(endDate));

            currentUser.collection("workouts").doc(history_id).set({// add the workout to the firestore
                exerciseType: exercise_type,
                startDate: start_Date,
                endDate: end_Date,
                intensity: intensity,
                calories: calories_burned,
                earned: badges_earned[0],
                earned_name: badges_earned[1]
            }, { merge: true })
                .then(() => {
                    // call the functions to update the user's homepage, leaderboard, activity feed, and show the recorded workouts
                    homepageHandler();
                    console.log("Document successfully updated!");
                    insertMotivationalMessage(currentUser);
                    insertHomepageInfoFromFirestore(currentUser);
                    insertTodaysWorkoutInfoFromFirestore(currentUser);
                    insertYesterdaysWorkoutInfoFromFirestore(currentUser);
                    showRecordedWorkouts(currentUser);
                    getLeaderboardData(currentUser);
                    getActivityFeedInfo(currentUser);
                })
                .catch((error) => {
                    console.error("Error updating document: ", error);
                });

        }
    }
    else {
        jQuery("#workout-warning").css("display", "flex");
    }
}

/**  show add workout form when user clicks on the add workout button
 * */
function addWorkoutHandler() {
    if (jQuery('#add-workout').css("display") == "none") {
        $("#exercises").val("weightlifting");
        $("#startDate").val("");
        $("#endDate").val("");
        $("#intensity-div").css("display", "flex");
        $("#distance-div, #update-workout-button, #username-and-pic, #filter-and-search, #homepage, #leaderboard, #activity-feed, #settings, #filter-activity, #profile-info, #datepicker").css("display", "none");
        $("#save-workout-button").css("display", "block");
        jQuery("#homepage-icon").attr('src', './images/nav-icons/home-black.svg')
        jQuery("#calender-icon").attr('src', './images/nav-icons/calender-black.svg')
        jQuery("#leaderboard-icon").attr('src', './images/nav-icons/leaderboard-black.svg')
        jQuery("#activity-icon").attr('src', './images/nav-icons/activity-feed-black.svg')
        jQuery("#settings-icon").attr('src', './images/nav-icons/setting-black.svg')
        jQuery("#add-workout-icon").attr('src', './images/nav-icons/add-workout-white.svg')
        jQuery('#add-workout').toggle()
        jQuery('#homepage-label, #leaderboard-label, #activity-label, #calendar-label').css('color', 'black')
        jQuery('#add-workout-label').css('color', 'white')
    }
}

/**  show the distance or intensity field based on the exercise type selected by the user
 * */
function additionalInformationHandler() {
    if (jQuery(this).val() == "cycling" || jQuery(this).val() == "running" || jQuery(this).val() == "walking") {
        jQuery('#distance-div').css("display", "flex");
        jQuery('#intensity-div').css("display", "none");
    }
    else {
        jQuery('#distance-div').css("display", "none");
        jQuery('#intensity-div').css("display", "flex");
        jQuery('#intensity-div').css("flex-direction", "flex-row");
    }
}

/**  remove a workout from the firebase
 * @param {firebase.firestore.DocumentReference} currentUser - the current user's document reference
 * @param {string} historyId - the id of the workout the user wants to delete
 * */
function removeWorkout(currentUser, historyId) {
    currentUser.collection("workouts").doc(historyId).get().then((doc) => {// get the exercise type of the workout the user wants to delete
        if (doc.exists) {
            exercise = doc.data().exerciseType
            currentUser.collection("exerciseCounter").doc("exercises").get().then((doc) => {// get the count of the exercises the user has completed
                exerciseCount = doc.data()[exercise]
                currentUser.collection("exerciseCounter").doc("exercises").update({// update the exercise count in the firestore before deleting the workout
                    [exercise]: exerciseCount - 1,
                });
                removeBadges(currentUser, exercise, exerciseCount);
                currentUser.collection("workouts").doc(historyId).delete().then(() => {// delete the workout from the firestore
                    // call the functions to update the user's homepage, leaderboard, activity feed, and show the recorded workouts
                    calendarHandler();
                    console.log("Document successfully updated!");
                    insertMotivationalMessage(currentUser);
                    insertHomepageInfoFromFirestore(currentUser);
                    insertTodaysWorkoutInfoFromFirestore(currentUser);
                    insertYesterdaysWorkoutInfoFromFirestore(currentUser);
                    showRecordedWorkouts(currentUser);
                    getLeaderboardData(currentUser);
                    getActivityFeedInfo(currentUser);
                }).catch((error) => {
                    console.error("Error removing document: ", error);
                });
            });
        } else {
            console.log("No such document!");
        }
    }).catch((error) => {
        console.error("Error getting document:", error);
    });
}

/**  change the firebase date to local date
 * @param {Date} date - the date the user has selected
 * @returns {string} - the local date
 * */
function toLocalISOString(date) {
    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000));
    return adjustedDate.toISOString().slice(0, 16);
}

/**  update a workout in the firebase
 * @param {firebase.firestore.DocumentReference} currentUser - the current user's document reference
 * @param {string} historyID - the id of the workout user wants to update
 * */
function updateworkoutHandler(currentUser, historyID) {
    currentUser.collection("workouts").doc(historyID).get()// get the workout the user wants to update
        .then(userDoc => {
            addWorkoutHandler()
            console.log(historyID)
            jQuery("#save-workout-button").css("display", "none");
            jQuery("#update-workout-button").css("display", "block");
            //get the data fields of the user
            let workoutType = userDoc.data().exerciseType;
            let startDate = (userDoc.data().startDate).toDate();;
            let endDate = (userDoc.data().endDate).toDate();
            startDate = toLocalISOString(startDate);
            endDate = toLocalISOString(endDate);
            let intensity = userDoc.data().intensity
            $("#exercises").val(workoutType);
            $("#startDate").val(startDate);
            $("#endDate").val(endDate);
            if (workoutType == "weightlifting" || workoutType == "yoga") {
                $("#intensity").val(intensity);
                $("#intensity-div").css("display", "flex");
                $("#distance-div").css("display", "none");
            }
            else {
                $("#distance").val(intensity);
                $("#intensity-div").css("display", "none");
                $("#distance-div").css("display", "flex");
            }
            jQuery("#update-workout-button").click(function () { addWorkout(CurrentUser, historyID, workoutType) });
        })
}