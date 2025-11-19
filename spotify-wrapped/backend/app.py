"""
The app.py file establishes the backend server that the frontend will call to complete tasks like:
- Login
- Callback
- Return Information (Top Artists/Top Tracks) 
"""
import os
from flask import Flask
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__) #Creates Flask Application Instance
app.secret_key = os.getenv("FLASK_SECRET_KEY", "dev-secret") #Sets Secret Key for Session Signing & Security

SPOTIFY_CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID") #
SPOTIFY_CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")
REDIRECT_URI = os.getenv("REDIRECT_URI")

@app.route("/") #Defines route - runs when http://127.0.0.1:5000 is visited
def index():
  return "Testing Backend_AA -- Success!"

if __name__ == "__main__": #Only runs if we execute 'python app.py' directly
  app.run(host="127.0.0.1", port=5000, debug=True) #Starts Flask dev server on localhost:5000 (debug=True auto reloads code for edits)