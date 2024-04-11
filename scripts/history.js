/** Description: Handle recorded workout details and options*/

/** function to show the recorded workouts of the user on the selected date
 * @param {firebase.firestore.DocumentReference} currentUser - the current user object
 * */
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
                    `<div class="flex flex-col justify-evenly bg-[#fff6e5] shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] rounded-xl" id="${workouts.id}">
                            <div class="flex flex-row justify-between">
                            <div class="flex flex-col justify-evenly bg-[#fff6e5] text-[16px] p-4">
                            <span><b>Workout:</b> ${workouts.data().exerciseType}</span>
                            <span><b>Intensity:</b> ${workouts.data().intensity}</span>
                            </div>
                            <div>
                            <button id="${workouts.id}Edit" class="p-2 self-start text-md">&#9998;</button>
                            <button id="${workouts.id}Delete" class="p-2 self-start text-md">X</button>
                            </div>
                            </div>
                            <div class="flex flex-col justify-evenly bg-[#fff6e5] text-[16px] p-4">
                            <span><b>Calories Burned:</b> ${workouts.data().calories}</span>
                            <span><b>Time:</b> ${(workouts.data().endDate - workouts.data().startDate) / 60} mins </span>
                            </div>
                            <div class="flex flex-row justify-center gap-3 pb-2">
                            <button class="hidden underline" id="${workouts.id}Cancel">Cancel</button>
                            <button class="hidden underline" id="${workouts.id}Confirm">Confirm Delete</button>
                            </div>
                        </div>`
                );
            }
            else {
                $("#recorded_workouts").append(
                    `<div class=" flex flex-col justify-evenly bg-[#fff6e5] shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] rounded-xl" id="${workouts.id}">
                    <div class="flex flex-row justify-between">
                    <div class="flex flex-col justify-evenly bg-[#fff6e5] text-[16px] p-4">
                    <span><b>Workout:</b> ${workouts.data().exerciseType}</span>
                    <span><b>KM:</b> ${workouts.data().intensity}</span>
                    </div>
                    <div>
                    <button id="${workouts.id}Edit" class="p-2 self-start text-md">&#9998;</button>
                    <button id="${workouts.id}Delete" class="p-2 self-start text-md">X</button>
                    </div>
                    </div>
                    <div class="flex flex-col justify-evenly bg-[#fff6e5] text-[16px] p-4">
                    <span><b>Calories Burned:</b> ${workouts.data().calories}</span>
                    <span><b>Time:</b> ${(workouts.data().endDate - workouts.data().startDate) / 60} mins </span>
                    </div>
                    <div class="flex flex-row justify-center gap-3 pb-2">
                    <button class="hidden underline" id="${workouts.id}Cancel">Cancel</button>
                    <button class="hidden underline" id="${workouts.id}Confirm">Confirm Delete</button>
                    </div>
                </div>`
                );
            }
            deleteWorkoutHandler(currentUser, workouts.id);
            jQuery(`#${workouts.id}Edit`).click(function () { updateworkoutHandler(currentUser, workouts.id) })

        })
    })
        .catch((error) => {
            console.error("Error", error)
        })
}

/** function to show the recorded workouts section of the user
 * */
function calendarHandler() {
    if (jQuery('#datepicker').css("display") == "none") {
        jQuery("#homepage-icon").attr('src', './images/nav-icons/home-black.svg')
        jQuery("#calender-icon").attr('src', './images/nav-icons/calender-white.svg')
        jQuery("#leaderboard-icon").attr('src', './images/nav-icons/leaderboard-black.svg')
        jQuery("#activity-icon").attr('src', './images/nav-icons/activity-feed-black.svg')
        jQuery("#settings-icon").attr('src', './images/nav-icons/setting-black.svg')
        jQuery("#add-workout-icon").attr('src', './images/nav-icons/add-workout-black.svg')
        jQuery('#filter-and-search, #homepage, #leaderboard, #activity_feed, #settings, #add_workout, #filter_activity, #profile_info, #usernameAndPic').css('display', 'none')
        jQuery('#datepicker').css("display", "flex")
    }
}

/** function to inout the current date in the date picker
 * */
function showWorkoutPageDate() {
    const currentDate = new Date();
    const localDate = currentDate.toLocaleDateString('en-CA'); // 'en-CA' uses the YYYY-MM-DD format
    $('#selectedDate').val(localDate);
}

/** function to show delete confirmation and proceed from there
 * @param {firebase.firestore.DocumentReference} currentUser - the current user object
 * @param {string} historyId - the id of the workout history user wants to delete
 * */
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