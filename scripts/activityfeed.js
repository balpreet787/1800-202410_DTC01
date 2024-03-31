function getActivityFeedInfo(currentUser) {
    var badgesEarned = null;
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
                    return db.collection("users").doc(id).collection('workouts').orderBy('startDate', 'desc').limit(20).get().then(querySnapshot => {
                        querySnapshot.forEach(doc => {

                            badgesEarned = doc.data().earned;
                            badgeName = doc.data().earned_name;
                            workoutTime = (doc.data().endDate - doc.data().startDate) / 60;
                            exerciseType = doc.data().exerciseType;
                            intensity = doc.data().intensity;

                            activityfeedinfo.push({
                                "startdate": doc.data().startDate, "calories": doc.data().calories, "username": username, "exerciseType": doc.data().exerciseType, "profilepic": profilepic, "nickname": nickname, "workouttime": workoutTime, "badgesearned": badgesEarned, "badgeName": badgeName, "intensity": intensity
                            })
                        });
                    });
                });
            });
            Promise.all(activityfeedpromises).then(() => {
                activityfeedinfo.sort((a, b) => b.startdate - a.startdate);
                let badgesEarned = null
                for (let i = 0; i < activityfeedinfo.length; i++) {
                    let startdate = activityfeedinfo[i]["startdate"].toDate();
                    activityDate = startdate.getDate();
                    activityMonth = startdate.getMonth() + 1;
                    activityYear = startdate.getFullYear()

                    let activityDetails = ""
                    let activityIntensity = ""
                    if (activityfeedinfo[i]["exerciseType"] == "yoga") {
                        activityfeedinfo[i]["exerciseType"] = "doing yoga";
                    }
                    if (activityfeedinfo[i]["exerciseType"] == "weightlifting" || activityfeedinfo[i]["exerciseType"] == "doing yoga") {
                        activityDetails = ` spent ${activityfeedinfo[i]["workouttime"]} minutes <b>${activityfeedinfo[i]["exerciseType"]}</b>`
                        activityIntensity = `<b>Intensity:</b> ${activityfeedinfo[i]["intensity"]}`
                    }
                    else {
                        activityDetails = ` spent ${activityfeedinfo[i]["workouttime"]} minutes <b>${activityfeedinfo[i]["exerciseType"]}</b>`
                        activityIntensity = `<b>Distance:</b>${activityfeedinfo[i]["intensity"]} km`

                    }
                    if (activityfeedinfo[i]["badgesearned"] == badgesEarned || activityfeedinfo[i]["badgesearned"] == null) {
                        activityfeedinfo[i]["badgesearned"] = "";
                        addToActivityFeed = `<div class="flex flex-row bg-[#fff6e5] rounded-xl shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] mt-2 m-4 normal-activity activity-feed-post${i} ${activityfeedinfo[i]["nickname"].toLowerCase()}">
                                            <img class="h-20 mx-5 self-center rounded-full w-20" src="${activityfeedinfo[i]["profilepic"]}" alt="">
                                            <div class="p-2 ">
                                                <div class="py-2 flex">
                                                    <h1 class="font-semibold inline text-lg"><span id="activity-username">${activityfeedinfo[i]["nickname"]}</span></h1><span class="text-xs self-center my-auto">&nbsp;&nbsp;&bull;${activityDate}-${activityMonth}-${activityYear}</span>
                                                </div>
                                                <p class="text-xs pb-4 pr-1" id="activity-feed-phrase">${activityfeedinfo[i]["username"]} ${activityDetails}!</br>${activityIntensity}</p>
                                            </div>
                                        </div>`
                    } else {
                        badgesEarned = activityfeedinfo[i]["badgesearned"]

                        addToActivityFeed = `<div class="flex flex-row mt-2 mx-4 ">
                                        </div>
                                        <div class="flex flex-row bg-[#fff6e5] rounded-xl shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]mt-2 m-4 accomplishment-activity activity-feed-post${i} ${activityfeedinfo[i]["nickname"]}">
                                            <img class="h-20 mx-5 self-center rounded-full w-20" src=${activityfeedinfo[i]["profilepic"]}" alt="">
                                            <div class="p-2 w-full">
                                                <div class="py-2 flex flex-row justify-between">
                                                    <div><h1 class="font-semibold inline text-lg"><span id="activity-username">${activityfeedinfo[i]["nickname"]}</span></h1><span class="text-xs self-center my-auto">&nbsp;&nbsp;&bull;${activityDate}-${activityMonth}-${activityYear}</span></div>
                                                   <div> <img class="h-6 pr-3 inline w-full justify-self-end" src="${activityfeedinfo[i]["badgesearned"]}" alt=""></div>
                                                </div>
                                                <p class="text-xs pb-4 pr-1 ml-auto"  id="accomplishment-phrase">${activityfeedinfo[i]["username"]} ${activityDetails} and earned a ${activityfeedinfo[i]["badgeName"]}! </br> ${activityIntensity}</p>
                                            </div>
                                        </div>`
                    }
                    jQuery("#activity_feed").append(addToActivityFeed);
                }

            }).catch(error => {
                console.error("Error processing all user data: ", error);
            })
        });
    });
}


function userSearchInActivityFeed() {
    var userSearched = $("input[name='username-search']").val().toLowerCase();
    if (userSearched == "") {
        $(`div.activity-feed-post${i}`).css("display", "flex")
    } else {
        for (let i = 0; i < 20; i++) {
            if ($(`div.activity-feed-post${i}`).hasClass(`${userSearched}`)) {
                $(`div.activity-feed-post${i}`).css("display", "flex")
                jQuery("#filter-search").css("display", "flex")

            } else if (!$(`div.activity-feed-post${i}`).hasClass(`${userSearched}`)) {
                $(`div.activity-feed-post${i}`).css("display", "none")
            }
        }
    }
}



function filterActivityFeed() {
    var selectedValue = $("input[name='filter-activity-feed']:checked").val();
    if (selectedValue == "accomplishment") {
        jQuery(".reset_button").css("display", "flex")
        jQuery("#filter-activity").css("display", "none")
        jQuery("#filter-accomplishment").css("display", "flex")
        jQuery(".accomplishment-activity").css("display", "flex");
        jQuery(".normal-activity").css("display", "none");
        jQuery('#activity_feed').css("display", "flex");
        jQuery('#activity_feed').css("flex-direction", "column");
        jQuery("#filter_activity").css("display", "none")
    } else {
        jQuery(".reset_button").css("display", "flex")
        jQuery("#filter-activity").css("display", "flex")
        jQuery("#filter-accomplishment").css("display", "none")
        jQuery(".accomplishment-activity").css("display", "none");
        jQuery(".normal-activity").css("display", "flex");
        jQuery('#activity_feed').css("display", "flex");
        jQuery('#activity_feed').css("flex-direction", "column");
        jQuery("#filter_activity").css("display", "none")
    }
}

function resetFilteredActivityFeed() {
    $("input[name='filter-activity-feed']").prop('checked', false);
    jQuery("input[name='username-search']").val("")
    jQuery(".reset_button").css("display", "none")
    jQuery("#filter-activity").css("display", "none")
    jQuery("#filter-accomplishment").css("display", "none")
    jQuery(".accomplishment-activity").css("display", "flex");
    jQuery(".normal-activity").css("display", "flex");
    jQuery('#activity_feed').css("display", "flex");
    jQuery('#activity_feed').css("flex-direction", "column");
    jQuery("#filter_activity").css("display", "none")
}

function activityHandler() {
    if (jQuery('#activity_feed').css("display") == "none") {
        jQuery("#homepage-icon").attr('src', './images/nav-icons/home-black.svg')
        jQuery("#calender-icon").attr('src', './images/nav-icons/calender-black.svg')
        jQuery("#leaderboard-icon").attr('src', './images/nav-icons/leaderboard-black.svg')
        jQuery("#activity-icon").attr('src', './images/nav-icons/activity-feed-white.svg')
        jQuery("#settings-icon").attr('src', './images/nav-icons/setting-black.svg')
        jQuery("#add-workout-icon").attr('src', './images/nav-icons/add-workout-black.svg')
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

function filterHandler() {
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