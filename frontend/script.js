document.addEventListener('DOMContentLoaded', function() {
    fetch('https://trending-anime-backend.onrender.com/api/trending')
        .then(response => response.json())
        .then(data => {
            // 날짜 정보 업데이트
            const updateDateElement = document.getElementById('update-date');
            const descriptionElement = document.getElementById('description');
            
            if (data.lastUpdated) {
                const updateDate = data.lastUpdated;
                updateDateElement.textContent = `Most Popular Anime Series – Updated: ${updateDate}`;
                descriptionElement.innerHTML = `Welcome to the ultimate <strong>Top 20 Trending Anime</strong> list! Discover the most popular anime series, <strong>updated every day</strong> (last update: ${updateDate}) based on real-time trends from AniList. Find your next favorite anime and see what's hot in the anime world right now.`;
                
                // 메타 태그들도 동적으로 업데이트
                document.title = `Top 20 Trending Anime | Most Popular Anime List (Updated: ${updateDate})`;
                document.querySelector('meta[name="description"]').setAttribute('content', `Discover the Top 20 Trending Anime! Updated daily (${updateDate}) with the most popular anime series worldwide. Find your next favorite anime here.`);
                document.querySelector('meta[property="og:title"]').setAttribute('content', `Top 20 Trending Anime | Most Popular Anime List (Updated: ${updateDate})`);
                document.querySelector('meta[property="og:description"]').setAttribute('content', `Discover the Top 20 Trending Anime! Updated daily (${updateDate}) with the most popular anime series worldwide.`);
                document.querySelector('meta[name="twitter:title"]').setAttribute('content', `Top 20 Trending Anime | Most Popular Anime List (Updated: ${updateDate})`);
                document.querySelector('meta[name="twitter:description"]').setAttribute('content', `Discover the Top 20 Trending Anime! Updated daily (${updateDate}) with the most popular anime series worldwide.`);
            }
            
            const top3Row = document.getElementById('top3-row');
            const restRow = document.getElementById('rest-row');
            
            // anime 배열에서 데이터 추출
            const animeData = data.anime || data;
            
            // 1~3등
            animeData.slice(0, 3).forEach((anime, idx) => {
                const card = document.createElement('div');
                card.classList.add('anime-card');
                card.style.width = '220px';
                card.style.textAlign = 'center';
                card.style.background = '#fff8e1';
                card.style.border = '2.5px solid #ffd54f';
                card.style.borderRadius = '16px';
                card.style.boxShadow = '0 4px 16px rgba(0,0,0,0.10)';
                card.style.padding = '18px 10px 22px 10px';
                card.style.position = 'relative';
                card.style.cursor = 'pointer';

                // 왕관 색상 지정
                let crownColor = '#FFD700'; // gold (1등)
                let crownStroke = '#FFC107';
                if (idx === 1) { // 2등
                    crownColor = '#C0C0C0'; // silver
                    crownStroke = '#B0B0B0';
                } else if (idx === 2) { // 3등
                    crownColor = '#CD7F32'; // bronze
                    crownStroke = '#B87333';
                }

                // 베이스가 삼각형 3개(양옆 직각, 가운데 이등변)인 왕관 SVG
                const crown = document.createElement('div');
                crown.innerHTML = `
                <svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:block;">
                  <path d="M5 35 L10 15 L20 30 L30 10 L40 30 L50 15 L55 35 Z" fill="${crownColor}" stroke="${crownStroke}" stroke-width="2"/>
                  <circle cx="10" cy="15" r="3" fill="${crownColor}" stroke="${crownStroke}" stroke-width="1.2"/>
                  <circle cx="30" cy="10" r="3" fill="${crownColor}" stroke="${crownStroke}" stroke-width="1.2"/>
                  <circle cx="50" cy="15" r="3" fill="${crownColor}" stroke="${crownStroke}" stroke-width="1.2"/>
                </svg>
                `;
                crown.style.position = 'absolute';
                crown.style.top = '-32px';
                crown.style.right = '10px';
                crown.style.width = '54px';
                crown.style.height = '36px';
                crown.style.transform = 'rotate(0deg)';
                crown.style.pointerEvents = 'none';
                crown.style.zIndex = '2';
                card.appendChild(crown);
                card.style.overflow = 'visible';

                const rank = document.createElement('div');
                rank.classList.add('rank');
                rank.textContent = `#${anime.rank}`;
                rank.style.fontWeight = 'bold';
                rank.style.fontSize = '1.5em';
                rank.style.color = '#ff9800';
                rank.style.marginBottom = '8px';

                const img = document.createElement('img');
                img.src = anime.imageUrl;
                img.alt = anime.title;
                img.style.width = '100%';
                img.style.borderRadius = '10px';
                img.style.marginBottom = '10px';

                const title = document.createElement('div');
                title.classList.add('title');
                title.textContent = anime.title;
                title.style.fontWeight = 'bold';
                title.style.fontSize = '1.18em';
                title.style.marginTop = '6px';

                card.appendChild(rank);
                card.appendChild(img);
                card.appendChild(title);
                // 클릭 시 구글 검색 새 창
                card.addEventListener('click', () => {
                    const q = encodeURIComponent(anime.title);
                    window.open(`https://www.google.com/search?q=${q}`, '_blank');
                });
                top3Row.appendChild(card);
            });
            // 4~20등
            animeData.slice(3).forEach(anime => {
                const card = document.createElement('div');
                card.classList.add('anime-card');
                card.style.width = '140px';
                card.style.textAlign = 'center';
                card.style.background = '#f5f5f5';
                card.style.border = '1px solid #e0e0e0';
                card.style.borderRadius = '8px';
                card.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)';
                card.style.padding = '8px 4px 12px 4px';
                card.style.position = 'relative';
                card.style.cursor = 'pointer';

                const rank = document.createElement('div');
                rank.classList.add('rank');
                rank.textContent = `#${anime.rank}`;
                rank.style.fontWeight = 'bold';
                rank.style.fontSize = '1em';
                rank.style.color = '#757575';
                rank.style.marginBottom = '4px';

                const img = document.createElement('img');
                img.src = anime.imageUrl;
                img.alt = anime.title;
                img.style.width = '100%';
                img.style.borderRadius = '6px';
                img.style.marginBottom = '6px';

                const title = document.createElement('div');
                title.classList.add('title');
                title.textContent = anime.title;
                title.style.fontWeight = 'bold';
                title.style.fontSize = '0.95em';
                title.style.marginTop = '2px';

                card.appendChild(rank);
                card.appendChild(img);
                card.appendChild(title);
                // 클릭 시 구글 검색 새 창
                card.addEventListener('click', () => {
                    const q = encodeURIComponent(anime.title);
                    window.open(`https://www.google.com/search?q=${q}`, '_blank');
                });
                restRow.appendChild(card);
            });
        })
        .catch(error => console.error('Error fetching trending anime data:', error));
});