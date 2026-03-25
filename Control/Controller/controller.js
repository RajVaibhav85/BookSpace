const path = require("path");

const viewsPath = path.join(__dirname, "../../View");
const viewsPath2 = path.join(__dirname, "../../View2");

const getHomePage = (req, res) => {
  res.sendFile(path.join(viewsPath2, "homepage.html"));
};

const getLoginPage = (req, res) => {
  res.sendFile(path.join(viewsPath2, "loginpage.html"));
};

const getViewPage = (req, res) => {
  res.sendFile(path.join(viewsPath2, "viewpage.html"));
};

const getReaderPage = (req, res) => {
  res.sendFile(path.join(viewsPath2, "readerpage.html"));
};

const getProfilePage = (req, res) => {
  res.sendFile(path.join(viewsPath2, "profilepage.html"));
};

const getAboutPage = (req, res) => {
  res.sendFile(path.join(viewsPath2, "aboutpage.html"));
};

const getBooksPage = (req, res) => {
  const params = new URLSearchParams({
    code: '503',
    title: "Page Under Construction",
    message : "Page under construction. Please check back later."
  }).toString();
  res.status(503).redirect(`/errorpage.html?${params}`)
}




const getMangaPage = (req, res) => {
  res.sendFile(path.join(viewsPath, "mangapage.html"));
};

const getManhwaPage = (req, res) => {
  res.sendFile(path.join(viewsPath, "manhwapage.html"));
};

const getComicsPage = (req, res) => {
  res.sendFile(path.join(viewsPath, "comicspage.html"));
};

const getLightNovelsPage = (req,res) => {
    res.sendFile(path.join(viewsPath, "lightnovels.html"));
};

module.exports = {
  getHomePage,
  getLoginPage,
  getViewPage,
  getReaderPage,
  getProfilePage,
  getAboutPage,
  getBooksPage,
  getMangaPage,
  getManhwaPage,
  getComicsPage,
  getLightNovelsPage
};
