// const path = require('path');

// const getCovers = async (req,res) => {
//     try{
//         const url = 'https://api.mangadex.org/manga?limit=50&includes[]=cover_art&contentRating[]=safe&order[followedCount]=desc';
//         const response = await fetch(url);
//         const data = await response.json();

//         const covers = data.data.map(manga => {
//             const coverRel = manga.relationships.find(r => r.type === 'cover_art');
//             const fileName = coverRel?.attributes?.fileName;
//             const title = manga.attributes.title.en || Object.values(manga.attributes.title)[0];
//             return {
//                 id: manga.id,
//                 title,
//                 cover: `https://uploads.mangadex.org/covers/${manga.id}/${fileName}.512.jpg`
//             };
//         });

//         res.json(covers);
//     }catch(err){
//         res.status(500).json({error: "failed to load covers",err});
//     }
// }

// module.exports = {
//     getCovers
// }

// 

const BASE_URL = 'https://api.mangadex.org';
const { PDFDocument } = require('pdf-lib');

// ─── Helper ────────────────────────────────────────────────────────────────

const formatManga = (manga) => {
    const coverRel = manga.relationships.find(r => r.type === 'cover_art');
    const fileName = coverRel?.attributes?.fileName;
    const title = manga.attributes.title.en || Object.values(manga.attributes.title)[0];

    return {
        id: manga.id,
        title,
        status: manga.attributes.status,
        year: manga.attributes.year,
        description: manga.attributes.description?.en || '',
        tags: manga.attributes.tags.map(t => t.attributes.name.en),
        cover: fileName
            ? `https://uploads.mangadex.org/covers/${manga.id}/${fileName}.512.jpg`
            : null,
    };
};

// ─── GET /manga/covers  (existing) ─────────────────────────────────────────

const getCovers = async (req, res) => {
    try {
        const url = `${BASE_URL}/manga?limit=50&includes[]=cover_art&contentRating[]=safe&order[followedCount]=desc`;
        const response = await fetch(url);
        const data = await response.json();

        const covers = data.data.map(manga => {
            const coverRel = manga.relationships.find(r => r.type === 'cover_art');
            const fileName = coverRel?.attributes?.fileName;
            const title = manga.attributes.title.en || Object.values(manga.attributes.title)[0];
            return {
                id: manga.id,
                title,
                cover: `https://uploads.mangadex.org/covers/${manga.id}/${fileName}.512.jpg`,
            };
        });

        res.json(covers);
    } catch (err) {
        res.status(500).json({ error: 'Failed to load covers', err });
    }
};

// ─── GET /manga/search?title=...  ──────────────────────────────────────────

/**
 * Search manga by title.
 * Query params:
 *   title    {string}  – partial or full title (required)
 *   limit    {number}  – results per page (default 20, max 100)
 *   offset   {number}  – pagination offset (default 0)
 */
const searchByTitle = async (req, res) => {
    try {
        const { title, limit = 20, offset = 0 } = req.query;

        if (!title) {
            return res.status(400).json({ error: 'Query param "title" is required' });
        }

        const params = new URLSearchParams({
            title,
            limit,
            offset,
            'contentRating[]': 'safe',
            'includes[]': 'cover_art',
            'order[relevance]': 'desc',
        });

        const response = await fetch(`${BASE_URL}/manga?${params}`);
        const data = await response.json();

        res.json({
            total: data.total,
            limit: data.limit,
            offset: data.offset,
            results: data.data.map(formatManga),
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to search by title', err });
    }
};

// ─── GET /manga/search/genre?genres=Action,Romance&exclude=Harem ───────────

/**
 * Search manga by genre/tags.
 * MangaDex uses tag UUIDs, so this function first fetches all tags,
 * maps the names → UUIDs, then fires the manga search.
 *
 * Query params:
 *   genres   {string}  – comma-separated tag names to INCLUDE  e.g. "Action,Romance"
 *   exclude  {string}  – comma-separated tag names to EXCLUDE  e.g. "Harem"
 *   limit    {number}  – default 20
 *   offset   {number}  – default 0
 */
const searchByGenre = async (req, res) => {
    try {
        const { genres = '', exclude = '', limit = 20, offset = 0 } = req.query;

        const includedNames = genres.split(',').map(g => g.trim()).filter(Boolean);
        const excludedNames = exclude.split(',').map(g => g.trim()).filter(Boolean);

        if (!includedNames.length && !excludedNames.length) {
            return res.status(400).json({ error: 'Provide at least one genre or exclude param' });
        }

        // 1. Fetch all available tags from MangaDex
        const tagRes = await fetch(`${BASE_URL}/manga/tag`);
        const tagData = await tagRes.json();
        const allTags = tagData.data;

        // 2. Map tag names → UUIDs (case-insensitive)
        const findTagIds = (names) =>
            allTags
                .filter(t => names.some(n => t.attributes.name.en?.toLowerCase() === n.toLowerCase()))
                .map(t => t.id);

        const includedTagIDs = findTagIds(includedNames);
        const excludedTagIDs = findTagIds(excludedNames);

        // 3. Build query — MangaDex requires array-style params for tags
        const params = new URLSearchParams({
            limit,
            offset,
            'contentRating[]': 'safe',
            'includes[]': 'cover_art',
            'order[followedCount]': 'desc',
        });

        includedTagIDs.forEach(id => params.append('includedTags[]', id));
        excludedTagIDs.forEach(id => params.append('excludedTags[]', id));

        const response = await fetch(`${BASE_URL}/manga?${params}`);
        const data = await response.json();

        res.json({
            total: data.total,
            limit: data.limit,
            offset: data.offset,
            appliedTags: { included: includedNames, excluded: excludedNames },
            results: data.data.map(formatManga),
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to search by genre', err });
    }
};

// ─── GET /manga/search/status?status=ongoing ───────────────────────────────

/**
 * Search manga by publication status.
 * Query params:
 *   status   {string}  – one of: ongoing | completed | hiatus | cancelled
 *   limit    {number}  – default 20
 *   offset   {number}  – default 0
 */
const searchByStatus = async (req, res) => {
    try {
        const VALID_STATUSES = ['ongoing', 'completed', 'hiatus', 'cancelled'];
        const { status, limit = 20, offset = 0 } = req.query;

        if (!status || !VALID_STATUSES.includes(status.toLowerCase())) {
            return res.status(400).json({
                error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
            });
        }

        const params = new URLSearchParams({
            status: status.toLowerCase(),
            limit,
            offset,
            'contentRating[]': 'safe',
            'includes[]': 'cover_art',
            'order[followedCount]': 'desc',
        });

        const response = await fetch(`${BASE_URL}/manga?${params}`);
        const data = await response.json();

        res.json({
            total: data.total,
            limit: data.limit,
            offset: data.offset,
            status: status.toLowerCase(),
            results: data.data.map(formatManga),
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to search by status', err });
    }
};

// ─── GET /manga/:id  ───────────────────────────────────────────────────────

/**
 * Fetch full details for a single manga by its MangaDex UUID.
 */
const getMangaById = async (req, res) => {
    try {
        const { id } = req.params;
        const params = new URLSearchParams({
            'includes[]': 'cover_art',
        });

        const response = await fetch(`${BASE_URL}/manga/${id}?${params}`);
        const data = await response.json();

        if (data.result === 'error') {
            return res.status(404).json({ error: 'Manga not found' });
        }

        res.json(formatManga(data.data));
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch manga details', err });
    }
};

const downloadChapter = async (req, res) => {
    const { chapterId } = req.params;
    const title = req.query.title || 'manga';

    try {
        const serverRes  = await fetch(`https://api.mangadex.org/at-home/server/${chapterId}`);
        const serverData = await serverRes.json();

        const baseUrl = serverData.baseUrl;
        const hash    = serverData.chapter.hash;
        const pages   = serverData.chapter.data;

        const pdfDoc = await PDFDocument.create();

        for (const page of pages) {
            const imgRes    = await fetch(`${baseUrl}/data/${hash}/${page}`);
            const imgBuffer = await imgRes.arrayBuffer();

            const img      = page.endsWith('.png')
                ? await pdfDoc.embedPng(imgBuffer)
                : await pdfDoc.embedJpg(imgBuffer);

            const pdfPage  = pdfDoc.addPage([img.width, img.height]);
            pdfPage.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
        }

        const pdfBytes = await pdfDoc.save();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${title}.pdf"`);
        res.send(Buffer.from(pdfBytes));

    } catch (err) {
        console.error('PDF generation error:', err.message);
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getCovers,
    searchByTitle,
    searchByGenre,
    downloadChapter,
    searchByStatus,
    getMangaById,
};