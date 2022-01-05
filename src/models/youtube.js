import _sequelize from 'sequelize';
const { Model } = _sequelize;

export default class youtube extends Model {
    static init(sequelize, DataTypes) {
        super.init({
            id: {
                type: DataTypes.TEXT,
                unique: true,
                allowNull: false,
                primaryKey: true
            },
            channel: DataTypes.TEXT,
            title: DataTypes.TEXT,
            descr: DataTypes.TEXT,
            thumb: DataTypes.TEXT,
            channelId: DataTypes.TEXT,
        }, {
            sequelize
        });
        return youtube;
    }
}
