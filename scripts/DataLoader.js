
import {log, info, warn, err} from './utils.js'

/*  Use this class to get the paths to data files. If project directory structure changes, this is the only place to modify.
 *  !!! This is not exported (yet) (only DataLoader is) !!!
 */
class DataPaths {

    // Initializes path variables
    constructor() {

        // Folders
        this.DATA_FOLDER = 'data/';
        this.MAP_FOLDER = 'geojson/';
        this.GDELT_FOLDER = 'gdelt/';

        // Gdelt folders
        this.EVENTS = 'events/';
        this.MENTIONS = 'mentions/';
        this.CLASS_FOLDERS = {
            1:'VERBAL_COOPERATION/',
            2:'MATERIAL_COOPERATION/',
            3:'VERBAL_CONFLICT/',
            4:'MATERIAL_CONFLICT/'
        };

        // Files
        //this.WORLDMAP = 'world-nofiji-nohawaii';
        this.WORLDMAP = 'world';

        // Others
        this.JSON = '.json';
    }

    // Return path to geojson
    mapOutline() {
        return this.DATA_FOLDER + this.MAP_FOLDER + this.WORLDMAP + this.JSON;
    }

    // Return path to an event update file
    eventUpdate(timestamp, category) {
        return this.DATA_FOLDER + this.GDELT_FOLDER + this.EVENTS + this.CLASS_FOLDERS[category] + timestamp + this.JSON;
    }
}


/*
    This class loads the json files containing data and returns promises with the data
 */
export class DataLoader {

    constructor() {
        this.dataPaths = new DataPaths();
    }

    // Load outline data and return it wrapped in promise
    loadMapOutline() {
        return this.load(this.dataPaths.mapOutline());
    }

    loadEvents(timestamp, category) {
        return this.load(this.dataPaths.eventUpdate(timestamp, category));
    }

    load(path) {
        return new Promise(function(resolve, reject) {
            d3.json(path, function(error, data) {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        });
    }
}
