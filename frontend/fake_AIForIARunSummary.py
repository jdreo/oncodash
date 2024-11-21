from flask import Flask, json

iarun = {
  "iaSummary": {
    "items": [
      {
        "image": "string",
        "roi": "string",
        "analysisBatch": "string",
        "aiModelName": "string",
        "colorChannelCount": 0,
        "classLabel": "string",
        "classAlias": "string",
        "layerName": "string",
        "areaPercentage": 0,
        "countPercentage": 0,
        "count": 0,
        "area_mm2": 0,
        "confidenceAvg": 0,
        "contentType": "Unknown",
        "averageLengthUm": 0,
        "averageWidthUm": 0,
        "averageCircumferenceUm": 0
      }
    ]
  }
}

api = Flask(__name__)

url='/v2/analysis/iaruns/<iaRunID>/summary'

@api.route(url, methods=['GET'])
def getAIForIARunSummary(iaRunID):
  print("Asked for:",iaRunID)
  return json.dumps(iarun)

if __name__ == '__main__':
    port = 9999
    print("Wait for:",url)
    print("On port:", port)
    api.run(port = port)
