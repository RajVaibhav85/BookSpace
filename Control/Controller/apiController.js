const path = require('path');

const getCovers = async (req,res) => {
    try{
        const url = 'https://api.mangadex.org/manga?limit=50&includes[]=cover_art&contentRating[]=safe&order[followedCount]=desc';
        const response = await fetch(url);
        const data = await response.json();

        const covers = data.data.map(manga => {
            const coverRel = manga.relationships.find(r => r.type === 'cover_art');
            const fileName = coverRel?.attributes?.fileName;
            const title = manga.attributes.title.en || Object.values(manga.attributes.title)[0];
            return {
                id: manga.id,
                title,
                cover: `https://uploads.mangadex.org/covers/${manga.id}/${fileName}.512.jpg`
            };
        });

        res.json(covers);
    }catch(err){
        res.status(500).json({error: "failed to load covers",err});
    }
}

module.exports = {
    getCovers
}