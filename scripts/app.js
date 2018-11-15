
function whenDocumentLoaded(action) {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", action);
	} else { // `DOMContentLoaded` already fired
		action();
	}
}

/*
    Logging framework
 */
function logger(prefix="") {
    return function() {
        let args = Array.prototype.slice.call(arguments);
        args.unshift(prefix);
        console.log.apply(console, args);
    }
}

const log = logger("");
const info = logger("[INFO]");
const warn = logger("[WARN]");
const err = logger("[ERR]");

/*
    A worldmap object
 */
class Worldmap {
    
    constructor(svg) {

        this.svg = svg;

        // Scaling is now done when drawing the outline since we need the dataset to compute boundaries
        this.projection = undefined;
        this.path = undefined;

        // Data sets (initialize with dummy promises)
        this.outlineData = new Promise((resolve) => {resolve();});
        this.overlayData = new Promise((resolve) => {resolve();});
    }

    /*
        Load new data for the countries outline, data promise is attached to field
     */
    updateOutline(data_promise) {
        this.outlineData = data_promise;
    }

    /*
       Load new data for the  overlay, data promise is attached to field
     */
    updateOverlay(data_promise) {
        this.overlayData = data_promise;
    }

    /*
        Resolves data promises and acts according to results
     */
    draw() {

        Promise.all([this.outlineData, this.overlayData]).then((results) => {

            if (results[0] === undefined) {

                // Draw nothing if no outline nor overlay was set yet
                err('Draw called on map without outline data');

            } else if (results[1] === undefined) {

                // Draw only outline if no overlay has been set yet
                info('Draw called on map without events');
                this.drawOutline(results[0])

            } else {

                // Draw both outline and overlay
                this.drawOutline(results[0]);
                this.drawOverlay(results[1]);
            }

        })
    }

    /*
        Draws the countries outline
     */
    drawOutline(outlineData) {

        // Get svg dimensions
        this.w = this.svg.style("width").replace("px", "");
        this.h = this.svg.style("height").replace("px", "");

        // Define projections and path generator
        this.projection = d3.geoLarrivee().fitSize([this.w, this.h], outlineData);
        this.path = d3.geoPath().projection(this.projection);

        // Join data
        this.svg.selectAll("path")
            .data(outlineData.features)
            .enter()
            .append("path")
            .attr("d", this.path);
    }

    /*
        Draws the overlay, with or without new data, complete data update sequence
     */
    drawOverlay(overlayData) {

        let selection = this.svg
            .selectAll("circle")
            .data(overlayData);


        // Exit
        selection.exit()
            .transition().duration(100)
                .attr("fill", "red")
                .attr("r", "3px")
            .transition().duration(100)
                .attr("r", "1px")
            .remove();

        // Update
        selection
            .transition().duration(100)     // 1. copy of exit() selection
                .attr("fill", "red")
                .attr("r", "3px")
            .transition().duration(100)
                .attr("r", "1px")
            /*.transition().duration(10)
                // !! hidden must absolutely be kept in it own transition
                .attr("visibility", "hidden")  */
            .transition().duration(100)     // 2. quickly move the invisible point to their correct position
                .attr("cx", (d) => this.projection([d["Long"], d["Lat"]])[0] )
                .attr("cy", (d) => this.projection([d["Long"], d["Lat"]])[1] )
            .transition().duration(500)    // 3. copy of enter() selection
                .attr("fill", "green")
                .attr("r", "3px");


        // Enter
        selection.enter()
            .append("circle")
            .attr("cx", (d) => this.projection([d["Long"], d["Lat"]])[0] )
            .attr("cy", (d) => this.projection([d["Long"], d["Lat"]])[1] )
            .attr("r", "0px")
            .attr("fill", "grey")
            .transition()
                .duration(500)
                .delay(100)
                .attr("r", "3px")
                .attr("fill", "green");
    }

}

/*
    Use this class to get the paths to data files. If project directory structure changes, this is the only place to modify.
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
class DataLoader {

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

/*
    This class manages the timeflow over the week covered by the dataset, returning incremental timestamps
 */
class TimeManager {

    constructor() {

        // Initial date of our dataset
        this.INIT_DATE = new Date(2018, 10, 5, 0, 0);
        this.END_DATE = new Date(2018, 10, 12, 0, 0);
        this.time = this.INIT_DATE;
    }

    dateToTimestamp(date) {

        // Transform to string with leading zeros
        let pad = (num, size) => {
            let s = num+"";
            while (s.length < size) s = "0" + s;
            return s;
        };

        return date.getFullYear() + pad(date.getMonth() + 1, 2) +
            pad(date.getDate(), 2) + pad(date.getHours(), 2) +
            pad(date.getMinutes(), 2) + "00";
    }

    next() {

        // Data set is over
        if (this.time.getTime() === this.END_DATE.getTime()) {
            return undefined;
        }

        // Get timestamp of current time
        let toReturn = this.dateToTimestamp(this.time);

        // Increment time by 15 minutes
        this.time = new Date(this.time.getTime() + 15*60000);

        return toReturn;
    }
}


function main() {

    // Select main svg
    const mainSvg = d3.select("#mainSvg");

    // Data loading utilities
    const loader = new DataLoader();

    // Create Map object
    const map = new Worldmap(mainSvg);

    // Outline and draw
    map.updateOutline(loader.loadMapOutline());
    map.draw();

    // Init time manager that will walk over week // TODO: detect end of week (undefined timestamp)
    const timeManager = new TimeManager();

    // Change file on click
    d3.select("#mainSvg")
        .on("click", () => {
            let t = timeManager.next();
            info(t);
            map.updateOverlay(loader.loadEvents(t, 1));
            map.draw();
        });
}

whenDocumentLoaded(main);

