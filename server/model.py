from ariadne import QueryType
from nyct_gtfs import NYCTFeed
from api_key import *
from stops_to_coordinates import top_dict, left_dict
from train import Train
from data import line_to_feed, line_to_number, number_to_line

query = QueryType()

max_counter = 10
train_id_to_previous_stop = {}
train_ids_in_transit = {}

@query.field("hello")
def resolve_hello(_, info):
  return "Hello from GraphQL!"

@query.field("trains")
def resolve_trains(*_, lines):
  # should dedup lines: https://stackoverflow.com/questions/6764909/how-to-remove-all-duplicate-items-from-a-list
  train_data = []
  for line_with_direction in lines:
    line = line_with_direction['line']
    direction = line_with_direction['direction']
    if line in line_to_number:
      line = line_to_number[line]
    line_data = line_to_feed[line].filter_trips(line_id=line, travel_direction=direction, underway=True)
    train_data.extend(line_data)

  trains = map(convert_train_data, train_data)
  return trains

def convert_train_data(train_data):
  train_id = train_data.trip_id
  train_stop_name = train_data.location[:-1]
  train_status = get_train_status(train_id, train_stop_name)
  if train_status == "IN_TRANSIT":
    previous_stop_name = train_id_to_previous_stop[train_id]
    counter = train_ids_in_transit[train_id]
    top_step = ((top_dict[train_stop_name] - top_dict[previous_stop_name]) / max_counter) * counter
    left_step = ((left_dict[train_stop_name] - left_dict[previous_stop_name]) / max_counter) * counter
    top = top_dict[previous_stop_name] + top_step
    left = left_dict[previous_stop_name] + left_step
  else:
    top = top_dict[train_stop_name]
    left = left_dict[train_stop_name]

  line = train_data.route_id
  if line in number_to_line:
    line = number_to_line[line]
  train = Train(
    id=train_id,
    top=top,
    left=left,
    status=train_status,
    line=line,
    direction=train_data.direction
  )
  return train

def get_train_status(train_id, current_stop_name):
  if train_id not in train_id_to_previous_stop:
    print("adding train ID to previous stop dict")
    train_id_to_previous_stop[train_id] = current_stop_name

  previous_stop_name = train_id_to_previous_stop[train_id]

  if previous_stop_name == current_stop_name:
    return "STOPPED"
  else:
    print("train in transit from " + previous_stop_name + " to " + current_stop_name)
    current_stop_name = previous_stop_name
    counter = train_ids_in_transit.get(train_id, 0)
    counter += 1
    if counter == max_counter:
      del train_ids_in_transit[train_id]
      del train_id_to_previous_stop[train_id]
      return "STOPPED"
    else:
      train_ids_in_transit[train_id] = counter
      return "IN_TRANSIT"