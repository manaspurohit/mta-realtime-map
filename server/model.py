from ariadne import QueryType
from nyct_gtfs import NYCTFeed
from api_key import *

query = QueryType()

ace_feed = NYCTFeed("A", api_key=api_key)
c_trains = ace_feed.filter_trips(line_id="C", travel_direction="N", underway=True)

@query.field("hello")
def resolve_hello(_, info):
  return "Hello from GraphQL!"

@query.field("trains")
def resolve_trains(_, info):
  return list(map(str, c_trains))