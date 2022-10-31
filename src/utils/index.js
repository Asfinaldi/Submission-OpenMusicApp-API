const mapDBToModelAlbum = ({
  id,
  name,
  year,
  cover,
}) => ({
  id,
  name,
  year,
  coverUrl: cover,
});

const mapDBToModelSong = ({
  id,
  name,
  title,
  year,
  performer,
  genre,
  duration,
  albumId,
}) => ({
  id,
  name,
  title,
  year,
  performer,
  genre,
  duration,
  albumId,
});

module.exports = { mapDBToModelAlbum, mapDBToModelSong };
