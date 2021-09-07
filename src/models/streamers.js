import _sequelize from 'sequelize';
const { Model } = _sequelize;

export default class streamers extends Model {
  static init(sequelize, DataTypes) {
  super.init({
    name: {
      type: DataTypes.STRING(255),
      unique: true
    },
    color: DataTypes.STRING(255),
    title: DataTypes.TEXT,
    descr: DataTypes.TEXT,
    thumb: DataTypes.TEXT,
    channel: {
      type: DataTypes.STRING(255),
      defaultValue: "870308411512860732"
    },
    lastLive: DataTypes.DATE,
    uptime: DataTypes.DATE
  }, {
    sequelize
  });
  return streamers;
  }
}
