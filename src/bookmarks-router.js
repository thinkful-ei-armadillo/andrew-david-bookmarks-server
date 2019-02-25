/* eslint-disable strict */
const express = require('express');
const bookmarksRouter = express.Router();
const logger = require('./logger');
const { BOOKMARKS } = require('./store');
const bodyParser = express.json();
const uuid = require('uuid/v4');

bookmarksRouter
  .route('/')
  .get((req, res) => {
    res.json(BOOKMARKS);
  })
  .post(bodyParser, (req, res) => {
    const { title, url, content } = req.body;
    const id = uuid();
    const newBookmark = {
      id,
      title,
      url,
      content
    };
    if (!title || !url) {
      logger.error('No title or url were submitted.');
      return res.status(404).send('Please submit a title and URL.');
    }
    BOOKMARKS.push(newBookmark);
    res
      .status(201)
      .location(`https://localhost:8000/bookmarks/${id}`)
      .json(newBookmark);
  });
bookmarksRouter
  .route('/:id')
  .get((req, res) => {
    const { id } = req.params;
    const bookmark = BOOKMARKS.find(bookmark => bookmark.id === id);
    if (!bookmark) {
      logger.error(`Bookmark not found with id: ${id}`);
      return res.status(404).send('Bookmark not found.');
    }
    res.json(bookmark);
  })
  .delete((req, res) => {
    const { id } = req.params;
    const bookmarkIndex = BOOKMARKS.findIndex(bookmark => bookmark.id === id);
    if (bookmarkIndex === - 1) {
      logger.error(`Bookmark not found with id: ${id}`);
      return res.status(404).send('Bookmark not found.');
    }
    BOOKMARKS.splice(bookmarkIndex, 1);
    res.status(204).end();
  });

module.exports = bookmarksRouter;
