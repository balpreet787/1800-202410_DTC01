/** Description: Manage the leaderboard section of the website */

/** Function to get the start and end date of the week for the user secected week
 * @returns {Array} - an array containing the start and end date of the week
 */
function get_leaderboard_date_range() {
    let weekValue = $('#week').val();
    const [year, weekNumber] = weekValue.split('-W').map(Number);
    const janFirst = new Date(year, 0, 1);
    janFirst.setHours(0, 0, 0, 0); // Set hours to the start of the day

    // Calculate the number of days to add from January 1st to the first Sunday of the year
    // If January 1st is a Sunday (getDay() returns 0), then daysToFirstSunday should be 0, otherwise calculate the difference to the next Sunday
    const daysToFirstSunday = (janFirst.getDay() === 0) ? 0 : 7 - janFirst.getDay();
    const firstSundayOfYear = new Date(janFirst);
    firstSundayOfYear.setDate(janFirst.getDate() + daysToFirstSunday);

    // Calculate the start of the week for the given week number
    // Subtract 7 days since we already have the first Sunday of the year accounted for in firstSundayOfYear
    const weekStart = new Date(firstSundayOfYear);
    weekStart.setDate(firstSundayOfYear.getDate() + (weekNumber - 1) * 7 - 7);

    // Calculate the end of the week as 6 days later than the start
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    return [weekStart, weekEnd];
}

/** Function to populate the leaderboard with the user data
 * @param {Object} leaderboardinfo - an object containing the user data
 * */
function populate_leaderboard(leaderboardinfo) {
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
    // Sort the user data in descending order of calories
    let calories_in_order = (Object.keys(leaderboardinfo).map(nickname => leaderboardinfo[nickname]["calories"]));
    calories_in_order.sort(function (a, b) { return a - b }).reverse();
    for (index = 0; index < calories_in_order.length; index++) {
        for (let nickname in leaderboardinfo) {
            if (leaderboardinfo[nickname]["calories"] === calories_in_order[index]) {
                text_to_inject = `<div class="grid grid-cols-4 place-items-center bg-[#fff6e5] m-4 rounded-xl shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] p-3">
                    <span class="grid grid-cols-2 text-center place-items-center"> <span class="font-bold">${i + 1}.</span><img class="w-8 h-8 rounded-full"
                            src="${leaderboardinfo[nickname]["profilepic"]}" alt=""></span>
                    <span>${nickname}</span>
                    <span class="grid grid-cols-1 gap-2"><img class="w-6 h-6" src="${leaderboardinfo[nickname]["badges"]}" alt=""></span>
                    <span class="place-items-right">${leaderboardinfo[nickname]["calories"]}</span>
                </div>`
                $('#leaderboard-info').append(text_to_inject);
                i++
                delete leaderboardinfo[nickname];
                break;
            }
        }
    }
}

/** Function to get the user data for the leaderboard
 * @param {firebase.firestore.DocumentReference} currentUser - the current user object
 * */
async function getLeaderboardData(currentUser) {
    $('#leaderboard-info').empty();

    const dateRange = get_leaderboard_date_range();
    // Create Firestore timestamps
    const firestoreStartDate = firebase.firestore.Timestamp.fromDate(dateRange[0]);
    const firestoreEndDate = firebase.firestore.Timestamp.fromDate(dateRange[1]);

    let leaderboardID = undefined;
    let friendIDs = [];
    let leaderboardinfo = {};
    // Get the leaderboard ID of the current user
    currentUser.get().then(userDoc => {
        leaderboardID = userDoc.data().leaderboardID;
        // Get the user IDs of the friends in the leaderboard
        db.collection('users').where('leaderboardID', '==', leaderboardID)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    friendIDs.push(doc.id)
                });

                let leaderboardpromises = friendIDs.map(function (id) {
                    // Get the user data for each user in the leaderboard
                    return db.collection("users").doc(id).get().then(userinfo => {
                        let nickname = userinfo.data().nickname;
                        leaderboardinfo[nickname] = {
                            "calories": 0, "badges": "", "profilepic": userinfo.data().image
                        };
                        // Get the workout data for each user in the leaderboard
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
                    // populate the leaderboard section of html page with the user data
                    populate_leaderboard(leaderboardinfo);

                }).catch(error => {
                    console.error("Error processing all user data: ", error);
                });
            })
            .catch((error) => {
                console.error("Error getting documents: ", error);
            });
    })
}

/** Function to display the leaderboard section of the website */
function leaderboardHandler() {
    if (jQuery('#leaderboard').css("display") == "none") {

        jQuery("#homepage-icon").attr('src', './images/nav-icons/home-black.svg')
        jQuery("#calender-icon").attr('src', './images/nav-icons/calender-black.svg')
        jQuery("#leaderboard-icon").attr('src', './images/nav-icons/leaderboard-white.svg')
        jQuery("#activity-icon").attr('src', './images/nav-icons/activity-feed-black.svg')
        jQuery("#add-workout-icon").attr('src', './images/nav-icons/add-workout-black.svg')
        jQuery("#settings-icon").attr('src', './images/nav-icons/setting-black.svg')
        jQuery('#username-and-pic').css('display', 'none')
        jQuery('#filter-and-search').css('display', 'none')
        jQuery('#leaderboard').toggle();
        jQuery('#homepage').css("display", "none");
        jQuery('#activity-feed').css("display", "none");
        jQuery('#datepicker').css("display", "none");
        jQuery('#settings').css("display", "none");
        jQuery('#add-workout').css("display", "none");
        jQuery('#filter-activity').css("display", "none");
        jQuery('#profile-info').css("display", "none");
    }
}

/** Function to input the current week in the week picker */
function leaderboardCurrentDate() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const days = Math.floor((currentDate - startOfYear) / 86400000);
    const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
    const formattedWeekNumber = weekNumber.toString().padStart(2, '0');
    $('#week').val(`${year}-W${formattedWeekNumber}`);

}