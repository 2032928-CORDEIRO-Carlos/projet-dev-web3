import path from "path";
import app from "./src/app";

// rend disponible la documentation de l'interface logicielle
app.get('/api-docs/', async (req, res) => {
  res.set('Content-Security-Policy', 'script-src blob:');
  res.set('Content-Security-Policy', 'worker-src blob:');
  res.sendFile(path.join(__dirname, 'index.html'));
});

// redirige vers api-docs
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});