/**
 * View Model managing the loaded local geodatabases.
 */
function GeodatabaseViewModel() {
    this.geodatabases = {};
}
GeodatabaseViewModel.prototype = new Object;

/**
 * Adds a new geodatabse to this view model instance.
 * @param focusMap the map component which should be used for displaying the geodatabase content.
 * @param geodatabaseFileUrl the file URL to the local geodatabase.
 */
GeodatabaseViewModel.prototype.addGeodatabase = function(focusMap, geodatabaseFileUrl) {
    try {
        // Create the local geodatabase instance
        var localGeodatabase = ArcGISRuntime.createObject("Geodatabase");
        console.log("Trying to load geodatabase: " + geodatabaseFileUrl);

        // Add a strong reference to it
        var geodatabaseItem = { map: focusMap, geodatabase: localGeodatabase };
        this.geodatabases[geodatabaseFileUrl] = geodatabaseItem;

        // Set signal handler
        var changeHandler = ValidChangeHandler.getInstance();
        changeHandler.registerLocalGeodatabase(geodatabaseItem);
        localGeodatabase.path = geodatabaseFileUrl;
    } catch (ex) {
        console.error(ex);
    }
}

/**
 * Releases resources for all registered map components and geodatabases.
 */
GeodatabaseViewModel.prototype.destroy = function() {
    try {
        for (var index in this.geodatabases) {
            var geodatabaseItem = this.geodatabases[index];
            var focusMap = geodatabaseItem.map;
            if (focusMap) {
                // We need to destroy this dynamically created instance
                focusMap.destroy();
                if (geodatabaseItem.geodatabase) {
                    console.debug("Map displaying '" + geodatabaseItem.geodatabase.path + "' was destroyed.");
                }

                delete this.geodatabases[index];
            } else {
                console.error("The registered map must not be null!");
            }
        }
        this.geodatabases = {};
    } catch (ex) {
        console.error(ex);
    }
}


/**
 * Handles all validation changes of a geodatabase instance.
 */
function ValidChangeHandler() {
    this.geodatabaseItem = {};
}

ValidChangeHandler.prototype = new Object;

/**
 * Using singleton pattern to workaround the context free signal handler.
 * We are not able to access this instance from the event handler,
 * so we have to use a static property as a workaround!
 */
ValidChangeHandler.instance = null;

/**
 * Ensures that only one instance of the handler is obtained.
 * @return the singleton instance of the handler.
 */
ValidChangeHandler.getInstance = function() {
    if (!ValidChangeHandler.instance) {
        ValidChangeHandler.instance = new ValidChangeHandler();
    }
    return ValidChangeHandler.instance;
}

/**
 * Register a local geodatabase with this handler instance.
 * @geodatabaseItem the geodatabase item which should be registered.
 */
ValidChangeHandler.prototype.registerLocalGeodatabase = function (geodatabaseItem) {
    if (!geodatabaseItem.geodatabase) {
        console.error("The geodatabase must not be null!");
        return;
    }

    this.geodatabaseItem = geodatabaseItem;
    this.geodatabaseItem.geodatabase.validChanged.connect(this.validChanged);
}

ValidChangeHandler.prototype.validChanged = function () {
    var geodatabaseItem = ValidChangeHandler.getInstance().geodatabaseItem;
    if (!geodatabaseItem) {
        console.error("The geodatabase item must not be null!");
        return;
    }

    var focusMap = geodatabaseItem.map;
    if (!focusMap) {
        console.error("The map instance must not be null!");
        return;
    }

    var localGeodatabase = geodatabaseItem.geodatabase;
    if (!localGeodatabase) {
        console.error("The geodatabase instance must no be null!");
        return;
    }

    if (!localGeodatabase.valid) {
        console.error("Geodatabase " + localGeodatabase.path + " is not a valid geodatabase!");
        try {

        } catch (ex) {

        }
        return;
    }

    // Load all feature tables
    var featureTables = localGeodatabase.geodatabaseFeatureTables;
    console.log("Accessing feature tables.");
    for (var tableIndex in featureTables) {
        var localFeatureTable = featureTables[tableIndex];
        console.log("Feature table name: " + localFeatureTable.tableName);

        // Add the feature table as feature layer
        var localFeatureLayer = ArcGISRuntime.createObject("FeatureLayer");
        console.log("Feature layer created");
        localFeatureLayer.featureTable = localFeatureTable;

        console.log("Feature table bound");


        focusMap.insertLayer(localFeatureLayer, 0);
        console.log("Feature layer added");
    }
    if (featureTables.length < 1) {
        console.warn(localGeodatabase.path + " has no feature tables!");
    }
}

