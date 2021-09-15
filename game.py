import sqlite3

from flask import Flask, redirect, render_template, request

# Configure application to the var 'game'
game = Flask(__name__)

# Enable templates to be auto-reloaded
game.config["TEMPLATES_AUTO_RELOAD"] = True

# Connect database to the game
con = sqlite3.connect('game.db', check_same_thread=False)
con.row_factory = sqlite3.Row
db = con.cursor()

@game.route('/', methods=["GET", "POST"])
def index():
    if request.method == "POST":
        return redirect("/")
    else:
        return render_template("index.html")

@game.route('/state', methods=["GET", "POST"])
def checkState():
    if request.method == "POST":
        db.execute("UPDATE phone SET state = ?", (request.get_data(as_text=True),))
        return {}
    else:
        db.execute("SELECT state FROM phone")
        for row in db:
            state = row["state"]
        return state

@game.route('/screen', methods=["GET", "POST"])
def checkScreen():
    if request.method == "POST":
        db.execute("UPDATE phone SET screen = ?", (request.get_data(as_text=True),))
        return {}
    else:
        db.execute("SELECT screen FROM phone")
        for row in db:
            screen = row["screen"]
        return screen

@game.route('/check', methods=["POST"])
def checkPassword():

    db.execute("SELECT password FROM phone")
    for row in db:
        password = row["password"]

    if request.get_data(as_text=True) == password:
        return {'correct': True}
    else:
        return {'correct': False}

if __name__ == "__main__":
    game.run()
