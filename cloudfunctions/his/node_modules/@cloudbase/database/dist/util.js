"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constant_1 = require("./constant");
const geo_1 = require("./geo");
const serverDate_1 = require("./serverDate");
class Util {
}
Util.formatResDocumentData = (documents) => {
    return documents.map(document => {
        return Util.formatField(document);
    });
};
Util.formatField = document => {
    const keys = Object.keys(document);
    let protoField = {};
    if (Array.isArray(document)) {
        protoField = [];
    }
    keys.forEach(key => {
        const item = document[key];
        const type = Util.whichType(item);
        let realValue;
        switch (type) {
            case constant_1.FieldType.GeoPoint:
                realValue = new geo_1.Point(item.coordinates[0], item.coordinates[1]);
                break;
            case constant_1.FieldType.GeoLineString:
                realValue = new geo_1.LineString(item.coordinates.map(point => new geo_1.Point(point[0], point[1])));
                break;
            case constant_1.FieldType.GeoPolygon:
                realValue = new geo_1.Polygon(item.coordinates.map(line => new geo_1.LineString(line.map(([lng, lat]) => new geo_1.Point(lng, lat)))));
                break;
            case constant_1.FieldType.GeoMultiPoint:
                realValue = new geo_1.MultiPoint(item.coordinates.map(point => new geo_1.Point(point[0], point[1])));
                break;
            case constant_1.FieldType.GeoMultiLineString:
                realValue = new geo_1.MultiLineString(item.coordinates.map(line => new geo_1.LineString(line.map(([lng, lat]) => new geo_1.Point(lng, lat)))));
                break;
            case constant_1.FieldType.GeoMultiPolygon:
                realValue = new geo_1.MultiPolygon(item.coordinates.map(polygon => new geo_1.Polygon(polygon.map(line => new geo_1.LineString(line.map(([lng, lat]) => new geo_1.Point(lng, lat)))))));
                break;
            case constant_1.FieldType.Timestamp:
                realValue = new Date(item.$timestamp * 1000);
                break;
            case constant_1.FieldType.Object:
            case constant_1.FieldType.Array:
                realValue = Util.formatField(item);
                break;
            case constant_1.FieldType.ServerDate:
                realValue = new Date(item.$date);
                break;
            default:
                realValue = item;
        }
        if (Array.isArray(protoField)) {
            protoField.push(realValue);
        }
        else {
            protoField[key] = realValue;
        }
    });
    return protoField;
};
Util.whichType = (obj) => {
    let type = Object.prototype.toString.call(obj).slice(8, -1);
    if (type === constant_1.FieldType.Object) {
        if (obj instanceof geo_1.Point) {
            return constant_1.FieldType.GeoPoint;
        }
        else if (obj instanceof Date) {
            return constant_1.FieldType.Timestamp;
        }
        else if (obj instanceof serverDate_1.ServerDate) {
            return constant_1.FieldType.ServerDate;
        }
        if (obj.$timestamp) {
            type = constant_1.FieldType.Timestamp;
        }
        else if (obj.$date) {
            type = constant_1.FieldType.ServerDate;
        }
        else if (geo_1.Point.validate(obj)) {
            type = constant_1.FieldType.GeoPoint;
        }
        else if (geo_1.LineString.validate(obj)) {
            type = constant_1.FieldType.GeoLineString;
        }
        else if (geo_1.Polygon.validate(obj)) {
            type = constant_1.FieldType.GeoPolygon;
        }
        else if (geo_1.MultiPoint.validate(obj)) {
            type = constant_1.FieldType.GeoMultiPoint;
        }
        else if (geo_1.MultiLineString.validate(obj)) {
            type = constant_1.FieldType.GeoMultiLineString;
        }
        else if (geo_1.MultiPolygon.validate(obj)) {
            type = constant_1.FieldType.GeoMultiPolygon;
        }
    }
    return type;
};
Util.generateDocId = () => {
    let chars = 'ABCDEFabcdef0123456789';
    let autoId = '';
    for (let i = 0; i < 24; i++) {
        autoId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return autoId;
};
exports.Util = Util;
