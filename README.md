# Find Me
#### Video Demo:  <URL HERE>
#### Description:
"Find Me" is a web based prototype of a "lost phone" game (as _Another Lost Phone_ and _Simulacra_) where the player can have a smartphone-like experience on their browsers, being able to take notes and selfies and download them to their computer.

### Initialization:
The application starts on `game.py` by connecting to the database (`game.db`) and creating the main route, which renders `index.html`, our main template. It's worth mentioning that there are two other routes on this file, both which are used in the project to access the phone's state and screen's state stored in the database.

In `index.html`, we can see that there are several scripts and stylesheets linked to the template, even though there is only one file (the _index_ itself) in `templates`. This is due to a design choice of having all phone _screens_ inside a separate folder called `screens` in the `static` folder, as all of those are loaded asynchronously in runtime. That ended up raising an issue when trying to implement Jinja's syntax to the project, which could lead to a more concise writing of the screens' html files.

In the top of the scripts and stylesheets, it can be seen that this project relies on some external files (such as `Blob.js`, `canvas-toBlob.js` and `FileSaver.js`), which are in separate folders at the top of the project root. This project also makes use of jQuery and Bootstrap libraries.

The body of the html is pretty simple, having a div of id "game" with just some inner divs representing the camera. This is the div of the phone itself, which will be fulfilled in runtime. After, there is a form holding the power button, which have it's events created in the scripts.

### Script files:

Besides the already mentioned files, all of the scripts in the `static` folder are self-made or adapted exclusively for this project, relying on some functionalities documented in *MDN* and the help of other web developers for special functions and insights provided by forum responses and/or online articles, all of which are commented in the files in which they are used.

Due to the high number of files, I'm gonna focus on the most important before and then write a brief description of all the other scripts and what they do.

###### turnPhone.js:
Making use of a custom _pressHold_ event (by Kirupa), this file listens for a long press of the power button and then (after checking it's duration and other conditions) calls the function *turnPhone*, which makes a AJAX call to the server asking for the phone's state. Depending on the response, the phone will display a menu with some options (turn off or restart) if the state is on or turn the phone on if the state if off.

*turnPhoneOn* is the function called if the server answer is "off". It's purpose in life is to execute an AJAX call asking for `init.html` screen and then add the class "init" to the phone, which will trigger the initial screen animation. At the last line there is a call to the function *tellServer*, which will be described later.

*turnOffMenu* is the function called if the server answer is "on". It's purpose in life is to display a menu containing some options and listen for the selected one, sliding up the menu or calling *turnPhoneOff* depending on the user's selection.

*turnPhoneOff* is the function called when the user selects "Turn Off" or "Restart" from the turn off menu. It accepts a parameter which will tell if the phone should be or not restarted after turned off. The phone is turned off by leaving only the camera div inside of the phone div, removing all the screen classes, clearing the "open apps" array and then telling the server that it was turned off.

If the user releases the button before the minimal long press duration, the script checks if the phone isn't initializing and then call *turnScreen*, which is defined in `turnScreen.js`.

###### turnScreen.js:
In the function *turnScreen*, a request is sent to the server asking for the phone's state. Only if it is "on", a second request is sent asking for the screen's state. If on, it will leave just the camera div inside the phone div, remove all screens' classes and tell the server that the screen was turned off. If the answer if "off", *turnScreenOn* is called.

*turnScreenOn* is the function called if the server answer is "off". It's purpose in life is to execute an AJAX call asking for `lock.html` screen and then add the class "lockscreen" to the phone, which will configure the screen's layout on `lock.css`. There is also a call to the function *tellServer*, which will be described later, as well as the *prepareLockscreen* function.

###### post_calls.js:
As a helper to any future update to the phone's or screen's state, *tellServer* function accepts two arguments, which stands for the phone's infomation (aka "database column") to be updated and the new data to be put in ("on" or "off"). These arguments are passed as simple strings and are defined in the call to not be processed, so the server can have pure access to the new data.

###### screens.js:
In this file we have defined the existent screens on the phone, being written as objects with a name, a html and some function(s) which will be used in other scripts to interact with the screens.

*loadScreen* is the function which will request every html from the server and then store it in the screens' html property. As it is dynamically called only when the screens are needed, it calls the *prepare* method right after loading the screen, which will append the just loaded screens' html to the phone div and configure the screen as necessary.

###### anim_controls.js:
In this file there is a handler for when the initial animation ends. It is responsible for calling the *turnScreenOn* and removing the "init" class from the phone after the phone is turned on.

###### helpers.js:
In this file we have defined the variable "now", which is a *Date* object responsible for the clocks in lock and home screens. Here we also have the function *removeAllClasses* defined, which has as it's only purpose in life to remove all classes from the phone div. The last function defined here is *capitalizeFirstLetter*, which takes a string as an input and returns a version with it's first letter capitalized.

###### nav_btn.js:
In this file we have the definition of the navigation buttons, which are supported by the arrays "open_apps" and "last_screen".

*squareButton* checks the "open_apps" length and then manipulate the dropdown divs, which have the dropdown classes from Bootstrap. It also creates a closing button for each opened app and add two listeners for clicks on the screen inside and outside the dropdown, triggering the *open*/*close* methods or simply hiding the dropdown menu.

*homeButton* simply calls the *prepare* method to bring the homescreen to the front.

*returnButton* checks for the current screen and "last_screen" length and then call the *prepare* method on the last screen before the current one.

The helpers *addToAppList* and *removeFromAppList* are responsible for controling the apps in "open_apps" and "last_screen", being called when an app is opened, closed or returned to, fixing the order and checking for repetitions accordingly. The functions are flexible to handle both arrays.

The helper *currentScreen* simply returns the screen currently displayed by checking the current class of the phone.

###### locked.js:
This file focus on the lockscreen by having the definition of it's *prepare* method, which has the *setInterval* function to update the hour by calling the *Date* class and setting it's requested values to the html elements (which shares the classes with the homescreen, so it can update both blocks). Here we also have some lines fixing the display of the page and a handling function, which displays the password input after the lower space is clicked.

At the end of the file, there is a *draggable* function from jQuery UI, which listens for the user's swipe on the set at the bottom of the screen.

###### unlock.js:
This file listens for the submit of the password and then sends it to the server, preparing the homescreen (or the last screen before the screen was turned off) if the password is correct or calling the *wrongPassword* function otherwise.

*wrongPassword* is called whenever the user mistakes the password. It updates the "tries" variable defined at the top of the file and checks for it's number in order to block or not the phone. If the user mistakes more than 2 times, a timer is started and the phone is blocked, displaying the time remaining until the timer runs out.

###### home.js:
This file focus on the homescreen by having it's definition of it's *prepare* method, which has the *setInverval* function to update the hour on the status bar's clock. It also has some lines fixing the display of the page and a *draggable* function, which makes it possible for the user to replace the homescreen's clock, which can be put anywhere on the screen maintaining it's "y" axis and being on the center of the screen. It also defines a handler for input in the search bar by sending it's value for a Google search in a new window.

*statusBar* is a function defined for the apps, which are displayed fullscreen, and, for that reason, the status bar is hidden by default. The function makes it possible to display the status bar by dragging the screen from top to bottom or clicking on the very top of the screen where the status bar is. If clicked, the display time of the status bar will be less than if it is swiped down.

###### notes.js:
In this file we have defined the *open* and *prepare* methods and some other functions that make the "write" and "draw" functionalities.

*displayField* is a function called whenever the user changes the app's options and whenever the apps is opened. It has the support of the "selected" variable, defined some lines above, which holds the tab that the user is currently on. On both tabs, the function makes some adjustment on the app's display and, at the end, calls a function for each tab's functionality.

*textarea* is the function called when the user goes to the "write" tab. It's only purpose in life is to check for current text stored when displaying the text area and save it's content whenever the apps is minimized.

*canvas* is the function called when the user goes to the "draw" tab. It was written based on a StackOverflow user's reply for an issue of the cursor pointing different from where the line was being drawn. Before, this function was based on a "MDN" page for the *mousedown* event. The function is responsible for registering the user's drawing on the canvas in the *mainLoop*, which is called by *requestAnimationFrame*. The fixing of the coordinates happens in the *mouseEvent* function, which checks if the drawing's start before storing it's coordinates and then, at the end, defines a handling function for when the "clear" button is pressed. All mouse, canvas and context reference are defined at the top of the function by a mouse object and the DOMElements being assigned to the variables.

*saveNotes* is responsible for displaying a "save" window to the user powered by *saveAs*, which relies on `FileSaver.js` and `Blob.js`. It saves the content based on which screen the user is on.

###### camera.js:
This file have the *open* and *prepare* methods for the camera screen, being the second function responsible for requesting access to the user's camera through *getUserMedia*. If the user allows, their camera stream is passed to a "video" element and activates the camera.

###### capture.js:
This file defines the function *activateCamera*, which defines all the listeners and inner functions related to the camera, including a handler for clicks on the previews, which compares the target through all switch cases in order to filter the canvas accordingly.

*takePicture* draws the picture taken after scaling the canvas to fix the horizontal invertion. Then, it calls the *toDataURL* method and passes it's returned value to a "photo" element's source, which fulfills the entire container above the video.

*changeDisplay* fix the display of the screen to make the photo elements visible or hidden and also set the source of the previews to the photo's source, being each filtered to their specific filters.

*savePhoto* calls *saveAs* function passing the canvas (after calling it's *toBlob* method) as an argument.

### game.py routes:
*checkState* gets the request data by the *getData* method from "request" and updates the "state" column from the phone table.
*checkScreen* gets the request data by the *getData* method from "request" and updates the "screen" column from the phone table.
*checkPassword* gets the request data by the *getData* method from "request" and compares it to the "password" column's data, assigning either "True" or "False" to the object's property to be returned.

### Usage:
If necessary, write the command "$env:FLASK_APP = "game.py"" without the outer quotes in your PowerShell and press Enter
Write the command "flask run" without the quoter in your PowerShell and press Enter.
Select the given URL and copy it with ALT + C and paste it in your browser

1. Turn the cellphone on by holding the power button until the Initialization starts. The power button is found at the right side of the phone, by the middle.
2. Display the password input by swiping up the set at the bottom of the screen or simply by clicking on the empty space above it.
3. Unlock the phone by typing the correct password and pressing "enter". The password tip reveals the password.
- Open the notes app by clicking on the notes icon (left icon)
  - Write whatever you want on the focused text area.
  - Change the in-app tab by clicking on the other option (draw)
  - Swipe down the very top of the screen to check the hour on status bar.
  - Draw whatever you want on the canvas
    - Click on "Clear" button and "Yes" if you want to reset your drawing
  - Save your notes by clicking on save icon at the right of the options. It will save the current tab's content.
  - Minimize the app pressing home or return button at the bottom of the screen.
- Open the camera app by clicking on the camera icon (right icon)
  - Allow access to use your device camera
  - Make a Jojo pose and press the red capture button at the center of the screen
  - Choose a filter from the previews and control it's efficiency through the slider.
    - Return back to the original picture by choosing the last preview
  - Save your selfie by clicking on the save icon at the top of the screen, right below the camera.
    - Close the picture by clicking on the "X" at the top right of the screen
  - Minimize the app pressing home or return button at the bottom of the screen.
- Press the square button at the bottom of the screen to close the apps in second plan or re-open them.
- On homescreen, drag the central clock down the screen to replace it.
- Search for "MeiaUm Good Enough" in the search bar and press enter.

### Additional notes:
- Due to some browser's difference on the active's and hover's hitbox, it might happen that click events on the power button trigger the handler without triggering CSS.
- Even though being a final project, Find Me should be viewed as just a prototype of a future game, with more apps, better representation of a real smartphone and a meaningful lore.
