import _sequelize from 'sequelize';
const { Model } = _sequelize;

export default class dailySub extends Model {
    static init(sequelize, DataTypes) {
        super.init({
            url: {
                type: DataTypes.TEXT,
                unique: true,
                allowNull: false,
                primaryKey: true
            },
            send: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            }
        }, {
            sequelize
        });
        return dailySub;
    }
}
