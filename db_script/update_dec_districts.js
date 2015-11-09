//update dec_districts from number to real name

db.designers.update({
  "dec_districts": "0"
}, {
  "$set": {
    "dec_districts.$": "江岸区"
  }
}, true, true);
db.designers.update({
  "dec_districts": "1"
}, {
  "$set": {
    "dec_districts.$": "江汉区"
  }
}, true, true);
db.designers.update({
  "dec_districts": "2"
}, {
  "$set": {
    "dec_districts.$": "硚口区"
  }
}, true, true);
db.designers.update({
  "dec_districts": "3"
}, {
  "$set": {
    "dec_districts.$": "汉阳区"
  }
}, true, true);
db.designers.update({
  "dec_districts": "4"
}, {
  "$set": {
    "dec_districts.$": "武昌区"
  }
}, true, true);
db.designers.update({
  "dec_districts": "5"
}, {
  "$set": {
    "dec_districts.$": "洪山区"
  }
}, true, true);
db.designers.update({
  "dec_districts": "6"
}, {
  "$set": {
    "dec_districts.$": "青山区"
  }
}, true, true);
