async function give_user_badge(exerciseType, currentUser) {
    var weightlifting_count = (await currentUser.collection("exerciseCounter").doc("exercises").get()).get("weightlifting");
    var yoga_count = (await currentUser.collection("exerciseCounter").doc("exercises").get()).get("yoga");
    var running_count = (await currentUser.collection("exerciseCounter").doc("exercises").get()).get("running");
    var walking_count = (await currentUser.collection("exerciseCounter").doc("exercises").get()).get("walking");
    var cycling_count = (await currentUser.collection("exerciseCounter").doc("exercises").get()).get("cycling");
    var badge = null;
    var badge_name = null;
    if (exerciseType == "weightlifting") {
        if (weightlifting_count >= 20) {
            badge = "./images/weightliftingplatinum.svg";
            badge_name = "platinum weightlifting badge";
        } else if (weightlifting_count >= 15) {
            badge = "./images/weightliftinggold.svg";
            badge_name = "gold weightlifting badge";
        } else if (weightlifting_count >= 10) {
            badge = "./images/weightliftingsilver.svg";
            badge_name = "silver weightlifting badge";
        } else if (weightlifting_count >= 5) {
            badge = "./images/weightliftingbronze.svg";
            badge_name = "bronze weightlifting badge";
        }
    } else if (exerciseType == "yoga") {
        if (yoga_count >= 20) {
            badge = "./images/yogaplatinum.svg";
            badge_name = "platinum yoga badge";
        } else if (yoga_count >= 15) {
            badge = "./images/yogagold.svg";
            badge_name = "gold yoga badge";
        } else if (yoga_count >= 10) {
            badge = "./images/yogasilver.svg";
            badge_name = "silver yoga badge";
        } else if (yoga_count >= 5) {
            badge = "./images/yogabronze.svg";
            badge_name = "bronze yoga badge";
        }
    } else if (exerciseType == "running") {
        if (running_count >= 20) {
            badge = "./images/runningplatinum.svg";
            badge_name = "platinum running badge";
        } else if (running_count >= 15) {
            badge = "./images/runninggold.svg";
            badge_name = "gold running badge"
        } else if (running_count >= 10) {
            badge = "./images/runningsilver.svg";
            badge_name = "silver running badge"
        } else if (running_count >= 5) {
            badge = "./images/runningbronze.svg";
            badge_name = "bronze running badge"
        }
    } else if (exerciseType == "walking") {
        if (walking_count >= 20) {
            badge = "./images/walkingplatinum.svg";
            badge_name = "platinum walking badge";
        } else if (walking_count >= 15) {
            badge = "./images/walkinggold.svg";
            badge_name = "gold walking badge";
        } else if (walking_count >= 10) {
            badge = "./images/walkingsilver.svg";
            badge_name = "silver walking badge";
        } else if (walking_count >= 5) {
            badge = "./images/walkingbronze.svg";
            badge_name = "bronze walking badge";
        }
    } else if (exerciseType == "cycling") {
        if (cycling_count >= 20) {
            badge = "./images/cyclingplatinum.svg";
            badge_name = "platinum cycling badge";
        } else if (cycling_count >= 15) {
            badge = "./images/cyclinggold.svg";
            badge_name = "gold cycling badge";
        } else if (cycling_count >= 10) {
            badge = "./images/cyclingsilver.svg";
            badge_name = "silver cycling badge";
        } else if (cycling_count >= 5) {
            badge = "./images/cyclingbronze.svg";
            badge_name = "bronze cycling badge";
        }
    } else {
        badge = null;
        badge_number = null;
    }

    return [badge, badge_name];


}

function get_calories_burned(exerciseType, startDate, endDate, exercise_intensity, currentUser) {
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

async function exercise_counter(exercise_type, currentUser) {
    currentUser.collection("exerciseCounter").doc("exercises").get().then((exerciseCounter) => {
        if (exerciseCounter.exists) {
            if (exerciseCounter.data()[exercise_type] == undefined || exerciseCounter.data()[exercise_type] == null) {
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


async function addWorkout(currentUser) {
    startDate = jQuery("#startDate").val();
    endDate = jQuery("#endDate").val();
    exercise_type = jQuery("#exercises").val();
    await exercise_counter(exercise_type, currentUser);
    if (exercise_type != "" && startDate != "" && endDate != "" && jQuery(".intensity").val() != "") {
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
        let calories_burned = await get_calories_burned(exercise_type, startDate, endDate, exercise_intensity, currentUser);
        let badges_earned = await give_user_badge(exercise_type, currentUser);
        let start_Date = firebase.firestore.Timestamp.fromDate(new Date(startDate));
        let end_Date = firebase.firestore.Timestamp.fromDate(new Date(endDate));


        let history_doc = [];
        let history_num;
        currentUser.collection("workouts").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                history_doc.push(doc.id);
            });

            console.log(history_doc.length);
            if (history_doc.length == 0) {
                history_num = "history1";
            } else {
                history_num = "history" + (history_doc.length + 1).toString();
            }
            console.log(history_num);
            currentUser.collection("workouts").doc(history_num).set({
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
        }).catch((error) => {
            console.error("Error fetching documents: ", error);
        });
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
        jQuery('#datepicker').css("display", "none");
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
