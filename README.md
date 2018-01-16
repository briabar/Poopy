Poopy
=====

Description
---------------------

Poopy is a web application for locating restrooms in your area.  New restrooms
can be added as well.

Installation
----------------

In order to run the application you must first run the included server.py file.
This server acts as a middleman for doing yelp API calls.
After that open index.html in a browser of your choosing.
Note: in Edge there seems to be an issue with CORS.  It seems Microsoft has
their own standard for handling CORS, and I have not been able to implement it
yet.
## Dendencies and Runtime Environment
The server must be run in python 2, and you must have the following modules installed:
Flask
Flask CORS
requests

Install using: "pip install -r requirements.txt"
##To Run
Use command "python server.py" and open index.html.

Features
------------------

### Filter Restooms

By hovering over the filter tab to the right of the screen you can open a menu
of filtering options.  These options allow you to filter by gender, and various
pay options and features such as changing station or handy cap accessible.

### Select Marker By List

By hovering over the poop in the bottom left you will get access to a list of
markers.  This list will update as new markers are added, and will zoom to and
open infobox of selected marker. 

### Marker On-click Information

By clicking on a marker you can see the venue's name, the gender of the
restroom, as well as all it's other features.  In addition you can see a yelp
rating of the venue, and user ratings of the restrooms cleanliness.

### Map Right Click Features

By right clicking on the map you may easily add a new restroom to the map.  The
minimum required information for creating a restroom is the venue name and the
restroom's allowed genders.
