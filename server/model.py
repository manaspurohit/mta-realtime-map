from ariadne import QueryType
from nyct_gtfs import NYCTFeed
from api_key import *
from stops_to_coordinates import top_dict, left_dict
from train import Train
from data import ace_feed

query = QueryType()

train_id_to_previous_stop = {}
train_ids_in_transit = {}

@query.field("hello")
def resolve_hello(_, info):
  return "Hello from GraphQL!"

@query.field("trains")
def resolve_trains(_, info):
  c_train_data = ace_feed.filter_trips(line_id="A", underway=True)
  trains = map(convert_train_data, c_train_data)
  return trains

def convert_train_data(train_data):
  train_id = train_data.trip_id
  train_status, train_stop_name = get_train_status_and_stop(
    train_id,
    train_data._stops.get_station_name(train_data.location)
  )

  train = Train(
    id=train_id,
    top=top_dict[train_stop_name],
    left=left_dict[train_stop_name],
    status=train_status,
    direction=train_data.direction
  )
  return train

def get_train_status_and_stop(train_id, current_stop_name):
  if train_id not in train_id_to_previous_stop:
    print("adding train ID to previous stop dict")
    train_id_to_previous_stop[train_id] = current_stop_name

  previous_stop_name = train_id_to_previous_stop[train_id]

  if previous_stop_name == current_stop_name:
    train_status = "STOPPED"
  else:
    print("train in transit from " + previous_stop_name + " to " + current_stop_name)
    train_status = "IN_TRANSIT"
    current_stop_name = previous_stop_name
    counter = train_ids_in_transit.get(train_id, 0)
    counter += 1
    if counter == 4:
      del train_ids_in_transit[train_id]
      del train_id_to_previous_stop[train_id]
    else:
      train_ids_in_transit[train_id] = counter

  return [train_status, current_stop_name]
