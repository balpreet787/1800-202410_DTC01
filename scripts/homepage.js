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

function insertMotivationalMessage(currentUser) {
    var todayDate = new Date(new Date().toDateString());
    var dates = [];
    var lastWeeksDates = [];
    var currentdate = todayDate.getDay();
    var startOfWeek = new Date(todayDate);
    var lastWeeksStartDate = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - currentdate);
    lastWeeksStartDate.setDate(startOfWeek.getDate() - 7);
    var workoutTimeInCurrentweek = 0;
    var workoutTimeLastweek = 0;

    for (i = 0; i < 7; i++) {
        var startDate = new Date(startOfWeek);
        startDate.setDate(startDate.getDate() + i);
        dates.push(startDate.toDateString());
        var startLastWeekDate = new Date(lastWeeksStartDate);
        startLastWeekDate.setDate(startLastWeekDate.getDate() + i);
        lastWeeksDates.push(startLastWeekDate.toDateString());
    }
    currentUser.collection("workouts").where('startDate', '>=', startOfWeek).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            var workoutDate = new Date(doc.data().startDate.toDate().toDateString())
            if (dates.includes(workoutDate.toDateString())) {
                workoutTimeInCurrentweek += (doc.data().endDate - doc.data().startDate) / 60;
            }
        })
        currentUser.collection("workouts").where('startDate', '>=', lastWeeksStartDate).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                var workoutDate = new Date(doc.data().startDate.toDate().toDateString())
                if (lastWeeksDates.includes(workoutDate.toDateString())) {
                    workoutTimeLastweek += (doc.data().endDate - doc.data().startDate) / 60;
                } 
            })
            if (workoutTimeInCurrentweek > workoutTimeLastweek) {
                $("#motivational-message").text(`You worked out ${workoutTimeInCurrentweek - workoutTimeLastweek} more minutes than last week!`)
            } else {
                $("#motivational-message").text(`${workoutTimeLastweek - workoutTimeInCurrentweek} more minutes to beat last week's workout time!`)
            }
        });
    });
}

function insertHomepageInfoFromFirestore(currentUser) {
    var todayDate = new Date(new Date().toDateString());
    var dates = [];
    var lastWeeksDates = [];
    var currentdate = todayDate.getDay();
    var startOfWeek = new Date(todayDate);
    var lastWeeksStartDate = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - currentdate);
    lastWeeksStartDate.setDate(startOfWeek.getDate() - 7);
    var numberOfWorkouts = 0;
    var caloriesInAWeek = 0;

    for (i = 0; i < 7; i++) {
        var startDate = new Date(startOfWeek);
        startDate.setDate(startDate.getDate() + i);
        dates.push(startDate.toDateString());
        var startLastWeekDate = new Date(lastWeeksStartDate);
        startLastWeekDate.setDate(startLastWeekDate.getDate() + i);
        lastWeeksDates.push(startLastWeekDate.toDateString());
    }
    currentUser.collection("workouts").where('startDate', '>=', startOfWeek).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            var workoutDate = new Date(doc.data().startDate.toDate().toDateString());
            if (dates.includes(workoutDate.toDateString())) {
                caloriesInAWeek += doc.data().calories;
            }
            jQuery("#calories-go-here").text(parseInt(caloriesInAWeek));
        });
    });
    currentUser.collection("workouts").where('startDate', '>=', startOfWeek).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            var workoutDate = new Date(doc.data().startDate.toDate().toDateString());
            if (dates.includes(workoutDate.toDateString())) {
                numberOfWorkouts++;
            }
            jQuery("#workout-number-goes-here").text(numberOfWorkouts);
        });

    });

}

function insertTodaysWorkoutInfoFromFirestore(currentUser) {
    var selectedDate = new Date();
    var selectedEndDay = new Date();
    selectedDate.setHours(0, 0, 0, 0);
    selectedEndDay.setHours(23, 59, 59, 999);
    var firebaseStartdate = firebase.firestore.Timestamp.fromDate(selectedDate);
    var firebaseEnddate = firebase.firestore.Timestamp.fromDate(selectedEndDay);
    var todaysTime = 0;
    var todaysCalories = 0;
    var todaysworkouts = 0;

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

function insertYesterdaysWorkoutInfoFromFirestore(currentUser) {
    var yesterdaysDate = new Date();
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

