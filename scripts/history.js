function showRecordedWorkouts(currentUser) {
    $("#recorded_workouts").empty();
    let inputDate = $('#selectedDate').val();

    // Create local Date objects at the beginning and end of the selected day
    let selectedStartDate = new Date(inputDate + "T00:00:00");
    let selectedEndDate = new Date(inputDate + "T23:59:59");

    // Convert the local date times directly to Firestore Timestamps
    let firebaseStartdate = firebase.firestore.Timestamp.fromDate(selectedStartDate);
    let firebaseEnddate = firebase.firestore.Timestamp.fromDate(selectedEndDate);

    currentUser.collection('workouts').where('startDate', '>=', firebaseStartdate).where('startDate', '<=', firebaseEnddate).get().then(recordedWorkout => {
        recordedWorkout.forEach(workouts => {
            if (workouts.data().exerciseType == 'weightlifting' || workouts.data().exerciseType == 'yoga') {
                $("#recorded_workouts").append(
                    `<div class="flex flex-col justify-evenly bg-[#fff6e5]" id="${workouts.id}">
                            <div class="flex flex-col justify-evenly bg-[#fff6e5] text-[16px] p-4">
                            <span><b>Workout:</b> ${workouts.data().exerciseType}</span>
                            <span><b>Intensity:</b> ${workouts.data().intensity}</span>
                            </div>
                            <div class="flex flex-col justify-evenly bg-[#fff6e5] text-[16px] p-4">
                            <span><b>Calories burned:</b> ${workouts.data().calories}</span>
                            <span><b>Time:</b> ${(workouts.data().endDate - workouts.data().startDate) / 60} mins </span>
                            </div>
                            <div>
                            <button class="hidden" id="${workouts.id}Cancel" >Cancel</button>
                            <button id="${workouts.id}Delete">Delete</button>
                            <button class="hidden" id="${workouts.id}Confirm" >Confirm</button>
                            </div>
                        </div>`
                );
            }
            else {
                $("#recorded_workouts").append(
                    `<div class="flex flex-row justify-evenly bg-[#fff6e5]">
                            <div class="flex flex-col justify-evenly bg-[#fff6e5] text-[16px] p-4">
                            <span><b>Workout:</b> ${workouts.data().exerciseType}</span>
                            <span><b>Km:</b> ${workouts.data().intensity}</span>
                            </div>
                            <div class="flex flex-col justify-evenly bg-[#fff6e5] text-[16px] p-4">
                            <span><b>Calories burned:</b> ${workouts.data().calories}</span>
                            <span><b>Time:</b> ${(workouts.data().endDate - workouts.data().startDate) / 60} mins </span>
                            </div>
                            div>
                            <button class="hidden" id="${workouts.id}Cancel" >Cancel</button>
                            <button id="${workouts.id}Delete">Delete</button>
                            <button class="hidden" id="${workouts.id}Confirm" >Confirm</button>
                            </div>
                        </div>`
                );
            }
            deleteWorkoutHandler(currentUser, workouts.id);
        })
    });
}

function calendarHandler() {
    if (jQuery('#datepicker').css("display") == "none") {
        jQuery('#datepicker').css("display", "flex")
        jQuery('#homepage').css("display", "none");
        jQuery('#leaderboard').css("display", "none");
        jQuery('#activity_feed').css("display", "none");
        jQuery('#settings').css("display", "none");
        jQuery('#add_workout').css("display", "none");
        jQuery('#filter_activity').css("display", "none");
        jQuery('#profile_info').css("display", "none");
        
    }
}

function showWorkoutPageDate() {
    const currentDate = new Date();
    const localDate = currentDate.toLocaleDateString('en-CA'); // 'en-CA' uses the YYYY-MM-DD format
    $('#selectedDate').val(localDate);
}

function deleteWorkoutHandler(currentUser, historyId) {
    jQuery(`#${historyId}Delete`).click(function () {
        jQuery(`#${historyId}Confirm`).css("display", "flex");
        jQuery(`#${historyId}Cancel`).css("display", "flex");
        jQuery(`#${historyId}Delete`).css("display", "none");
    })
    jQuery(`#${historyId}Cancel`).click(function () {
        jQuery(`#${historyId}Confirm`).css("display", "none");
        jQuery(`#${historyId}Cancel`).css("display", "none");
        jQuery(`#${historyId}Delete`).css("display", "flex");
    })
    jQuery(`#${historyId}Confirm`).click(function () {
        removeWorkout(currentUser, historyId);
    })
}