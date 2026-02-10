import piexif from "piexifjs";
import fs from "fs";
import path from "path";

const DIRECTORY = "public/images/resultados";
const AUTHOR = "Natuclinic - Dr. Julimar Meneses";
const COPYRIGHT = "© Natuclinic 2026 - Todos os direitos reservados";

// Windows XP Tags (UCS-2 encoded)
function strToUCS2(str) {
    const buf = Buffer.alloc((str.length + 1) * 2);
    for (let i = 0; i < str.length; i++) {
        buf.writeUInt16LE(str.charCodeAt(i), i * 2);
    }
    buf.writeUInt16LE(0, str.length * 2); // Null terminator
    return Array.from(buf);
}

const updateImage = (filename, id) => {
    const filePath = path.join(DIRECTORY, filename);
    if (!fs.existsSync(filePath)) return;

    const jpeg = fs.readFileSync(filePath);
    const data = jpeg.toString("binary");

    // SEO Data
    const title = `Resultado ${id} - Antes e Depois Natuclinic`;
    const subject = "Estética e Nutrição Ortomolecular em Brasília";
    const keywords = "natuclinic, estética, brasília, emagrecimento, antes e depois, saúde integrativa";
    const comments = "Imagem otimizada para SEO pela Natuclinic AI.";

    const zeroth = {};
    const exif = {};
    const gps = {};

    // Standard Tags
    zeroth[piexif.ImageIFD.ImageDescription] = title;
    zeroth[piexif.ImageIFD.Artist] = AUTHOR;
    zeroth[piexif.ImageIFD.Copyright] = COPYRIGHT;
    zeroth[piexif.ImageIFD.Software] = "Natuclinic Optimizer";

    // Windows XP Tags (for File Properties Details)
    // 0x9c9b = XPTitle, 0x9c9c = XPComment, 0x9c9d = XPAuthor, 0x9c9e = XPKeywords, 0x9c9f = XPSubject
    zeroth[0x9c9b] = strToUCS2(title);
    zeroth[0x9c9c] = strToUCS2(comments);
    zeroth[0x9c9d] = strToUCS2(AUTHOR);
    zeroth[0x9c9e] = strToUCS2(keywords);
    zeroth[0x9c9f] = strToUCS2(subject);

    const exifObj = { "0th": zeroth, "Exif": exif, "GPS": gps };
    const exifBytes = piexif.dump(exifObj);

    const newData = piexif.insert(exifBytes, data);
    const newJpeg = Buffer.from(newData, "binary");

    fs.writeFileSync(filePath, newJpeg);
    console.log(`Updated metadata for: ${filename}`);
};

// Process
console.log("Starting SEO Metadata update...");

// Read directory
fs.readdirSync(DIRECTORY).forEach(file => {
    if (file.endsWith('.jpg') || file.endsWith('.jpeg')) {
        // Extract ID from filename (resultado-01-antes.jpg)
        const match = file.match(/resultado-(\d+)/);
        const id = match ? match[1] : "Geral";

        try {
            updateImage(file, id);
        } catch (e) {
            console.error(`Failed to update ${file}:`, e.message);
        }
    }
});

console.log("Done.");
