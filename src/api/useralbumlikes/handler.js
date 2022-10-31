const ClientError = require('../../exceptions/ClientError');

class AlbumsLikesHandler {
  constructor(service) {
    const { userAlbumLikesService, albumsService } = service;
    this._service = userAlbumLikesService;
    this._albumsService = albumsService;

    this.postAlbumsLikesHandler = this.postAlbumsLikesHandler.bind(this);
    this.countAlbumsLikesHandler = this.countAlbumsLikesHandler.bind(this);
  }

  async postAlbumsLikesHandler(request, h) {
    try {
      const { id: userId } = request.auth.credentials;
      const { id: albumId } = request.params;
      await this._albumsService.getAlbumById(albumId);
      const isDuplicate = await this._service.albumLiked(userId, albumId);
      const messageRent = isDuplicate
        ? await this._service.deleteAlbumsLikes(userId, albumId)
        : await this._service.addAlbumsLikes(userId, albumId);
      const response = h.response({
        status: 'success',
        message: messageRent,
        data: { albumId },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      //  Server error
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan di server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async countAlbumsLikesHandler(request, h) {
    try {
      const { id: albumId } = request.params;
      const { sourceData, likes } = await this._service.getAlbumsLikesById(albumId);
      const response = h.response({
        status: 'success',
        data: { likes },
      });
      response.header('X-Data-Source', sourceData);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.statusCode,
        });
        response.code(error.statusCode);
        return response;
      }
      //  Server error
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan di server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = AlbumsLikesHandler;
