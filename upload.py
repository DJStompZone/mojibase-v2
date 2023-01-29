import requests
import os, json

def send_single(key, value, type="text"):
  url = f'https://api.cloudflare.com/client/v4/accounts/7b8e91c3be02e5133fb4d5954d609f8d/storage/kv/namespaces/8534bbdf6e894ee087dced7ae7904ebf/values/{key}'
  payload=value
  
  headers = {
    'Authorization': 'Bearer mAkNt1DK6g8shnoT-TySHFBiF4-bvA9PBa5uuuj4',
    'Cookie': '__cflb=0H28vgHxwvgAQtjUGUFqYFDiSDreGJnUsnaLmg5Hbpy; __cfruid=a4e6345f2c8b2c57c056f58288388df6a3dd6df4-1673338223',
    'type': type
  }
  print(f"Uploading to {key}, response: ", end="", flush=True)
  response = requests.request("PUT", url, headers=headers, data=payload)
  print(f"{'Success!' if response.status_code==200 else 'Problem! '+str(response.status_code)}", end="\n", flush=True)

def send_requests():
  json_data = []
  with open('./requestData.json', 'r') as fp:
    json_data = json.loads(fp.read())
    for sticker in json_data:
      if sticker["key"] > 60980:
        send_single(sticker)

if __name__ == "__main__":
  send_requests()