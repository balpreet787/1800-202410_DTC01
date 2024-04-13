# CompetiFit

## 1. Project Description
Our team, DTC-01, is developing Competifit to help beginner fitness enthusiasts who lack motivation maintain a consistent exercise schedule by creating a web application that provides a sense of competition between users.
Our core features include a homepage that details a user's weekly progress, a weekly leaderboard, an activity feed, and the ability to add, update, and delete workouts. 

## 2. Names of Contributors
List team members and/or short bio's here... 
* Hi, my name is Claudia. I am so excited to begin my programming journey through this project!
* Hi, I am Balpreet and I am excited to learn about and do different processes involved in creating a project.
	
## 3. Technologies and Resources Used
List technologies (with version numbers), API's, icons, fonts, images, media or data sources, and other resources that were used.
* HTML, CSS, JavaScript, JQuery
* Tailwind CSS 3.0 for UI, https://tailwindcss.com/ 
* Firebase 8.0 (BAAS - Backend as a Service)
* SVG Repo for icons, https://www.svgrepo.com/ 
* Dall E for landing page photo, https://labs.openai.com/
* Google Fonts, https://fonts.google.com/

## 4. Complete setup/installion/usage
* The current version 1.0 of the application is hosted on https://dtc01-6d2e7.web.app
* Works best on mobile phones. 
* Function headers and comments should be referred to in order to understand code.
* Each page has its own script file for it, while all pages are on the main.HTML page. 
* Login and landing pages have their own HTML pages.

## 5. Known Bugs and Limitations
Here are some known bugs:
* The leaderboard only shows the latest badge earned within a current week. It will not show the latest badge earned from another week. 
* The activity feed cannot be filtered by both a user and a parameter (accomplishment or activity) at thesame time. 

## 6. Features for Future
What we'd like to build in the future:
* Graphs or charts for weight tracking.
* More exercise types.
* Smarttechnology integration.
* Better navigation bar icons. Our current icons are different sizes in length, adding labels under them only made the difference in size more obvious. 
	
## 7. Contents of Folder
Content of the project folder:

```
 Top level of project folder: 
├── .gitignore                          # Git ignore file
├── 404.html                            # Error page
├── index.html                          # landing HTML file, this is what users see when you come to url
├── login.html                          # login page, prompts users to fill in email and password
├── main.html                           # contains all sections within the application, hidden appropriately when navigated to a given page 
└── README.md                           # information about our application, bugs, future features, about us

It has the following subfolders and files:
├── .git                                # Folder for git repo
├── images                              # Folder for images
    /burned.svg                         # icon for calories burned in a week
    /celebrate.svg                      # icon for motivational message
    /cyclingbronze.svg                  # bronze cycling icon
    /cyclinggold.svg                    # gold cycling icon
    /cyclingplatinum.svg                # platinum cycling icon
    /cyclingsilver.svg                  # silver cycling icon
    /dumbell1.svg                       # icon for workouts completed in a week
    /empty.svg                          # empty icon for leaderboard is there is no badge
    /filter_icon.svg                    # filter icon
    /info_icon.svg                      # icon for more information, about us
    /landing_page_1.webp                # landing page photo
    /logo.svg                           # logo icon
    /profile_pic.svg                    # icon for profile picture placeholder
    /runningbronze.svg                  # bronze running icon
    /runnninggold.svg                   # gold running icon
    /runningpltinum.svg                 # platinum running icon
    /runningsilver.svg                  # silver running icon
    /star_icon.svg                      # accomplishment icon placeholder
    /timer.svg                          # placeholder for minutes spent in a week working out
    /today.svg                          # icon for today's workout
    /walkingbronze.svg                  # bronze walking icon
    /walkinggold.svg                    # gold walking icon
    /walkingplatinum.svg                # platinum walking icon
    /walkingsilver.svg                  # silver walking icon
    /weightliftingbronze.svg            # bronze weightlifting icon
    /weightliftinggold.svg              # gold weightlifting icon
    /weightliftingplatinum.svg          # platinum weightlifting icon
    /weightliftingsilver.svg            # silver weightlifting icon
    /yogabronze.svg                     # bronze yoga icon
    /yogagold.svg                       # gold yoga icon
    /yogaplatinum.svg                   # platinum yoga icon
    /yogasilver.svg                     # silver yoga icon
    ├── nav-icons
        /activity-feed-black.svg        # black activity feed icon for navigation bar
        /activity-feed-white.svg        # white activity feed icon for navigation bar
        /add-workout-black.svg          # black add workout icon for navigation bar
        /abb-workout-white.svg          # white add workout icon for navigation bar
        /calendar-black.svg             # black calendar icon for navigation bar
        /calendar-white.svg             # white calendar icon for navigation bar
        /home-black.svg                 # black homepage icon for navigation bar
        /home-white.svg                 # white homepage icon for navigation bar
        /leaderboard-black.svg          # black leaderboard icon for navigation bar
        /leaderboard-white.svg          # white leaderboard icon for navigation bar
        /setting-black.svg              # black settings icon for navigation bar
        /setting-white.svg              # white settings icon for navigation bar
├── scripts                             # Folder for scripts
    /activityfeed.js                    # scripts for activity feed
    /authentication.js                  # scripts for user authentication
    /firebaseAPI_DTC01.js               # API keys
    /history.js                         # scripts for history, past workouts
    /homepage.js                        # scripts for homepage
    /leaderboard.js                     # scripts for leaderboard
    /manageWorkouts.js                  # scripts for updating, deleting, adding workouts
    /script.js                          # scripts for settings, manager functions
    /tailwind.config.js                 # tailwind customization file 






