import _sequelize from 'sequelize';
const { Model } = _sequelize;

export default class instagram extends Model {
    static init(sequelize, DataTypes) {
        super.init({
            id: {
                type: DataTypes.TEXT,
                unique: true,
                allowNull: false,
                primaryKey: true
            },
            userId: DataTypes.TEXT,
            username: DataTypes.TEXT,
            descr: DataTypes.TEXT,
            thumb: DataTypes.TEXT,
            shortcode: DataTypes.TEXT,
        }, {
            sequelize
        });
        return instagram;
    }
}
