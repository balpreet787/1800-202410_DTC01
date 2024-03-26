function getActivityFeedInfo(currentUser) {
    var badge_earned = null;
    var leaderboardID = undefined;
    var friendIDs = [];
    var activityfeedinfo = [];
    currentUser.get().then(userDoc => {
        leaderboardID = userDoc.data().leaderboardID;
        db.collection("users").where("leaderboardID", "==", leaderboardID).get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                friendIDs.push(doc.id);
            });

            let activityfeedpromises = friendIDs.map(function (id) {
                return db.collection("users").doc(id).get().then(userinfo => {
                    let nickname = userinfo.data().nickname;
                    let username = userinfo.data().name;
                    let profilepic = userinfo.data().image;
                    return db.collection("users").doc(id).collection('workouts').orderBy('startDate', 'desc').get().then(querySnapshot => {
                        querySnapshot.forEach(doc => {

                            badge_earned = doc.data().earned;
                            badge_name = doc.data().earned_name;
                            workout_time = (doc.data().endDate - doc.data().startDate) / 60;
                            exercise_type = doc.data().exerciseType;

                            activityfeedinfo.push({
                                "startdate": doc.data().startDate, "calories": doc.data().calories, "username": username, "exercise_type": doc.data().exerciseType, "profilepic": profilepic, "nickname": nickname, "workouttime": workout_time, "badgesearned": badge_earned, "badge_name": badge_name
                            })
                        });
                    });
                });
            });
            Promise.all(activityfeedpromises).then(() => {
                activityfeedinfo.sort((a, b) => b.startdate - a.startdate);
                let badge_earned = null
                for (let i = 0; i < activityfeedinfo.length; i++) {
                    if (activityfeedinfo[i]["exercise_type"] == "yoga") {
                        activityfeedinfo[i]["exercise_type"] = "doing yoga";
                    }
                    if (activityfeedinfo[i]["badgesearned"] == badge_earned) {
                        activityfeedinfo[i]["badgesearned"] = "";
                        add_to_activity_feed = `<div class="flex flex-row bg-[#fff6e5] rounded-xl mt-2 m-4 normal-activity">
                                            <img class="h-20 mx-5 self-center rounded-full w-20" src="${activityfeedinfo[i]["profilepic"]}" alt="">
                                            <div class="p-2 ">
                                                <div class="py-2">
                                                    <h1 class="font-semibold inline text-lg"><span id="activity-username">${activityfeedinfo[i]["nickname"]}</span></h1>
                                                </div>
                                                <p class="text-xs pb-4 pr-1" id="activity-feed-phrase">${activityfeedinfo[i]["username"]} spent ${activityfeedinfo[i]["workouttime"]} minutes ${activityfeedinfo[i]["exercise_type"]}!</p>
                                            </div>
                                        </div>`
                    } else {
                        badge_earned = activityfeedinfo[i]["badgesearned"]
                        add_to_activity_feed = `<div class="flex flex-row mt-2 mx-4 ">
                                        </div>
                                        <div class="flex flex-row bg-[#fff6e5] rounded-xl mt-2 m-4 accomplishment-activity">
                                            <img class="h-20 mx-5 self-center rounded-full w-20" src=${activityfeedinfo[i]["profilepic"]}" alt="">
                                            <div class="p-2 ">
                                                <div class="py-2 flex flex-row justify-between">
                                                    <h1 class="font-semibold inline text-lg"><span id="activity-username">${activityfeedinfo[i]["nickname"]}</span></h1>
                                                    <img class="h-6 pr-3 inline w-full justify-self-end" src="${activityfeedinfo[i]["badgesearned"]}" alt="">
                                                </div>
                                                <p class="text-xs pb-4 pr-1 ml-auto" id="accomplishment-phrase">${activityfeedinfo[i]["username"]} spent ${activityfeedinfo[i]["workouttime"]} minutes ${activityfeedinfo[i]["exercise_type"]} and earned a ${activityfeedinfo[i]["badge_name"]}!</p>
                                            </div>
                                        </div>`
                    }
                    jQuery("#activity_feed").append(add_to_activity_feed);
                }

            }).catch(error => {
                console.error("Error processing all user data: ", error);
            })
        });
    });
}

function filterActivityFeed() {
    var selected_value = $("input[name='filter-activity-feed']:checked").val();
    if (selected_value == "accomplishment") {
        jQuery(".accomplishment-activity").css("display", "flex");
        jQuery(".normal-activity").css("display", "none");
        jQuery('#activity_feed').css("display", "flex");
        jQuery('#activity_feed').css("flex-direction", "column");
        jQuery("#filter_activity").css("display", "none")
    } else {
        jQuery(".accomplishment-activity").css("display", "none");
        jQuery(".normal-activity").css("display", "flex");
        jQuery('#activity_feed').css("display", "flex");
        jQuery('#activity_feed').css("flex-direction", "column");
        jQuery("#filter_activity").css("display", "none")
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