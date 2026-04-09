

class Observer {
    constructor(name) {
        this.namePick = name
    }

    updateStatus(location) {
        this.goToHelp(location)
    }
    goToHelp(location) {
        console.log(`${this.namePick}:::::PING::::${JSON.stringify(location)}`)
    }
}

class Subject {
    constructor() {
        this.observerList = []
    }
    addObserver(observer) {
        this.observerList.push(observer)
    }
    notify(location) {
        this.observerList.forEach(observer => {
            observer.updateStatus(location)
        })
    }

}

const subject = new Subject()


const riki = new Observer('riki')
const sniper = new Observer('sniper')
subject.addObserver(riki)
subject.addObserver(sniper)

subject.notify({ long: 123, lat: 345 })