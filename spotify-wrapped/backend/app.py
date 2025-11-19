"""
The app.py file establishes the backend server that the frontend will call to complete tasks like:
- Login
- Callback
- Return Information (Top Artists/Top Tracks) 
"""
import os
from flask import Flask, redirect, request, session
from dotenv import load_dotenv
from urllib.parse import urlencode
import secrets

load_dotenv()

app = Flask(__name__) #Creates Flask Application Instance
app.secret_key = os.getenv("FLASK_SECRET_KEY", "dev-secret") #Sets Secret Key for Session Signing & Security

SPOTIFY_CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID") #
SPOTIFY_CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")
REDIRECT_URI = os.getenv("REDIRECT_URI")

@app.route("/") #Defines route - runs when http://127.0.0.1:5000 is visited
def index():
  return "Testing Backend!"

SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize" #Base URL for Spotify
SCOPES = "user-read-email user-read-private user-top-read user-read-recently-played" #Permissions this app is requesting from user

@app.route("/login") #Defines login route - runs when "Login to Spotify Clicked" goes to http://127.0.0.1:5000/login
def login():
  state = secrets.token_urlsafe(16) #Generates random, secure string to later authenticate (security)
  session["oauth_state"] = state

  params = {
    "client_id": SPOTIFY_CLIENT_ID, 
    "response_type": "code",
    "redirect_uri": REDIRECT_URI,
    "scope": SCOPES,
    "state": state,
    "show_dialog": "true",
  }

  url = f"{SPOTIFY_AUTH_URL}?{urlencode(params)}" #Builds complete URL to Spotify's Login Page w/ all query parameters
  return redirect(url) #Takes user to OAuth page

if __name__ == "__main__": #Only runs if we execute 'python app.py' directly
  app.run(host="127.0.0.1", port=5000, debug=True) #Starts Flask dev server on localhost:5000 (debug=True auto reloads code for edits)