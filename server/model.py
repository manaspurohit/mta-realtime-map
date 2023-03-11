from ariadne import QueryType
from nyct_gtfs import NYCTFeed
from api_key import *

query = QueryType()

ace_feed = NYCTFeed("A", api_key=api_key)

@query.field("hello")
def resolve_hello(_, info):
  return "Hello from GraphQL!"

@query.field("trains")
def resolve_trains(_, info):
  ace_feed.refresh()
  c_trains = ace_feed.filter_trips(line_id="C", underway=True)
  trains_with_coordinates = map(train_to_coordinates, c_trains)
  return trains_with_coordinates

def train_to_coordinates(train):
  train_stop = train._stops.get_station_name(train.location)
  train_coordinates = Train(top_dict[train_stop], left_dict[train_stop])
  return train_coordinates


top_dict = {
  'Inwood-207 St': 15.795520254416688,
  'Dyckman St': 17.23147660134374,
  '190 St': 18.55255644051663,
  '181 St': 19.816198025812437,
  '175 St': 21.5393456421249,
  '168 St': 23.090178058587018,
  '163 St-Amsterdam Av': 24.23894313612866,
  '155 St': 25.78977599080988,
  '145 St': 27.742676622630672,
  '135 St': 29.695577254451464,
  '125 St': 31.016657093624353,
  '116 St': 32.45261344055141,
  'Cathedral Pkwy (110 St)': 33.71625502584721,
  '103 St': 35.841470419299256,
  '96 St': 37.622056289488796,
  '86 St': 39.2303273980471,
  '81 St-Museum of Natural History': 40.4939689833429,
  '72 St': 42.4468696151637,
  '59 St-Columbus Circle': 46.122917863296955,
  '50 St': 48.5353245261344,
  '42 St-Port Authority Bus Terminal': 49.85640436530729,
  '34 St-Penn Station': 51.75186674325101,
  '23 St': 54.049396898334294,
  '14 St': 55.829982768523834,
  'W 4 St-Wash Sq': 58.5295807007467,
  'Spring St': 61.458931648477886,
  'Canal St': 62.665134979896614,
  'Chambers St': 64.84778862722574,
  'Fulton St': 67.5473865594486,
  'High St': 66.2263067202757,
  'Jay St-MetroTech': 68.06433084434234,
  'Hoyt-Schermerhorn Sts': 69.90235496840896,
  'Lafayette Av': 68.23664560597358,
  'Clinton-Washington Avs': 67.60482481332568,
  'Franklin Av': 66.28374497415278,
  'Nostrand Av': 65.36473291211948,
  'Kingston-Throop Avs': 64.50315910396324,
  'Utica Av': 62.722573233773694,
  'Ralph Av': 61.401493394600806,
  'Rockaway Av': 60.137851809305,
  'Broadway Junction': 58.47214244686962,
  'Liberty Av': 59.04652498564044,
  'Van Siclen Av': 58.87421022400919,
  'Shepherd Av': 58.07007466973004,
  'Euclid Av': 56.80643308443423,
  'Broadway-Lafayette St': 60.36760482481333,
  '2 Av': 60.36760482481333,
  'Delancey St-Essex St': 61.80356117174038,
  'East Broadway': 62.952326249282024,
  'York St': 64.330844342332,
}

# consider changing 11.875 to 11.73611111111111
left_dict = {
  'Inwood-207 St': 9.23611111111111,
  'Dyckman St': 7.847222222222222,
  '190 St': 6.944444444444445,
  '181 St': 6.666666666666667,
  '175 St': 7.361111111111111,
  '168 St': 8.819444444444445,
  '163 St-Amsterdam Av': 9.791666666666666,
  '155 St': 11.38888888888889,
  '145 St': 11.805555555555555,
  '135 St': 11.875,
  '125 St': 11.875,
  '116 St': 11.875,
  'Cathedral Pkwy (110 St)': 11.875,
  '103 St': 11.875,
  '96 St': 11.875,
  '86 St': 11.875,
  '81 St-Museum of Natural History': 11.875,
  '72 St': 11.875,
  '59 St-Columbus Circle': 11.875,
  '50 St': 11.875,
  '42 St-Port Authority Bus Terminal': 11.875,
  '34 St-Penn Station': 11.875,
  '23 St': 11.875,
  '14 St': 12.083333333333334,
  'W 4 St-Wash Sq': 19.305555555555557,
  'Spring St': 19.375,
  'Canal St': 19.375,
  'Chambers St': 19.583333333333332,
  'Fulton St': 23.958333333333332,
  'High St': 37.5,
  'Jay St-MetroTech': 41.041666666666664,
  'Hoyt-Schermerhorn Sts': 43.75,
  'Lafayette Av': 47.43055555555556,
  'Clinton-Washington Avs': 49.791666666666664,
  'Franklin Av': 53.263888888888886,
  'Nostrand Av': 55.06944444444444,
  'Kingston-Throop Avs': 56.666666666666664,
  'Utica Av': 59.583333333333336,
  'Ralph Av': 61.80555555555556,
  'Rockaway Av': 63.888888888888886,
  'Broadway Junction': 65.90277777777777,
  'Liberty Av': 70,
  'Van Siclen Av': 71.59722222222223,
  'Shepherd Av': 73.47222222222223,
  'Euclid Av': 74.93055555555556,
  'Broadway-Lafayette St': 24.166666666666668,
  '2 Av': 27.916666666666668,
  'Delancey St-Essex St': 29.86111111111111,
  'East Broadway': 30.48611111111111,
  'York St': 39.30555555555556,
}

class Train:
  def __init__(self, top, left):
    self.top = top
    self.left = left