var ImageFile;

//------------------------------------------------
// So, a new post document has just been added
// and it contains a bunch of fields.
// We want to store the image associated with this post,
// such that the image name is the postid (guaranteed unique).
// 
// This function is called AFTER the post has been created, 
// and we know the post's document id.
//------------------------------------------------
function uploadPic(postDocID) {
    console.log("inside uploadPic " + postDocID);
    console.log(ImageFile)
    var storageRef = storage.ref("images/" + postDocID + ".jpg");

    storageRef.put(ImageFile)   //global variable ImageFile

        // AFTER .put() is done
        .then(function () {
            console.log('2. Uploaded to Cloud Storage.');
            storageRef.getDownloadURL()

                // AFTER .getDownloadURL is done
                .then(function (url) { // Get URL of the uploaded file
                    console.log("3. Got the download URL.");

                    // Now that the image is on Storage, we can go back to the
                    // post document, and update it with an "image" field
                    // that contains the url of where the picture is stored.
                    db.collection("users").doc(postDocID).set({
                        "image": url // Save the URL into users collection
                    }, { merge: true })
                        // AFTER .update is done
                        .then(function () {
                            console.log('4. Added pic URL to Firestore.');
                            // One last thing to do:
                            // save this postID into an array for the OWNER
                            // so we can show "my posts" in the future
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

async function give_user_badge(exerciseType, currentUser) {
    var weightlifting_count = (await currentUser.collection("exerciseCounter").doc("exercises").get()).get("weightlifting");
    var yoga_count = (await currentUser.collection("exerciseCounter").doc("exercises").get()).get("yoga");
    var running_count = (await currentUser.collection("exerciseCounter").doc("exercises").get()).get("running");
    var walking_count = (await currentUser.collection("exerciseCounter").doc("exercises").get()).get("walking");
    var cycling_count = (await currentUser.collection("exerciseCounter").doc("exercises").get()).get("cycling");
    var badge = null;
    console.log(walking_count)
    if (exerciseType == "weightlifting") {
        if (weightlifting_count >= 20) {
            badge = "./images/weightliftingplatinum.svg";
        } else if (weightlifting_count >= 15) {
            badge = "./images/weightliftinggold.svg";
        } else if (weightlifting_count >= 10) {
            badge = "./images/weightliftingsilver.svg";
        } else if (weightlifting_count >= 5) {
            badge = "./images/weightliftingbronze.svg";
        }
    } else if (exerciseType == "yoga") {
        if (yoga_count >= 20) {
            badge = "./images/yogaplatinum.svg";
        } else if (yoga_count >= 15) {
            badge = "./images/yogagold.svg";
        } else if (yoga_count >= 10) {
            badge = "./images/yogasilver.svg";
        } else if (yoga_count >= 5) {
            badge = "./images/yogabronze.svg";
        }
    } else if (exerciseType == "running") {
        if (running_count >= 20) {
            badge = "./images/runningplatinum.svg";
        } else if (running_count >= 15) {
            badge = "./images/runninggold.svg";
        } else if (running_count >= 10) {
            badge = "./images/runningsilver.svg";
        } else if (running_count >= 5) {
            badge = "./images/runningbronze.svg";
        }
    } else if (exerciseType == "walking") {
        if (walking_count >= 20) {
            badge = "./images/walkingplatinum.svg";
        } else if (walking_count >= 15) {
            badge = "./images/walkinggold.svg";
        } else if (walking_count >= 10) {
            badge = "./images/walkingsilver.svg";
        } else if (walking_count >= 5) {
            badge = "./images/walkingbronze.svg";
        }
    } else if (exerciseType == "cycling") {
        if (cycling_count >= 20) {
            badge = "./images/cyclingplatinum.svg";
        } else if (cycling_count >= 15) {
            badge = "./images/cyclinggold.svg";
        } else if (cycling_count >= 10) {
            badge = "./images/cyclingsilver.svg";
        } else if (cycling_count >= 5) {
            badge = "./images/cyclingbronze.svg";
        }
    } else {
        badge = null;
    }

    return badge;


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
            console.log(calories, met);
            resolve(calories); // Resolve the promise with calories

        }).catch(error => {
            console.log("Error getting document:", error);
            reject(error); // Reject the promise on error
        });

    });
}

function getActivityFeedInfo(currentUser) {
    var badge_earned = null
    var todays_date = new Date();
    var firebaseDate = firebase.firestore.Timestamp.fromDate(todays_date)
    currentUser.get().then(userDoc => {
        currentUser.collection('workouts').orderBy('startDate', 'desc').get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (doc.data().earned != none) {
                    badge_earned = doc.data().earned;
                    if (badge_earned == null) {

                        badge_earned = ""
                    }
                    add_to_activity_feed = `<div class="flex flex-row mt-2 mx-4">
                            </div>
                            <div class="flex flex-row bg-[#fff6e5] rounded-xl mt-2 m-4">
                                <img class="h-20 mx-5 self-center" src="images/profile_pic.svg" alt="">
                                <div class="p-2 ">
                                    <div class="py-2 flex flex-row justify-between">
                                        <h1 class="font-semibold inline text-lg"><span id="activity-username">${doc.data().earned}${doc.id}</span></h1>
                                        <img class="h-6 pr-3 inline ml-auto" src="images/star_icon.svg" alt="">
                                    </div>
                                    <p class="text-xs pb-4 pr-1" id="accomplishment-phrase"></p>
                                </div>
                            </div>`
                } else {
                    add_to_activity_feed = `<div class="flex flex-row bg-[#fff6e5] rounded-xl mt-2 m-4">
                            <img class="h-20 mx-5 self-center" src="images/profile_pic.svg" alt="">
                            <div class="p-2 ">
                                <div class="py-2">
                                    <h1 class="font-semibold inline text-lg"><span id="activity-username">${doc.id}</span></h1>
                                </div>
                                <p class="text-xs pb-4 pr-1" id="activity-feed-phrase"></p>
                            </div>
                        </div>`
                }
                jQuery('#activity_feed').append(add_to_activity_feed);
            })
        })
    })

}

async function exercise_counter(exercise_type, currentUser) {
    currentUser.collection("exerciseCounter").doc("exercises").get().then((exerciseCounter) => {
        console.log(exerciseCounter.exists)
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
        console.log(exercise_type)
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
                earned: badges_earned,
            }, { merge: true })
                .then(() => {
                    console.log("Document successfully updated!");
                    jQuery('#homepage').toggle();
                    jQuery("#add_workout").css("display", "none");
                    jQuery('#confirmAddWorkout').css("display", "flex").delay(3000).hide(0);
                })
                .catch((error) => {
                    console.error("Error updating document: ", error);
                });
        }).catch((error) => {
            console.error("Error fetching documents: ", error);
        });



    }
}


function insertNameAndPicFromFirestore(currentUser) {
    currentUser.get().then(userDoc => {
        // Get the user name
        let userName = userDoc.data().name;
        let profilePicUrl = userDoc.data().image;
        console.log(profilePicUrl)
        // Get the download URL
        if (profilePicUrl && profilePicUrl.startsWith('https://')) {
            // Set the user name and profile picture
            jQuery("#name-goes-here").text(userName);
            jQuery('#homepagepic').attr('src', profilePicUrl); // Set the src with the full URL
        } else {
            console.error("Invalid URL for profile picture");
        }
    })

}


function insertHomepageInfoFromFirestore(currentUser) {
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

    currentUser.collection("workouts").where('startDate', '>=', start_of_week).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            var workoutDate = new Date(doc.data().startDate.toDate().toDateString());
            if (dates.includes(workoutDate.toDateString())) {
                calories_in_a_week += doc.data().calories;
                console.log(calories_in_a_week)
            }
            jQuery("#calories-go-here").text(calories_in_a_week.toFixed(2));
        });
    });

    currentUser.collection("workouts").where('startDate', '>=', start_of_week).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            var workoutDate = new Date(doc.data().startDate.toDate().toDateString());
            if (dates.includes(workoutDate.toDateString())) {
                number_of_workouts++;
            }
            jQuery("#workout-number-goes-here").text(number_of_workouts);
        });

    });

}

function insertTodaysWorkoutInfoFromFirestore(currentUser) {
    var selected_date = new Date();
    var selected_endDay = new Date();
    selected_date.setHours(0, 0, 0, 0);
    selected_endDay.setHours(23, 59, 59, 999);
    var firebase_Startdate = firebase.firestore.Timestamp.fromDate(selected_date);
    var firebase_Enddate = firebase.firestore.Timestamp.fromDate(selected_endDay);
    var todays_time = 0;
    var todays_calories = 0;
    var todays_workouts = 0;

    currentUser.collection('workouts').where('startDate', '>=', firebase_Startdate).where('startDate', '<=', firebase_Enddate).get().then(recordedWorkout => {
        recordedWorkout.forEach(workouts => {
            todays_time += (workouts.data().endDate - workouts.data().startDate) / 60;
            jQuery("#todays-time-goes-here").text(todays_time);
        })
    })

    currentUser.collection('workouts').where('startDate', '>=', firebase_Startdate).where('startDate', '<=', firebase_Enddate).get().then(recordedWorkout => {
        recordedWorkout.forEach(workouts => {
            todays_calories += workouts.data().calories
            jQuery("#todays-calories-go-here").text(todays_calories.toFixed(2));
        })
    })

    currentUser.collection('workouts').where('startDate', '>=', firebase_Startdate).where('startDate', '<=', firebase_Enddate).get().then(recordedWorkout => {
        recordedWorkout.forEach(workouts => {
            todays_workouts++;
            jQuery("#todays-workouts-go-here").text(todays_workouts);
        })
    })


}

function insertYesterdaysWorkoutInfoFromFirestore(currentUser) {
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

    currentUser.collection('workouts').where('startDate', '>=', firebase_Startdate).where('startDate', '<=', firebase_Enddate).get().then(recordedWorkout => {
        recordedWorkout.forEach(workouts => {
            yesterdays_time += (workouts.data().endDate - workouts.data().startDate) / 60;
            jQuery("#yesterdays-time-goes-here").text(yesterdays_time);
        })
    })

    currentUser.collection('workouts').where('startDate', '>=', firebase_Startdate).where('startDate', '<=', firebase_Enddate).get().then(recordedWorkout => {
        recordedWorkout.forEach(workouts => {
            yesterdays_calories += workouts.data().calories
            jQuery("#yesterdays-calories-go-here").text(yesterdays_calories);
        })
    })

    currentUser.collection('workouts').where('startDate', '>=', firebase_Startdate).where('startDate', '<=', firebase_Enddate).get().then(recordedWorkout => {
        recordedWorkout.forEach(workouts => {
            yesterdays_workouts++;
            jQuery("#yesterdays-workouts-go-here").text(yesterdays_workouts);
        })
    })


}

async function get_leaderboard_data(currentUser) {
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
                            "calories": 0, "badges": "", "profilepic": userinfo.data().image
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
                    for (let nickname in leaderboardinfo) {
                        if (leaderboardinfo[nickname]["profilepic"] == undefined) {
                            leaderboardinfo[nickname]["profilepic"] = "./images/profile_pic.svg";
                        }
                        if (leaderboardinfo[nickname]["badges"] == null || leaderboardinfo[nickname]["badges"] == "") {
                            leaderboardinfo[nickname]["badges"] = `./images/empty.svg`;
                        }
                    }
                    i = 0;
                    let calories_in_order = (Object.keys(leaderboardinfo).map(nickname => leaderboardinfo[nickname]["calories"]));
                    calories_in_order.sort(function (a, b) { return a - b }).reverse();
                    console.log(calories_in_order);
                    for (index = 0; index < calories_in_order.length; index++) {
                        for (let nickname in leaderboardinfo) {
                            if (leaderboardinfo[nickname]["calories"] === calories_in_order[index]) {
                                text_to_inject = `<div class="grid grid-cols-4 text-center place-items-center bg-[#fff6e5] m-4 rounded-lg p-3">
                                    <span class="grid grid-cols-2 text-center place-items-center"> <span>${i + 1}.</span><img class="w-8 h-8"
                                            src="${leaderboardinfo[nickname]["profilepic"]}" alt=""></span>
                                    <span>${nickname}</span>
                                    <span class="grid grid-cols-1 gap-2"><img class="w-6 h-6" src="${leaderboardinfo[nickname]["badges"]}" alt=""></span>
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

function show_recorded_workouts(currentUser) {
    $("#recorded_workouts").empty();
    let input_date = $('#selectedDate').val();

    // Create local Date objects at the beginning and end of the selected day
    let selected_date = new Date(input_date + "T00:00:00");
    let selected_endDay = new Date(input_date + "T23:59:59");

    // Convert the local date times directly to Firestore Timestamps
    let firebase_Startdate = firebase.firestore.Timestamp.fromDate(selected_date);
    let firebase_Enddate = firebase.firestore.Timestamp.fromDate(selected_endDay);

    currentUser.collection('workouts').where('startDate', '>=', firebase_Startdate).where('startDate', '<=', firebase_Enddate).get().then(recordedWorkout => {
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
                            <span>Time: ${(workouts.data().endDate - workouts.data().startDate) / 60} mins </span>
                            </div>
                            <div></div>
                        </div>`
                );
            }
            else {
                $("#recorded_workouts").append(
                    `<div class="flex flex-row justify-evenly">
                            <div class="flex flex-col justify-evenly  text-[16px] p-4">
                            <span>Workout: ${workouts.data().exerciseType}</span>
                            <span>Km: ${workouts.data().intensity}</span>
                            </div>
                            <div class="flex flex-col justify-evenly  text-[16px] p-4">
                            <span>Calories burned: ${workouts.data().calories}</span>
                            <span>Time: ${(workouts.data().endDate - workouts.data().startDate) / 60} mins </span>
                            </div>
                            <div></div>
                        </div>`
                );
            }
        })
    });


}

function getActivityFeedInfo(currentUser) {
    var badge_earned = null
    currentUser.get().then(userDoc => {
        nickname = userDoc.data().nickname;
        username = userDoc.data().name;
        currentUser.collection('workouts').orderBy('startDate', 'desc').get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                badge_earned = doc.data().earned;
                workout_time = (doc.data().endDate - doc.data().startDate) / 60;
                exercise_type = doc.data().exerciseType
                if (exercise_type == "yoga") {
                    exercise_type = "doing yoga"
                }
                if (badge_earned == null) {
                    badge_earned = ""
                    add_to_activity_feed = `<div class="flex flex-row bg-[#fff6e5] rounded-xl mt-2 m-4">
                            <img class="h-20 mx-5 self-center" src="images/profile_pic.svg" alt="">
                            <div class="p-2 ">
                                <div class="py-2">
                                    <h1 class="font-semibold inline text-lg"><span id="activity-username">${nickname}</span></h1>
                                </div>
                                <p class="text-xs pb-4 pr-1" id="activity-feed-phrase">You just spent ${workout_time} minutes ${exercise_type}!</p>
                            </div>
                        </div>`
                } else {
                    add_to_activity_feed = `<div class="flex flex-row mt-2 mx-4">
                            </div>
                            <div class="flex flex-row bg-[#fff6e5] rounded-xl mt-2 m-4">
                                <img class="h-20 mx-5 self-center" src="images/profile_pic.svg" alt="">
                                <div class="p-2 ">
                                    <div class="py-2 flex flex-row justify-between">
                                        <h1 class="font-semibold inline text-lg"><span id="activity-username">${nickname}</span></h1>
                                        <img class="h-6 pr-3 inline ml-auto" src="images/star_icon.svg" alt="">
                                    </div>
                                    <p class="text-xs pb-4 pr-1" id="accomplishment-phrase">You just spent ${workout_time} minutes ${exercise_type}!</p>
                                </div>
                            </div>`
                }

                jQuery('#activity_feed').append(add_to_activity_feed);

            })
        })
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

function homepage_handler() {
    jQuery('#homepage').css("display", "grid");
    jQuery('#leaderboard').css("display", "none");
    jQuery('#activity_feed').css("display", "none");
    jQuery('#datepicker').css("display", "none");
    jQuery('#settings').css("display", "none");
    jQuery('#add_workout').css("display", "none");
    jQuery('#filter_activity').css("display", "none");
    jQuery('#profile_info').css("display", "none");

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

function leaderboard_current_date() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const days = Math.floor((currentDate - startOfYear) / 86400000);
    const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
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




