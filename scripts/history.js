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

function show_workout_page_date() {
    const currentDate = new Date();
    $('#selectedDate').val(currentDate.toISOString().split('T')[0]);
}