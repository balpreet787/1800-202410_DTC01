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
                    console.log(calories_in_order);
                    for (index = 0; index < calories_in_order.length; index++) {
                        for (let nickname in leaderboardinfo) {
                            console.log(leaderboardinfo[nickname]["badges"])
                            if (leaderboardinfo[nickname]["calories"] === calories_in_order[index]) {
                                text_to_inject = `<div class="grid grid-cols-4 text-center place-items-center bg-[#fff6e5] m-4 rounded-lg p-3">
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

function leaderboard_current_date() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const days = Math.floor((currentDate - startOfYear) / 86400000);
    const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
    const formattedWeekNumber = weekNumber.toString().padStart(2, '0');
    $('#week').val(`${year}-W${formattedWeekNumber}`);

}