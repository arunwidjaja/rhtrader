import robin_stocks.robinhood as r
from dotenv import load_dotenv
import os
load_dotenv()

email = os.getenv("RH_EMAIL")
pw = os.getenv("RH_PW")


login = r.login(email, pw)
