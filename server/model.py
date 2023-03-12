from ariadne import QueryType
from nyct_gtfs import NYCTFeed
from api_key import *
from stops_to_coordinates import top_dict, left_dict
from train import Train

query = QueryType()

ace_feed = NYCTFeed("A", api_key=api_key)

@query.field("hello")
def resolve_hello(_, info):
  return "Hello from GraphQL!"

@query.field("trains")
def resolve_trains(_, info):
  ace_feed.refresh()
  c_train_data = ace_feed.filter_trips(line_id="C", underway=True)
  trains = map(convert_train_data, c_train_data)
  return trains

def convert_train_data(train_data):
  train_stop_name = train_data._stops.get_station_name(train_data.location)
  train_status = "STOPPED" if train_data.location_status == "STOPPED_AT" else "IN_TRANSIT"

  train = Train(
    id=train_data.trip_id,
    top=top_dict[train_stop_name],
    left=left_dict[train_stop_name],
    status=train_status,
    direction=train_data.direction
  )
  return train
