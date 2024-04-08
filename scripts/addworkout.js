async function giveUserBadge(exerciseType, currentUser) {
    var weightlifting_count = (await currentUser.collection("exerciseCounter").doc("exercises").get()).get("weightlifting");
    var yoga_count = (await currentUser.collection("exerciseCounter").doc("exercises").get()).get("yoga");
    var running_count = (await currentUser.collection("exerciseCounter").doc("exercises").get()).get("running");
    var walking_count = (await currentUser.collection("exerciseCounter").doc("exercises").get()).get("walking");
    var cycling_count = (await currentUser.collection("exerciseCounter").doc("exercises").get()).get("cycling");
    var badge = null;
    var badge_name = null;
    if (exerciseType == "weightlifting") {
        if (weightlifting_count === 20) {
            badge = "./images/weightliftingplatinum.svg";
            badge_name = "platinum weightlifting badge";
        } else if (weightlifting_count === 15) {
            badge = "./images/weightliftinggold.svg";
            badge_name = "gold weightlifting badge";
        } else if (weightlifting_count === 10) {
            badge = "./images/weightliftingsilver.svg";
            badge_name = "silver weightlifting badge";
        } else if (weightlifting_count === 5) {
            badge = "./images/weightliftingbronze.svg";
            badge_name = "bronze weightlifting badge";
        } else {
            badge = null;
            badge_name = null;
        }
    } else if (exerciseType == "yoga") {
        if (yoga_count === 20) {
            badge = "./images/yogaplatinum.svg";
            badge_name = "platinum yoga badge";
        } else if (yoga_count === 15) {
            badge = "./images/yogagold.svg";
            badge_name = "gold yoga badge";
        } else if (yoga_count === 10) {
            badge = "./images/yogasilver.svg";
            badge_name = "silver yoga badge";
        } else if (yoga_count === 5) {
            badge = "./images/yogabronze.svg";
            badge_name = "bronze yoga badge";
        } else {
            badge = null;
            badge_name = null;
        }
    } else if (exerciseType == "running") {
        if (running_count === 20) {
            badge = "./images/runningplatinum.svg";
            badge_name = "platinum running badge";
        } else if (running_count === 15) {
            badge = "./images/runninggold.svg";
            badge_name = "gold running badge"
        } else if (running_count === 10) {
            badge = "./images/runningsilver.svg";
            badge_name = "silver running badge"
        } else if (running_count === 5) {
            badge = "./images/runningbronze.svg";
            badge_name = "bronze running badge"
            console.log(running_count)
        } else {
            badge = null;
            badge_name = null;
            console.log("!!!!")
        }
    } else if (exerciseType == "walking") {
        if (walking_count === 20) {
            badge = "./images/walkingplatinum.svg";
            badge_name = "platinum walking badge";
        } else if (walking_count === 15) {
            badge = "./images/walkinggold.svg";
            badge_name = "gold walking badge";
        } else if (walking_count === 10) {
            badge = "./images/walkingsilver.svg";
            badge_name = "silver walking badge";
        } else if (walking_count === 5) {
            badge = "./images/walkingbronze.svg";
            badge_name = "bronze walking badge";
        } else {
            badge = null;
            badge_name = null;
        }
    } else if (exerciseType == "cycling") {
        if (cycling_count === 20) {
            badge = "./images/cyclingplatinum.svg";
            badge_name = "platinum cycling badge";
        } else if (cycling_count === 15) {
            badge = "./images/cyclinggold.svg";
            badge_name = "gold cycling badge";
        } else if (cycling_count === 10) {
            badge = "./images/cyclingsilver.svg";
            badge_name = "silver cycling badge";
        } else if (cycling_count === 5) {
            badge = "./images/cyclingbronze.svg";
            badge_name = "bronze cycling badge";
        } else {
            badge = null;
            badge_name = null;
        }
    }

    return [badge, badge_name];


}

function getCaloriesBurned(exerciseType, startDate, endDate, exercise_intensity, currentUser) {
    const startTime = new Date(startDate);
    const endTime = new Date(endDate);
    const difference = (endTime - startTime) / (1000 * 60); // Difference in minutes

    return new Promise((resolve, reject) => {
        currentUser.get().then(userDoc => {
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
            resolve(calories); // Resolve the promise with calories

        }).catch(error => {
            console.log("Error getting document:", error);
            reject(error); // Reject the promise on error
        });

    });
}

async function countTheExercises(exercise_type, currentUser) {
    currentUser.collection("exerciseCounter").doc("exercises").get().then((exerciseCounter) => {
        if (exerciseCounter.exists) {
            if (exerciseCounter.data()[exercise_type] == undefined || exerciseCounter.data()[exercise_type] == null || exerciseCounter.data()[exercise_type] == 0) {
                console.log("here")
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
                let exerciseCount = parseInt(exerciseCounter.data()[exercise_type]);
                currentUser.collection("exerciseCounter").doc("exercises").update({
                    [exercise_type]: 1 + exerciseCount,
                });
            }

        }
        else {
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

function removeBadges(currentUser, exerciseType, exerciseCount) {
    if (exerciseCount == 5) {
        currentUser.collection("workouts").where("earned_name", "==", `bronze ${exerciseType} badge`).get().then((removedWorkout) => {
            removedWorkout.forEach(workout => {
                currentUser.collection("workouts").doc(workout.id).update({ earned_name: null, earned: null })
            })
        })
    } else if (exerciseCount == 10) {
        currentUser.collection("workouts").where("earned_name", "==", `silver ${exerciseType} badge`).get().then((removedWorkout) => {
            removedWorkout.forEach(workout => {
                currentUser.collection("workouts").doc(workout.id).update({ earned_name: `bronze ${exerciseType} badge`, earned: `./images/${exerciseType}bronze.svg` })
            })
        })
    } else if (exerciseCount == 15) {
        currentUser.collection("workouts").where("earned_name", "==", `gold ${exerciseType} badge`).get().then((removedWorkout) => {
            removedWorkout.forEach(workout => {
                currentUser.collection("workouts").doc(workout.id).update({ earned_name: `silver ${exerciseType} badge`, earned: `./images/${exerciseType}silver.svg` })
            })
        })

    } else if (exerciseCount == 20) {
        currentUser.collection("workouts").where("earned_name", "==", `platinum ${exerciseType} badge`).get().then((removedWorkout) => {
            removedWorkout.forEach(workout => {
                currentUser.collection("workouts").doc(workout.id).update({ earned_name: `gold ${exerciseType} badge`, earned: `./images/${exerciseType}gold.svg` })
            })
        })
    }
}

async function decreaseExerciseCount(exercise_type, currentUser) {
    currentUser.collection("exerciseCounter").doc("exercises").update({
        [exercise_type]: firebase.firestore.FieldValue.increment(-1)
    })
        .then(() => {
            currentUser.collection("exerciseCounter").doc("exercises").get().then((doc) => {
                exerciseCount = doc.data()[exercise_type]
                removeBadges(currentUser, exercise_type, exerciseCount + 1)
            });
        })
        .catch((error) => {
            console.error("Error updating document: ", error);
        });

}

async function addWorkout(currentUser, history_id = "", updateWorkoutType = "") {

    startDate = jQuery("#startDate").val();
    endDate = jQuery("#endDate").val();
    verifyStartDate = new Date(startDate);
    verifyEndDate = new Date(endDate);

    exercise_type = jQuery("#exercises").val();
    console.log(verifyEndDate - verifyStartDate)
    if ((verifyEndDate - verifyStartDate) > 0) {
        jQuery("#add_workout").css("display", "none");
        jQuery('#confirmAddWorkout').css("display", "flex").delay(3000).hide(0);
        jQuery('#homepage').toggle();
        jQuery("#workoutWarning").css("display", "none");

        if (exercise_type != "" && startDate != "" && endDate != "" && jQuery(".intensity").val() != "") {
            if (history_id == "") {
                unique_id = currentUser.collection("workouts").doc().id;
                history_id = "history" + unique_id;
            }
            else {
                await decreaseExerciseCount(updateWorkoutType, currentUser);

            }
            await countTheExercises(exercise_type, currentUser);
            let exercise_intensity = intensityHandler(exercise_type);
            let calories_burned = parseInt(await getCaloriesBurned(exercise_type, startDate, endDate, exercise_intensity, currentUser));
            let badges_earned = await giveUserBadge(exercise_type, currentUser);
            let start_Date = firebase.firestore.Timestamp.fromDate(new Date(startDate));
            let end_Date = firebase.firestore.Timestamp.fromDate(new Date(endDate));



            console.log(history_id);
            currentUser.collection("workouts").doc(history_id).set({
                exerciseType: exercise_type,
                startDate: start_Date,
                endDate: end_Date,
                intensity: intensity,
                calories: calories_burned,
                earned: badges_earned[0],
                earned_name: badges_earned[1]
            }, { merge: true })
                .then(() => {
                    console.log("Document successfully updated!");
                    location.reload();
                })
                .catch((error) => {
                    console.error("Error updating document: ", error);
                });

        }
    }
    else {
        jQuery("#workoutWarning").css("display", "flex");
    }
}

function addWorkoutHandler() {
    if (jQuery('#add_workout').css("display") == "none") {
        $("#exercises").val("weightlifting");
        $("#startDate").val("");
        $("#endDate").val("");
        $("#intensity-div").css("display", "flex");
        $("#distance-div").css("display", "none");
        $("#save_workout_button").css("display", "block");
        $("#update_workout_button").css("display", "none");
        jQuery("#homepage-icon").attr('src', './images/nav-icons/home-black.svg')
        jQuery("#calender-icon").attr('src', './images/nav-icons/calender-black.svg')
        jQuery("#leaderboard-icon").attr('src', './images/nav-icons/leaderboard-black.svg')
        jQuery("#activity-icon").attr('src', './images/nav-icons/activity-feed-black.svg')
        jQuery("#settings-icon").attr('src', './images/nav-icons/setting-black.svg')
        jQuery("#add-workout-icon").attr('src', './images/nav-icons/add-workout-white.svg')
        jQuery('#usernameAndPic').css('display', 'none')
        jQuery('#filter-and-search').css('display', 'none')
        jQuery('#add_workout').toggle()
        jQuery('#homepage').css("display", "none");
        jQuery('#leaderboard').css("display", "none");
        jQuery('#activity_feed').css("display", "none");
        jQuery('#settings').css("display", "none");
        jQuery('#filter_activity').css("display", "none");
        jQuery('#profile_info').css("display", "none");
        jQuery('#datepicker').css("display", "none");
    }
}

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


function removeWorkout(currentUser, historyId) {
    currentUser.collection("workouts").doc(historyId).get().then((doc) => {
        if (doc.exists) {
            exercise = doc.data().exerciseType
            currentUser.collection("exerciseCounter").doc("exercises").get().then((doc) => {
                exerciseCount = doc.data()[exercise]
                currentUser.collection("exerciseCounter").doc("exercises").update({
                    [exercise]: exerciseCount - 1,
                    [exercise]: exerciseCount - 1,
                });
                removeBadges(currentUser, exercise, exerciseCount);
                currentUser.collection("workouts").doc(historyId).delete().then(() => {
                    location.reload();

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

function toLocalISOString(date) {
    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000));
    return adjustedDate.toISOString().slice(0, 16);
}

function updateworkoutHandler(currentUser, historyID) {
    currentUser.collection("workouts").doc(historyID).get()
        .then(userDoc => {
            addWorkoutHandler()
            console.log(historyID)
            jQuery("#save_workout_button").css("display", "none");
            jQuery("#update_workout_button").css("display", "block");
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
            jQuery("#update_workout_button").click(function () { addWorkout(CurrentUser, historyID, workoutType) });
        })
}