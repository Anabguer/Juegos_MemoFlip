
# Integración de MemoFlip en Sistema Multi-Aplicación (Hostalia)

Este documento especifica cómo integrar el juego **MemoFlip** en el sistema multi-aplicación de Hostalia, usando el login por email/contraseña que ya existe y almacenando el progreso en MySQL.

---

## 1) Encaje con el sistema actual

- **Usuarios**: se mantienen en la tabla `usuarios_aplicaciones`. Usamos la clave compuesta `usuario_aplicacion_key = email + '_' + app_codigo` (por ejemplo: `ana@x.com_memory`).
- **App Code**: esta aplicación se identifica como `APP_CODIGO = 'memory'`.

---

## 2) Tablas nuevas (específicas de MemoFlip)

```sql
CREATE TABLE memory_progreso (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_aplicacion_key VARCHAR(150) NOT NULL,
  world VARCHAR(50) NOT NULL,
  level INT NOT NULL,
  stars TINYINT NOT NULL DEFAULT 0,
  best_time_ms INT NULL,
  memo_score INT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
             ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_user_level (usuario_aplicacion_key, world, level),
  INDEX idx_user (usuario_aplicacion_key),
  CONSTRAINT fk_mem_user FOREIGN KEY (usuario_aplicacion_key)
    REFERENCES usuarios_aplicaciones(usuario_aplicacion_key)
    ON DELETE CASCADE
);

CREATE TABLE memory_trofeos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_aplicacion_key VARCHAR(150) NOT NULL,
  code VARCHAR(100) NOT NULL,
  earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_user_trophy (usuario_aplicacion_key, code),
  INDEX idx_user (usuario_aplicacion_key),
  CONSTRAINT fk_mem_troph FOREIGN KEY (usuario_aplicacion_key)
    REFERENCES usuarios_aplicaciones(usuario_aplicacion_key)
    ON DELETE CASCADE
);
```

---

## 3) API PHP (estructura de carpetas)

```
sistema_apps_upload/
├─ app_memory.html
├─ router.html (ya existente) -> añadir app=memory
├─ index.html (selector) -> añadir tarjeta de MemoFlip
└─ sistema_apps_api/
   └─ memory/
      ├─ config.php
      ├─ register_or_login.php
      ├─ me.php
      ├─ progress_get.php
      ├─ progress_sync.php
      └─ progress_merge_guest.php
```

### `config.php`
```php
<?php
require_once __DIR__ . '/../_shared/common.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

define('APP_CODIGO', 'memory');

// Conexión PDO según el manual existente
```

### `register_or_login.php`
```php
<?php
require_once 'config.php';

$body = json_decode(file_get_contents('php://input'), true);
$email = strtolower(trim($body['email'] ?? ''));
$pass  = $body['password'] ?? '';
$nombre = trim($body['nombre'] ?? '');

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($pass) < 6) {
  echo json_encode(['success'=>false,'error'=>'Datos inválidos']); exit;
}

$key = strtolower($email) . '_' . APP_CODIGO;

$stmt = $pdo->prepare("SELECT password_hash FROM usuarios_aplicaciones WHERE usuario_aplicacion_key=?");
$stmt->execute([$key]);
$row = $stmt->fetch();

if (!$row) {
  $hash = password_hash($pass, PASSWORD_DEFAULT);
  $stmt = $pdo->prepare("INSERT INTO usuarios_aplicaciones (usuario_aplicacion_key, email, nombre, password_hash, app_codigo)
                         VALUES (?, ?, ?, ?, ?)");
  $stmt->execute([$key, $email, $nombre ?: $email, $hash, APP_CODIGO]);
  echo json_encode(['success'=>true,'usuario_aplicacion_key'=>$key,'email'=>$email]); exit;
} else {
  if (!password_verify($pass, $row['password_hash'])) {
    echo json_encode(['success'=>false,'error'=>'Credenciales inválidas']); exit;
  }
  echo json_encode(['success'=>true,'usuario_aplicacion_key'=>$key,'email'=>$email]); exit;
}
```

### `progress_sync.php` (upsert por nivel)
```php
<?php
require_once 'config.php';
$body = json_decode(file_get_contents('php://input'), true);
$key = $body['key'] ?? '';
$entries = $body['entries'] ?? [];

$sql = "INSERT INTO memory_progreso (usuario_aplicacion_key, world, level, stars, best_time_ms, memo_score)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          stars = GREATEST(stars, VALUES(stars)),
          best_time_ms = LEAST(IFNULL(best_time_ms, 999999999), VALUES(best_time_ms)),
          memo_score = GREATEST(IFNULL(memo_score,0), VALUES(memo_score))";

$stmt = $pdo->prepare($sql);
$pdo->beginTransaction();
foreach ($entries as $e) {
  $stmt->execute([$key, $e['world'], $e['level'], (int)$e['stars'], $e['best_time_ms'] ?? null, $e['memo_score'] ?? null]);
}
$pdo->commit();
echo json_encode(['success'=>true]);
```

### `progress_get.php`
```php
<?php
require_once 'config.php';
$key = $_GET['key'] ?? '';
$world = $_GET['world'] ?? null;

if ($world) {
  $stmt = $pdo->prepare("SELECT world, level, stars, best_time_ms, memo_score
                         FROM memory_progreso WHERE usuario_aplicacion_key=? AND world=?");
  $stmt->execute([$key, $world]);
} else {
  $stmt = $pdo->prepare("SELECT world, level, stars, best_time_ms, memo_score
                         FROM memory_progreso WHERE usuario_aplicacion_key=?");
  $stmt->execute([$key]);
}
echo json_encode(['success'=>true,'data'=>$stmt->fetchAll()]);
```

### `progress_merge_guest.php`
```php
<?php
require_once 'config.php';
$b = json_decode(file_get_contents('php://input'), true);
$guest = $b['guestKey']; $user = $b['userKey'];
// Copiar registros de invitado a usuario y luego borrar invitado
```

---

## 4) Pantalla de Inicio (`app_memory.html`)

```html
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/>
  <title>MemoFlip</title>
</head>
<body>
  <h1>MemoFlip</h1>
  <button onclick="playGuest()">Jugar como invitado</button>
  <div>
    <input id="email" type="email" placeholder="Email"/>
    <input id="pass" type="password" placeholder="Contraseña"/>
    <button onclick="register()">Crear cuenta</button>
    <button onclick="login()">Entrar</button>
  </div>
<script>
const API = (path) => `https://colisan.com/sistema_apps_upload/sistema_apps_api/memory/${path}`;
const guestKey = () => localStorage.getItem('mem_guest') || (() => {
  const id = 'guest_' + Math.random().toString(36).slice(2);
  localStorage.setItem('mem_guest', id);
  return id;
})();

function playGuest(){ goGame(guestKey()); }

async function register(){
  const email = emailInput.value.trim(); const password = passInput.value;
  const r = await fetch(API('register_or_login.php'), {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})});
  const data = await r.json();
  if(data.success){ await mergeGuest(data.usuario_aplicacion_key); goGame(data.usuario_aplicacion_key); }
}

async function login(){
  const email = emailInput.value.trim(); const password = passInput.value;
  const r = await fetch(API('register_or_login.php'), {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})});
  const data = await r.json();
  if(data.success){ await mergeGuest(data.usuario_aplicacion_key); goGame(data.usuario_aplicacion_key); }
}

async function mergeGuest(userKey){
  const g = localStorage.getItem('mem_guest');
  if (!g || g.startsWith('migrated_')) return;
  await fetch(API('progress_merge_guest.php'), {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({guestKey:g,userKey})});
  localStorage.setItem('mem_guest','migrated_'+Date.now());
}

function goGame(key){
  location.href = `world-ocean.html?key=${encodeURIComponent(key)}`;
}

const emailInput = document.getElementById('email');
const passInput  = document.getElementById('pass');
</script>
</body>
</html>
```

---

## 5) Cambios en `index.html` y `router.html`

**index.html**: añadir tarjeta para MemoFlip.

```html
<a href="app_memory.html" class="app-card">
  <div class="app-icon">🧠</div>
  <div class="app-name">MemoFlip</div>
</a>
```

**router.html**: añadir mapeo de app.

```js
const APLICACIONES = {
  // otras apps...
  'memory': { nombre:'MemoFlip', archivo:'app_memory.html' }
};
```

---

## 6) Checklist final

- [ ] Crear tablas `memory_progreso` y `memory_trofeos`.
- [ ] Crear carpeta `sistema_apps_api/memory/` con endpoints anteriores.
- [ ] Crear `app_memory.html` (pantalla incluida arriba).
- [ ] Añadir tarjeta a `index.html` y ruta en `router.html`.
- [ ] Probar: invitado → pasa niveles → registrarse/login → merge y persiste.
