# import os, base64, re, math, json, requests, time, random
import json, os
# import urllib.parse
from flask import Flask, render_template, send_file, url_for, redirect#, redirect#, jsonify, make_response, escape, request
from threading import Thread#, Lock
from flask_assets import Environment
# from flask_mobility import Mobility
from waitress import serve
from griditems import grid_items
from flask_caching import Cache
from stx import sz_stickers_index#, sz_stickers


cache_cfg = {
    "DEBUG": False,
    "CACHE_TYPE": "SimpleCache",
    "CACHE_DEFAULT_TIMEOUT": 250
}

app = Flask(__name__)
assets = Environment(app)
assets.url = app.static_url_path
app.config.from_mapping(cache_cfg)
cache = Cache(app)

HOME_DIR = os.path.realpath(os.path.join(os.environ.get('HOME'), os.environ.get('REPL_SLUG')))
BASE_URL = os.environ.get('CUSTOM_DNS', f"https://{os.environ.get('REPL_SLUG')}.{os.environ.get('REPL_OWNER')}.repl.co".lower())
STATIC_DIR = os.path.realpath(os.path.join(HOME_DIR, 'static'))
STATPATHS = [f for f in os.listdir(STATIC_DIR) if os.path.isdir(os.path.join(STATIC_DIR, f))]

WILL_SERVE = ['.png', '.gif', '.jpg', '.jpeg', '.json', '.js', '.html', '.css', '.py', '.zip']

gi = '\n'.join(grid_items)

stickers = {}
stickers_i = {}
with open('static/json/stickers.json', 'r') as fp:
    stickers = json.loads(fp.read())

with open('static/json/stickers_i.json', 'r') as fp:
    stickers_i = json.loads(fp.read())
  
stickernames = list(stickers_i.keys())
stickerids = list(stickers.keys())

def truthy(inpt) -> bool:
  try:
    return bool(eval(inpt.title()))
  except Exception:
    return False

def chk_trunc(_route):
  routebase = os.path.splitext(os.path.basename(_route))[0]
  routepath = os.path.split(os.path.realpath(_route))[0]
  _match = [f for f in os.listdir(os.path.split(_route)[0]) if all([
    routebase in f,
    os.path.splitext(os.path.basename(f))[0][0] != '.', 
    os.path.splitext(os.path.basename(f))[1] in WILL_SERVE,
    os.path.isfile(os.path.join(routepath, f))])]
  return (None if len(_match) == 0 else _match[0])

def mkurl(id):
  try: 
    return url_for('static', f'glyphs/{id}.png')
  except:
    return f"{BASE_URL}static/glyphs/{id}.png"
  
def rmurl(name):
  tmp = name.replace('.png', '')
  if '/' in tmp: 
    tmp = tmp.split('/')[:-1]
  return tmp

@app.route('/')
@cache.cached()
def index():
    return render_template('index.html', griditems=gi)

@app.route('/home')
def home():
    return redirect(url_for("index"))

@app.route('/index.html')
def idxhtml():
    return redirect(url_for("index"))

@app.route('/static.zip')
@cache.cached()
def static_zip():
    return send_file('static/static.zip')

@app.route('/remaining.json')
def remaining():
    return send_file('remaining.json')

@app.route('/all_with_data.json')
def all_w_data():
    return send_file('static/json/all_with_data.json')

@app.route('/request_data.json')
def req_data():
    return send_file('static/json/requestData.json')

@app.route('/all.json')
@cache.cached()
def all_json():
    return send_file('static/json/all.json')

@app.route('/static/<_rq>')
@cache.cached()
def redir_glyph(_rq):
  requested = _rq.split('.')[0].lower()
  if requested in [*stickernames, *stickerids] and os.environ.get('CF_WORKER') is not None:
    return redirect(f'{os.environ.get("CF_WORKER")}/{requested}')
  for _route in [os.path.join(STATIC_DIR, _ea, _rq) for _ea in STATPATHS]:
    if os.path.isfile(_route):
      return send_file(_route)
    elif chk_trunc(_route) is not None:
      return send_file(chk_trunc(_route))  
  return render_template('404.html')
    

@app.get('/lookup/<_emoji>')
@cache.cached()
def lookup(_emoji):
    emoji = _emoji.replace('.png', '')
    if emoji.isdigit():
      if emoji in stickerids:  
        return render_template('lookup_id.html', emoji_url=mkurl(emoji), emoji_id=emoji)
      return render_template('404.html')
    if rmurl(emoji) in stickernames:
        return render_template('lookup_id.html', emoji_url=mkurl(stickers_i[rmurl(emoji)]['code']), emoji_id=stickers_i[rmurl(emoji)]['code'])
    return render_template('404.html')
    
@app.get('/stickers/<sticker_id>')
@cache.cached()
def get_sticker(sticker_id):
  if str(sticker_id).split('.')[0] in sz_stickers_index.values():
    #return send_file(f'static/stickers/{str(sticker_id).split(".")[0]}.gif')
    return redirect(f'https://moj.djstomp.win/static/stickers/{str(sticker_id).split(".")[0]}.gif')
  elif str(sticker_id).split('.')[0] in sz_stickers_index:
    #return send_file(f'static/stickers/{sz_stickers_index[str(sticker_id).split(".")[0]]}.gif')
    return redirect(f'https://moj.djstomp.win/static/stickers/{sz_stickers_index[str(sticker_id).split(".")[0]]}.gif')
  else:
    return render_template('404.html')
  
def run():
    serve(app, host='0.0.0.0')

def run_local():
    app.run(debug=True, host='127.0.0.1')

if __name__ == "__main__":
    if truthy(os.environ.get('DEBUG_MODE', False)):
      run_local()
    else:
      t = Thread(target=run)
      t.start()
