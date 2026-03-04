const emitToUser = (io, userId, event, data) => {
  io.to(userId.toString()).emit(event, data);
};

const emitEventUpdate = (io, userIds, eventData) => {
  userIds.forEach(userId => {
    if (userId) {
      emitToUser(io, userId, 'eventUpdate', eventData);
    }
  });
};

const emitNotification = (io, userId, notification) => {
  emitToUser(io, userId, 'notification', notification);
};

module.exports = { emitToUser, emitEventUpdate, emitNotification };
