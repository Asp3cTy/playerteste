const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;
const VIDEO_DIR = path.join(__dirname, 'videos');

// Garante que a pasta de vídeos existe
if (!fs.existsSync(VIDEO_DIR)) fs.mkdirSync(VIDEO_DIR);

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Conexão com o banco de dados SQLite
const db = new sqlite3.Database('./videos.db', (err) => {
    if (err) console.error("Erro ao conectar ao banco de dados:", err);
    else console.log("Banco de dados conectado!");
});

db.run(`CREATE TABLE IF NOT EXISTS videos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT,
    title TEXT,
    upload_date DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// Configuração do upload de arquivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, VIDEO_DIR);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 * 1024 } });

// Rota para listar vídeos
app.get('/videos', (req, res) => {
    db.all("SELECT * FROM videos ORDER BY upload_date DESC", (err, rows) => {
        if (err) return res.status(500).json({ error: "Erro ao buscar vídeos." });
        res.json(rows);
    });
});

// Rota para servir vídeos
app.get('/video/:filename', (req, res) => {
    const videoPath = path.join(VIDEO_DIR, req.params.filename);
    if (!fs.existsSync(videoPath)) return res.status(404).send("Vídeo não encontrado.");
    
    res.sendFile(videoPath);
});

// Rota para fazer upload de vídeos
app.post('/upload', upload.single('video'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: "Nenhum arquivo enviado." });

    db.run("INSERT INTO videos (filename, title) VALUES (?, ?)", [req.file.filename, req.file.filename], function(err) {
        if (err) return res.status(500).json({ error: "Erro ao salvar no banco de dados." });
        res.json({ message: "Upload realizado com sucesso!", id: this.lastID });
    });
});

app.delete('/delete/:id', (req, res) => {
    const videoId = req.params.id;

    // Buscar o nome do arquivo antes de excluir do banco
    db.get("SELECT filename FROM videos WHERE id = ?", [videoId], (err, row) => {
        if (err || !row) {
            return res.status(404).json({ success: false, error: "Vídeo não encontrado." });
        }

        const filePath = path.join(VIDEO_DIR, row.filename);

        // Excluir o vídeo do disco
        fs.unlink(filePath, (err) => {
            if (err) {
                return res.status(500).json({ success: false, error: "Erro ao excluir o arquivo." });
            }

            // Excluir do banco de dados
            db.run("DELETE FROM videos WHERE id = ?", [videoId], (err) => {
                if (err) {
                    return res.status(500).json({ success: false, error: "Erro ao excluir do banco de dados." });
                }
                res.json({ success: true, message: "Vídeo excluído com sucesso!" });
            });
        });
    });
});



app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
