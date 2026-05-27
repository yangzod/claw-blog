#!/usr/bin/env python3
"""
Claw Blog - 简易 HTTP 服务器
随机选取端口，服务当前目录的静态文件
"""

import http.server
import socketserver
import random
import webbrowser
from pathlib import Path

# 切换到脚本所在目录
ROOT = Path(__file__).parent.resolve()

# 随机选取端口 (8000-9000)
PORT = random.randint(8000, 9000)

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

if __name__ == "__main__":
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        url = f"http://localhost:{PORT}"
        print(f"[web.py] 服务器启动: {url}")
        print(f"[web.py] 按 Ctrl+C 停止")
        webbrowser.open(url)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n[web.py] 服务器已停止")
