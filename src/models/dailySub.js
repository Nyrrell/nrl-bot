import _sequelize from 'sequelize';
const { Model } = _sequelize;

export default class dailySub extends Model {
    static init(sequelize, DataTypes) {
        super.init({
            url: {
                type: DataTypes.TEXT,
                unique: true
            },
            send: DataTypes.DATEONLY,
        }, {
            sequelize
        });
        return dailySub;
    }
}
