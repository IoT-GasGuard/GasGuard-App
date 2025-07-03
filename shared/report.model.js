export class Report{
    id;
    date;
    time;
    device;
    location;
    gasLevel;
    duration;
    actionsTaken;
    resolved;

    constructor(id, date, time, device, location, gasLevel, duration, actionsTaken, resolved) {
        this.id = id;
        this.date = date;
        this.time = time;
        this.device = device;
        this.location = location;
        this.gasLevel = gasLevel;
        this.duration = duration;
        this.actionsTaken = actionsTaken;
        this.resolved = resolved;
    }
}
