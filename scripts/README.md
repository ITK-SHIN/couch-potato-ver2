# 포트폴리오 YouTube 동기화

채널: https://www.youtube.com/@TryToShinDirect./videos  
(핸들 끝에 **`.`** 포함)

```bash
python -m pip install yt-dlp
python -m yt_dlp --flat-playlist -j "https://www.youtube.com/@TryToShinDirect./videos" > scripts/channel-videos.jsonl
python scripts/generate-portfolio-items.py
```

`portfolio-items.generated.ts` 가 갱신되면 `defaultSiteContent.ts`가 자동으로 이 목록을 사용합니다.
