"""Copies the latest messages from a Discord announcement channel into announcements.json."""
import json, os, re, urllib.request

TOKEN = os.environ["DISCORD_BOT_TOKEN"]
CHANNEL = os.environ["DISCORD_CHANNEL_ID"]
API = "https://discord.com/api/v10"
LIMIT = 10          # how many recent announcements to show
FILE = "announcements.json"

def get(path):
    req = urllib.request.Request(API + path, headers={
        "Authorization": "Bot " + TOKEN,
        "User-Agent": "ZEROsite (https://github.com/heyzerooribit/zerohub, 1.0)",
    })
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)

def clean(text):
    text = re.sub(r"<a?:(\w+):\d+>", r":\1:", text)   # custom emoji
    text = re.sub(r"<@&\d+>", "@role", text)           # role mentions
    text = re.sub(r"<@!?\d+>", "@member", text)        # user mentions
    text = re.sub(r"<#\d+>", "#channel", text)         # channel mentions
    text = re.sub(r"<t:(\d+)(?::\w)?>", "", text)      # timestamps
    return text.strip()

def message_text(m):
    text = clean(m.get("content") or "")
    if not text:
        for e in m.get("embeds") or []:
            text = clean("\n".join(x for x in (e.get("title"), e.get("description")) if x))
            if text:
                break
    return text

def main():
    guild = get("/channels/" + CHANNEL).get("guild_id", "")
    news = []
    for m in get("/channels/%s/messages?limit=%d" % (CHANNEL, LIMIT)):
        text = message_text(m)
        if not text:
            continue
        item = {"text": text[:1500], "date": m["timestamp"][:10]}
        if guild:
            item["link"] = "https://discord.com/channels/%s/%s/%s" % (guild, CHANNEL, m["id"])
        news.append(item)
    try:
        with open(FILE, encoding="utf-8") as f:
            data = json.load(f)
    except (OSError, ValueError):
        data = {"events": [], "questions": [], "challenge": ""}
    data["news"] = news
    with open(FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")

if __name__ == "__main__":
    main()
