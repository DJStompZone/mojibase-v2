# import os, base64, re, math, json, requests, time, random
import json, os
# import urllib.parse
from flask import Flask, render_template, send_file, url_for#, redirect#, jsonify, make_response, escape, request
from threading import Thread#, Lock
from flask_assets import Environment
# from flask_mobility import Mobility
from waitress import serve
from griditems import grid_items
from flask_caching import Cache

config = {
    "DEBUG": True,          # some Flask specific configs
    "CACHE_TYPE": "SimpleCache",  # Flask-Caching related configs
    "CACHE_DEFAULT_TIMEOUT": 300
}

app = Flask(__name__)
assets = Environment(app)
assets.url = app.static_url_path
app.config.from_mapping(config)
cache = Cache(app)

HOME_DIR = os.path.realpath(os.path.join(os.environ.get('HOME'), os.environ.get('REPL_SLUG')))
BASE_URL = f"https://{os.environ.get('REPL_SLUG')}.{os.environ.get('REPL_OWNER')}.repl.co".lower()

static_exts = {
  'css': f'{BASE_URL}/static/css/',
  'js': f'{BASE_URL}/static/js/', 
  'json': f'{BASE_URL}/static/json/', 
  'py': f'{BASE_URL}/static/py/', 
  'zip': f'{BASE_URL}/static/zip/'
}

stickers = {}
stickers_i = {}
with open('static/stickers.json', 'r') as fp:
    stickers = json.loads(fp.read())

with open('static/stickers_i.json', 'r') as fp:
    stickers_i = json.loads(fp.read())
  
stickernames = list(stickers_i.keys())
stickerids = list(stickers.keys())


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
@cache.cached(timeout=250)
def index():
    gi = '\n'.join(grid_items)
    return render_template('index.html', griditems=gi)

@app.route('/static.zip')
def static_zip():
    return send_file('static/static.zip')

@app.route('/static/<glyphcheck>')
@cache.cached(timeout=250)
def redir_glyph(glyphcheck):
  if glyphcheck.endswith('.png'):
    targetfile = os.path.join('static/glyphs', glyphcheck)
    return send_file(targetfile) if os.path.isfile(targetfile) else render_template('404.html')
  elif os.path.isfile(os.path.join('static', glyphcheck)):
    return send_file(os.path.join('static', glyphcheck))
  elif '.' in glyphcheck and glyphcheck.split('.')[-1] in list(static_exts.keys()) and os.path.isfile(os.path.join(HOME_DIR, 'static', glyphcheck.split('.')[-1], glyphcheck)):
    return send_file(os.path.join(HOME_DIR, 'static', glyphcheck.split('.')[-1], glyphcheck))
  else:
    return render_template('404.html')
    

@app.get('/lookup/<_emoji>')
def lookup(_emoji):
    emoji = _emoji.replace('.png', '')
    if emoji.isdigit():
      if emoji in stickerids:  
        return render_template('lookup_id.html', emoji_url=mkurl(emoji), emoji_id=emoji)
      return render_template('404.html')
    if rmurl(emoji) in stickernames:
        return render_template('lookup_id.html', emoji_url=mkurl(stickers_i[rmurl(emoji)]['code']), emoji_id=stickers_i[rmurl(emoji)]['code'])
    return render_template('404.html')
    

def run():
    serve(app, host='0.0.0.0')


if __name__ == "__main__":
    t = Thread(target=run)
    t.start()
    # Debug mode
    # app.run(debug=True, host='0.0.0.0')
  # run()
