/** Description: This file manages the homepage section of the web app */

/** Function to display the name and profile pic of the user
 * @param {firebase.firestore.DocumentReference} currentUser - the current user object
 */
function insertNameAndPicFromFirestore(currentUser) {
    currentUser.get().then(userDoc => {
        // Get the user name
        let userName = userDoc.data().name;
        console.log(userDoc.data().name)
        userName = userName.substring(0, userName.indexOf(' '));
        let profilePicUrl = userDoc.data().image;
        console.log(profilePicUrl)
        // Get the download URL
        jQuery("#name-goes-here").text(userName);
        if (profilePicUrl && profilePicUrl.startsWith('https://')) {
            // Set the user name and profile picture

            jQuery('#homepagepic').attr('src', profilePicUrl); // Set the src with the full URL
        } else {
            jQuery('#homepagepic').attr('src', './images/profile_pic.svg');
        }
    })
}

/** Function to display the motivational message according to the user's weekly workout time
 * @param {firebase.firestore.DocumentReference} currentUser - the current user object
 * */
function insertMotivationalMessage(currentUser) {
    var todayDate = new Date(new Date().toDateString()); // get the current date, initialize dates for current week and last week
    var dates = [];
    var lastWeeksDates = [];
    var currentdate = todayDate.getDay();
    var startOfWeek = new Date(todayDate);
    var lastWeeksStartDate = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - currentdate);
    lastWeeksStartDate.setDate(startOfWeek.getDate() - 7);
    var workoutTimeInCurrentweek = 0;
    var workoutTimeLastweek = 0;

    for (i = 0; i < 7; i++) { // get the dates for the current week and last week, add them to initialized arrays
        var startDate = new Date(startOfWeek);
        startDate.setDate(startDate.getDate() + i);
        dates.push(startDate.toDateString());
        var startLastWeekDate = new Date(lastWeeksStartDate);
        startLastWeekDate.setDate(startLastWeekDate.getDate() + i);
        lastWeeksDates.push(startLastWeekDate.toDateString());
    }
    currentUser.collection("workouts").where('startDate', '>=', startOfWeek).get().then((querySnapshot) => { // get the workout time for the current week
            var workoutDate = new Date(doc.data().startDate.toDate().toDateString())
            if (dates.includes(workoutDate.toDateString())) {
                workoutTimeInCurrentweek += (doc.data().endDate - doc.data().startDate) / 60;
            }
        })
        currentUser.collection("workouts").where('startDate', '>=', lastWeeksStartDate).get().then((querySnapshot) => { // get the workout time for the last week
            querySnapshot.forEach((doc) => {
                var workoutDate = new Date(doc.data().startDate.toDate().toDateString())
                if (lastWeeksDates.includes(workoutDate.toDateString())) {
                    workoutTimeLastweek += (doc.data().endDate - doc.data().startDate) / 60;
                } 
            })
            if (workoutTimeInCurrentweek > workoutTimeLastweek) { // compare workout time this week and last week, display appropriate motivational message
                $("#motivational-message").text(`You worked out ${workoutTimeInCurrentweek - workoutTimeLastweek} more minutes than last week!`)
            } else {
                $("#motivational-message").text(`${workoutTimeLastweek - workoutTimeInCurrentweek} more minutes to beat last week's workout time!`)
            }
        });
}

/** Function to display the user's weekly workout with calories and number of workouts
 * @param {firebase.firestore.DocumentReference} currentUser - the current user object
 * */
function insertHomepageInfoFromFirestore(currentUser) {
    var todayDate = new Date(new Date().toDateString()); // get the current date, initialize dates for current week and last week
    var dates = [];
    var lastWeeksDates = [];
    var currentdate = todayDate.getDay();
    var startOfWeek = new Date(todayDate);
    var lastWeeksStartDate = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - currentdate);
    lastWeeksStartDate.setDate(startOfWeek.getDate() - 7);
    var numberOfWorkouts = 0;
    var caloriesInAWeek = 0;

    for (i = 0; i < 7; i++) { // get the dates for the current week and last week, add them to initialized arrays
        var startDate = new Date(startOfWeek);
        startDate.setDate(startDate.getDate() + i);
        dates.push(startDate.toDateString());
        var startLastWeekDate = new Date(lastWeeksStartDate);
        startLastWeekDate.setDate(startLastWeekDate.getDate() + i);
        lastWeeksDates.push(startLastWeekDate.toDateString());
    }
    currentUser.collection("workouts").where('startDate', '>=', startOfWeek).get().then((querySnapshot) => { // get the calories for the current week
        querySnapshot.forEach((doc) => {
            var workoutDate = new Date(doc.data().startDate.toDate().toDateString());
            if (dates.includes(workoutDate.toDateString())) {
                caloriesInAWeek += doc.data().calories;
            }
            jQuery("#calories-go-here").text(parseInt(caloriesInAWeek));
        });
    });
    currentUser.collection("workouts").where('startDate', '>=', startOfWeek).get().then((querySnapshot) => { // get the number of workouts for the current week
        querySnapshot.forEach((doc) => {
            var workoutDate = new Date(doc.data().startDate.toDate().toDateString());
            if (dates.includes(workoutDate.toDateString())) {
                numberOfWorkouts++;
            }
            jQuery("#workout-number-goes-here").text(numberOfWorkouts);
        });

    });

}

/** Function to display the user's today's workout with time, calories and number of workouts
 * @param {firebase.firestore.DocumentReference} currentUser - the current user object
 * */
function insertTodaysWorkoutInfoFromFirestore(currentUser) {
    var selectedDate = new Date(); // get the current date from midnight to 11:59, 
    var selectedEndDay = new Date();
    selectedDate.setHours(0, 0, 0, 0);
    selectedEndDay.setHours(23, 59, 59, 999);
    var firebaseStartdate = firebase.firestore.Timestamp.fromDate(selectedDate);
    var firebaseEnddate = firebase.firestore.Timestamp.fromDate(selectedEndDay);
    var todaysTime = 0;
    var todaysCalories = 0;
    var todaysworkouts = 0;

    // get the workout time, calories and number of workouts for today by finding workouts that are within selectedDate and selectedEndDay
    currentUser.collection('workouts').where('startDate', '>=', firebaseStartdate).where('startDate', '<=', firebaseEnddate).get().then(recordedWorkout => {
        recordedWorkout.forEach(workouts => { 
            todaysTime += (workouts.data().endDate - workouts.data().startDate) / 60;
            jQuery("#todays-time-goes-here").text(todaysTime);
        })
    })
    currentUser.collection('workouts').where('startDate', '>=', firebaseStartdate).where('startDate', '<=', firebaseEnddate).get().then(recordedWorkout => {
        recordedWorkout.forEach(workouts => {
            todaysCalories += workouts.data().calories
            jQuery("#todays-calories-go-here").text(parseInt(todaysCalories));
        })
    })
    currentUser.collection('workouts').where('startDate', '>=', firebaseStartdate).where('startDate', '<=', firebaseEnddate).get().then(recordedWorkout => {
        recordedWorkout.forEach(workouts => {
            todaysworkouts++;
            jQuery("#todays-workouts-go-here").text(todaysworkouts);
        })
    })
}

/** Function to display the user's yesterday's workout with time, calories and number of workouts
 * @param {firebase.firestore.DocumentReference} currentUser - the current user object
 * */
function insertYesterdaysWorkoutInfoFromFirestore(currentUser) {
    var yesterdaysDate = new Date(); // get the date for yesterday's date from midnight to 11:59
    var yesterdaysEnd = new Date();
    yesterdaysDate.setDate(yesterdaysDate.getDate() - 1);
    yesterdaysEnd.setDate(yesterdaysEnd.getDate() - 1)
    yesterdaysDate.setHours(0, 0, 0, 0);
    yesterdaysEnd.setHours(23, 59, 59, 999);
    var firebaseStartdate = firebase.firestore.Timestamp.fromDate(yesterdaysDate);
    var firebaseEnddate = firebase.firestore.Timestamp.fromDate(yesterdaysEnd);
    var yesterdaysTime = 0;
    var yesterdaysCalories = 0;
    var yesterdaysWorkouts = 0;

     // get the workout time, calories and number of workouts for yesterday by finding workouts that are within yesterdaysDate and yesterdaysEnd
    currentUser.collection('workouts').where('startDate', '>=', firebaseStartdate).where('startDate', '<=', firebaseEnddate).get().then(recordedWorkout => {
        recordedWorkout.forEach(workouts => {
            yesterdaysTime += (workouts.data().endDate - workouts.data().startDate) / 60;
            jQuery("#yesterdays-time-goes-here").text(yesterdaysTime);
        })
    })
    currentUser.collection('workouts').where('startDate', '>=', firebaseStartdate).where('startDate', '<=', firebaseEnddate).get().then(recordedWorkout => {
        recordedWorkout.forEach(workouts => {
            yesterdaysCalories += workouts.data().calories
            jQuery("#yesterdays-calories-go-here").text(yesterdaysCalories);
        })
    })
    currentUser.collection('workouts').where('startDate', '>=', firebaseStartdate).where('startDate', '<=', firebaseEnddate).get().then(recordedWorkout => {
        recordedWorkout.forEach(workouts => {
            yesterdaysWorkouts++;
            jQuery("#yesterdays-workouts-go-here").text(yesterdaysWorkouts);
        })
    })
}

/** Function to display the homepage section and hide the other sections
 * */
function homepageHandler() {
    jQuery("#homepage-icon").attr('src', './images/nav-icons/home-white.svg')
    jQuery("#calender-icon").attr('src', './images/nav-icons/calender-black.svg')
    jQuery("#leaderboard-icon").attr('src', './images/nav-icons/leaderboard-black.svg')
    jQuery("#activity-icon").attr('src', './images/nav-icons/activity-feed-black.svg')
    jQuery("#settings-icon").attr('src', './images/nav-icons/setting-black.svg')
    jQuery("#add-workout-icon").attr('src', './images/nav-icons/add-workout-black.svg')
    jQuery('#usernameAndPic, #homepage').css('display', 'grid')
    jQuery('#filter-and-search, #leaderboard, #activity_feed, #datepicker, #settings, #add_workout, #filter_activity, #profile_info').css('display', 'none')
}

