"""Gera dgsoccer-arquivo-unico.html embutindo CSS, JS, fontes e imagens do index.html.
Uso (na raiz do projeto): python ferramentas/gerar-arquivo-unico.py"""
import base64, io, mimetypes, os, re

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def data(path):
    ext = os.path.splitext(path)[1]
    mt = {'.woff2': 'font/woff2', '.ico': 'image/x-icon'}.get(ext) or mimetypes.guess_type(path)[0]
    with open(os.path.join(R, path), 'rb') as f:
        return 'data:%s;base64,%s' % (mt, base64.b64encode(f.read()).decode())

def read(path):
    return io.open(os.path.join(R, path), encoding='utf-8').read()

html = read('index.html')
css = re.sub(r"url\((['\"]?)\.\./([^)'\"]+)\1\)", lambda m: 'url(%s)' % data(m.group(2)), read('css/style.css'))
html = html.replace('<link rel="stylesheet" href="css/style.css">', '<style>\n' + css + '\n</style>')
html = html.replace('<script src="js/main.js"></script>', '<script>\n' + read('js/main.js') + '\n</script>')
html = re.sub(r'(src|href)="((?:img/|favicon)[^"]+)"', lambda m: '%s="%s"' % (m.group(1), data(m.group(2))), html)
assert not re.search(r'(src|href)="(img/|css/|js/|fonts/|favicon)', html), 'recurso local não embutido'
io.open(os.path.join(R, 'dgsoccer-arquivo-unico.html'), 'w', encoding='utf-8', newline='\n').write(html)
print('ok', len(html.encode()) // 1024, 'KB')
