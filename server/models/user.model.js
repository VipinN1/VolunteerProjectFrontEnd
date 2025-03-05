class User {
    constructor(username = "", email = "", password) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.address1 = "";
        this.address2 = "";
        this.city = "";
        this.state = "";
        this.zipcode = "";
        this.skills = [];
        this.preferences = "";
        this.availability = [];
    }

    set username(name) {
        this.username = name;
    }
    get username() {
        return this.username;
    }

    set email(email) {
        this.email = email;
    }
    get email() {
        return this.email;
    }

    set address1(address) {
        this.address1 = address;
    }
    get address1() {
        return this.address1;
    }

    set address2(address) {
        this.address2 = address;
    }
    get address2() {
        return this.address2;
    }

    set city(city) {
        this.city = city;
    }
    get city() {
        return this.city;
    }

    set state(state) {
        this.state = state;
    }
    get state() {
        return this.state;
    }

    set zipcode(zipcode) {
        this.zipcode = zipcode;
    }
    get zipcode() {
        return this.zipcode;
    }

    set skills(skills) {
        this.skills = skills;
    }
    get skills() {
        return this.skills;
    }

    set preferences(preferences) {
        this.preferences = preferences;
    }
    get preferences() {
        return this.preferences;
    }

    set availability(availability) {
        this.availability.push(availability);
    }
    get availability() {
        return this.preferences;
    }
}