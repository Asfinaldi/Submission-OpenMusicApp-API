const ClientError = require('../../exceptions/ClientError');

class ActivitiesHandler {
  constructor(activitiesService, playlistService) {
    this._activitiesService = activitiesService;
    this._playlistsService = playlistService;

    this.postActivityHandler = this.postActivityHandler.bind(this);
    this.getActivitiesHandler = this.getActivitiesHandler.bind(this);
  }

  async postActivityHandler(request, h) {
    try {
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;

      await this._playlistsService.verifyPlaylistAccess(id, credentialId);
      const activityId = await this._activitiesService.addActivity(id);

      return h.response({
        status: 'success',
        message: 'Activity berhasil ditambahkan',
        data: {
          activityId,
        },
      }).code(201);
    } catch (error) {
      if (error instanceof ClientError) {
        return h.response({
          status: 'fail',
          message: error.message,
        }).code(error.statusCode);
      }

      // ERROR PADA SERVEER SAAT ...
      return h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      }).code(500);
    }
  }

  async getActivitiesHandler(request, h) {
    try {
      const { id: credentialId } = request.auth.credentials;
      const { id } = request.params;

      await this._playlistsService.verifyPlaylistOwner(id, credentialId);
      const data = await this._activitiesService.getActivities(id);

      return {
        status: 'success',
        data,
      };
    } catch (error) {
      if (error instanceof ClientError) {
        return h.response({
          status: 'fail',
          message: error.message,
        }).code(error.statusCode);
      }

      // ERROR PADA SERVEER SAAT ...
      return h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      }).code(500);
    }
  }
}

module.exports = ActivitiesHandler;
