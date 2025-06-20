export class Device {
    id
    deviceId
    name
    status
    lastReading
    gasLevel
    location

    constructor( id, deviceId, name, status, lastReading, gasLevel, location) {
        this.id = id;
        this.deviceId = deviceId;
        this.name = name;
        this.status = "online" | "offline" | "alert";
        this.lastReading = lastReading;
        this.gasLevel = gasLevel;
        this.location = location;
    }
}