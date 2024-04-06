async function getLeaderboardData(currentUser) {
    $("#leaderboardInfo").empty();
    let weekValue = $('#week').val();
    const [year, weekNumber] = weekValue.split('-W').map(Number);
    const janFirst = new Date(year, 0, 1);
    const offsetToFirstThursday = (11 - janFirst.getDay()) % 7;
    const daysToAdd = (weekNumber - 1) * 7 + offsetToFirstThursday - janFirst.getDay();
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
                    return db.collection("users").doc(id).get().then(userinfo => {
                        let nickname = userinfo.data().nickname;
                        leaderboardinfo[nickname] = {
                            "calories": 0, "badges": "", "profilepic": userinfo.data().image
                        };
                        return db.collection("users").doc(id).collection('workouts').where('startDate', '>=', firestoreStartDate).get().then(historydoc => {
                            historydoc.forEach(historydata => {
                                if (historydata.data().startDate <= firestoreEndDate) {
                                    leaderboardinfo[nickname]["calories"] += parseInt(historydata.data().calories);
                                    if (historydata.data().earned != null) {
                                        leaderboardinfo[nickname]["badges"] = historydata.data().earned;
                                    }
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
                            console.log(leaderboardinfo[nickname])
                            leaderboardinfo[nickname]["badges"] = `./images/empty.svg`;
                        }
                    }
                    i = 0;
                    let calories_in_order = (Object.keys(leaderboardinfo).map(nickname => leaderboardinfo[nickname]["calories"]));
                    calories_in_order.sort(function (a, b) { return a - b }).reverse();
                    for (index = 0; index < calories_in_order.length; index++) {
                        for (let nickname in leaderboardinfo) {
                            if (leaderboardinfo[nickname]["calories"] === calories_in_order[index]) {
                                text_to_inject = `<div class="grid grid-cols-4 text-center place-items-center bg-[#fff6e5] m-4 rounded-xl shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] p-3">
                                    <span class="grid grid-cols-2 text-center place-items-center"> <span>${i + 1}.</span><img class="w-8 h-8 rounded-full"
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

function leaderboardHandler() {
    if (jQuery('#leaderboard').css("display") == "none") {

        jQuery("#homepage-icon").attr('src', './images/nav-icons/home-black.svg')
        jQuery("#calender-icon").attr('src', './images/nav-icons/calender-black.svg')
        jQuery("#leaderboard-icon").attr('src', './images/nav-icons/leaderboard-white.svg')
        jQuery("#activity-icon").attr('src', './images/nav-icons/activity-feed-black.svg')
        jQuery("#add-workout-icon").attr('src', './images/nav-icons/add-workout-black.svg')
        jQuery("#settings-icon").attr('src', './images/nav-icons/setting-black.svg')
        jQuery('#usernameAndPic').css('display', 'none')
        jQuery('#filter-and-search').css('display', 'none')
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

function leaderboardCurrentDate() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const days = Math.floor((currentDate - startOfYear) / 86400000);
    const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
    const formattedWeekNumber = weekNumber.toString().padStart(2, '0');
    $('#week').val(`${year}-W${formattedWeekNumber}`);

}