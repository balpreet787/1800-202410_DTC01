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
            jQuery('#homepagepic').attr('src', './images/profile_pic.svg');
        }
    })
}

function insertHomepageInfoFromFirestore(currentUser) {
    var todays_date = new Date(new Date().toDateString());
    var dates = [];
    console.log(currentUser)
    var last_weeks_dates = [];
    var current_date = todays_date.getDay();
    var start_of_week = new Date(todays_date);
    var last_weeks_start_date = new Date();
    start_of_week.setDate(start_of_week.getDate() - current_date);
    last_weeks_start_date.setDate(start_of_week.getDate() - 7);
    console.log(last_weeks_start_date)
    var workout_time_in_current_week = 0;
    var workout_time_last_week = 0;
    var number_of_workouts = 0;
    var calories_in_a_week = 0;

    for (i = 0; i < 7; i++) {
        var start_date = new Date(start_of_week);
        start_date.setDate(start_date.getDate() + i);
        dates.push(start_date.toDateString());
        var start_last_week_date = new Date(last_weeks_start_date);
        start_last_week_date.setDate(start_last_week_date.getDate() + i);
        last_weeks_dates.push(start_last_week_date.toDateString());
    }

    currentUser.collection("workouts").where('startDate', '>=', start_of_week).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            var workoutDate = new Date(doc.data().startDate.toDate().toDateString())
            if (dates.includes(workoutDate.toDateString())) {
                workout_time_in_current_week += (doc.data().endDate - doc.data().startDate) / 60;
            }
        })
        currentUser.collection("workouts").where('startDate', '>=', last_weeks_start_date).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                var workoutDate = new Date(doc.data().startDate.toDate().toDateString())
                if (last_weeks_dates.includes(workoutDate.toDateString())) {
                    workout_time_last_week += (doc.data().endDate - doc.data().startDate) / 60;
                }
            })
            if (workout_time_in_current_week > workout_time_last_week) {
                $("#motivational-message").text(`You worked out ${workout_time_in_current_week} more minutes than last week!`)
            } else {
                $("#motivational-message").text(`${workout_time_last_week - workout_time_in_current_week} more minutes to beat last week's workout time!`)
            }
        });
    });
    currentUser.collection("workouts").where('startDate', '>=', start_of_week).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            var workoutDate = new Date(doc.data().startDate.toDate().toDateString());
            if (dates.includes(workoutDate.toDateString())) {
                calories_in_a_week += doc.data().calories;
                console.log(calories_in_a_week)
            }
            jQuery("#calories-go-here").text(parseInt(calories_in_a_week));
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
            jQuery("#todays-calories-go-here").text(parseInt(todays_calories));
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

