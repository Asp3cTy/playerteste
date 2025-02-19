const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const VIDEO_DIR = path.join(__dirname, 'videos');

app.use(cors());
app.use(express.static('public'));

// Rota para listar os vídeos disponíveis
app.get('/videos', (req, res) => {
    fs.readdir(VIDEO_DIR, (err, files) => {
        if (err) return res.status(500).json({ error: "Erro ao acessar a pasta de vídeos." });
        const videoFiles = files.filter(file => /\.(mp4|mkv|webm|mov|avi)$/i.test(file));
        res.json(videoFiles);
    });
});

// Rota para transmitir os vídeos
app.get('/video/:filename', (req, res) => {
    const videoPath = path.join(VIDEO_DIR, req.params.filename);
    
    if (!fs.existsSync(videoPath)) {
        return res.status(404).send("Vídeo não encontrado.");
    }

    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunkSize = end - start + 1;

        const file = fs.createReadStream(videoPath, { start, end });
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': 'video/mp4'
        };

        res.writeHead(206, head);
        file.pipe(res);
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4'
        };

        res.writeHead(200, head);
        fs.createReadStream(videoPath).pipe(res);
    }
});

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
