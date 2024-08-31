// src/middleware/upload.js

const multer = require('multer');
const path = require('path'); 
const fs = require('fs');

// Diretório de upload
const uploadDir = path.join(__dirname, '..', 'uploads');

// Cria o diretório de upload se ele não existir
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuração de armazenamento do multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); 
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`); // Adiciona timestamp ao nome do arquivo
    }
});

// Filtro de arquivos para permitir apenas imagens
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de arquivo inválido. Apenas imagens são permitidas.'), false);
    }
};

// Configuração do middleware de upload
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // Limite de 5MB para upload de arquivos
    }
});

module.exports = upload;
