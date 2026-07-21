import functools
import http.server

ROOT = "/Users/isocyclo/Documents/Website"
handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=ROOT)
server = http.server.ThreadingHTTPServer(("127.0.0.1", 4321), handler)
print(f"Serving {ROOT} at http://127.0.0.1:4321", flush=True)
server.serve_forever()
