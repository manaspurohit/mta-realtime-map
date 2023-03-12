from api_key import *
from nyct_gtfs import NYCTFeed
import threading, time

ace_feed = NYCTFeed("A", api_key=api_key)
# bdfm_feed = NYCTFeed("F", api_key=api_key)
# g_feed = NYCTFeed("G", api_key=api_key)
# jz_feed = NYCTFeed("J", api_key=api_key)
# nqrw_feed = NYCTFeed("N", api_key=api_key)
# l_feed = NYCTFeed("L", api_key=api_key)
# one234567_feed = NYCTFeed("1", api_key=api_key)

def refresh_data():
  seconds = 1
  while True:
    ace_feed.refresh()
    time.sleep(seconds)

thread = threading.Thread(target=refresh_data, daemon=True)
thread.start()