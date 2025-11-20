"""
The app.py file establishes the backend server that the frontend will call to complete tasks like:
- Login
- Callback
- Return Information (Top Artists/Top Tracks) 
"""
from flask import Flask, redirect, request, session, jsonify
from dotenv import load_dotenv
from urllib.parse import urlencode
import os
import secrets
import base64
import requests

load_dotenv()

app = Flask(__name__) #Creates Flask Application Instance
app.secret_key = os.getenv("FLASK_SECRET_KEY", "dev-secret") #Sets Secret Key for Session Signing & Security

SPOTIFY_CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID") 
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

SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token" #Endpoint where app exchanges "code" for access + refresh tokens
SPOTIFY_API_BASE = "https://api.spotify.com/v1" #Base URL for all Spotify Web API requests

def get_basic_auth_header(): #Constructs authentication header used to obtain access tokens
  client_creds = f"{SPOTIFY_CLIENT_ID}:{SPOTIFY_CLIENT_SECRET}" #Combines client id + client secret in the format Spotify expects
  client_creds_b64 = base64.b64encode(client_creds.encode()).decode() #Encode in Base64 for authentication
  return {
    "Authorization": f"Basic {client_creds_b64}", #Spotify requires Basic Auth for token exhange
    "Content-Type": "application/x-www-form-urlencoded", #Required content type for POST request to /api/token
  }

@app.route("/callback") #Defines callback route - redirects users after they log in
def callback():
  code = request.args.get("code") #Spotify sends authorization code 
  error = request.args.get("error")
  state = request.args.get("state")

  if error:
    return f"Spotify error: {error}", 400
  
  saved_state = session.get("oauth_state")
  if not state or state != saved_state:
    return "State mismatch - possible CSRF attack", 400
  
  session.pop("oauth_state", None)

  data = {
    "grant_type": "authorization_code",
    "code": code,
    "redirect_uri": REDIRECT_URI,
  }

  token_res = requests.post( #Sends POST request to Spotify to exchange "code" for access + refresh tokens
    SPOTIFY_TOKEN_URL,
    data=data,
    headers=get_basic_auth_header()
  )

  if token_res.status_code != 200:
    return f"Failed to get token: {token_res.text}", 400
  
  token_info = token_res.json() #Parse JSON response containing access token, refresh token, expires_in

  access_token = token_info["access_token"]
  refresh_token = token_info["refresh_token"]
  expires_in = token_info["expires_in"]

  #Temporarily stores tokens in session (to be later stored in DB)
  session["access_token"] = access_token 
  session["refresh_token"] = refresh_token
  session["expires_in"] = expires_in

  headers = {"Authorization": f"Bearer {access_token}"}
  me_res = requests.get(f"{SPOTIFY_API_BASE}/me", headers=headers)
  user_profile = me_res.json()
  session["spotify_user_id"] = user_profile.get("id")
  session["spotify_display_name"] = user_profile.get("display_name")

  return redirect("https://127.0.0.1:3000/dashboard") #After successful login, redirect user to React app's Dashboard

def get_auth_header_from_session(): #Helper function that retrieves the saved access token from session
  access_token = session.get("access_token")
  if not access_token:
    return None
  return {"Authorization": f"Bearer {access_token}"} #Build and return authorization header in exact format

@app.route("/api/me") #Defines api/me route - used by frontend to get user's Spotify profile
def api_me():
  headers = get_auth_header_from_session()
  if not headers:
    return jsonify({"error": "Not logged in"}), 401
  
  res = requests.get(f"{SPOTIFY_API_BASE}/me", headers=headers) #Make a GET request to Spotify's /me endpoint using saved access token
  return jsonify(res.json(), res.status_code) #Return JSON response from Spotify directly from frontend

if __name__ == "__main__": #Only runs if we execute 'python app.py' directly
  app.run(host="127.0.0.1", port=5000, debug=True) #Starts Flask dev server on localhost:5000 (debug=True auto reloads code for edits)