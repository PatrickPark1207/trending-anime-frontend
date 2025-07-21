from flask import Flask, jsonify
import requests
from flask_cors import CORS
import re
import datetime

app = Flask(__name__)
CORS(app)

def get_trending_anime():
    query = """
    query ($page: Int, $perPage: Int) {
        Page (page: $page, perPage: $perPage) {
            media (sort: TRENDING_DESC, type: ANIME) {
                rank: popularity
                title {
                    romaji
                    english
                }
                coverImage {
                    large
                }
            }
        }
    }
    """
    variables = {
        'page': 1,
        'perPage': 20
    }
    url = 'https://graphql.anilist.co'
    
    try:
        response = requests.post(url, json={'query': query, 'variables': variables})
        response.raise_for_status()  # Raise an exception for bad status codes
        data = response.json()
        
        anime_list = []
        media_items = data.get('data', {}).get('Page', {}).get('media', [])
        
        for i, media in enumerate(media_items):
            title = media.get('title', {}).get('english') or media.get('title', {}).get('romaji')
            image_url = media.get('coverImage', {}).get('large')
            
            if title and image_url:
                anime_list.append({
                    "rank": i + 1,
                    "title": title,
                    "imageUrl": image_url
                })
        return anime_list
        
    except requests.exceptions.RequestException as e:
        print(f"Error fetching from AniList API: {e}")
        return []

# 하루에 한 번만 AniList에서 받아오고, 같은 날에는 캐시된 데이터 반환
cached_trending = None
last_update_date = None

def fetch_trending_anime_full():
    query = '''
    query ($page: Int, $perPage: Int) {
        Page (page: $page, perPage: $perPage) {
            media (sort: TRENDING_DESC, type: ANIME) {
                title {
                    romaji
                    english
                    native
                }
                coverImage {
                    large
                }
            }
        }
    }
    '''
    variables = {
        'page': 1,
        'perPage': 20
    }
    url = 'https://graphql.anilist.co'
    response = requests.post(url, json={'query': query, 'variables': variables})
    data = response.json()
    trending = []
    rank = 1
    for media in data['data']['Page']['media']:
        title = media['title']['english'] or media['title']['romaji']
        image_url = media['coverImage']['large']
        trending.append({
            'rank': rank,
            'title': title,
            'imageUrl': image_url
        })
        rank += 1
    return trending

@app.route('/api/trending')
def get_trending():
    global cached_trending, last_update_date
    today = datetime.date.today()
    if last_update_date != today or cached_trending is None:
        cached_trending = fetch_trending_anime_full()
        last_update_date = today
    return jsonify(cached_trending)

if __name__ == '__main__':
    app.run(debug=True)
