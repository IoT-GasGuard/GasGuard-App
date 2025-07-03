import {name} from "autoprefixer";

export class HouseholdMemberModel {
    id;
    name;
    email;
    phone;
    emergencyContact;
    gasAlerts;

    constructor(id, name, email, phone, emergencyContact, gasAlerts) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.emergencyContact = emergencyContact;
        this.gasAlerts = gasAlerts;
    }


}