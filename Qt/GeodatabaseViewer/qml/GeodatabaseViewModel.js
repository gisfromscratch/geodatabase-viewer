/**
 * View Model managing the loaded local geodatabases.
 */
function GeodatabaseViewModel() {
    this.geodatabases = {};
}
GeodatabaseViewModel.prototype = new Object;
GeodatabaseViewModel.datastore = [];
GeodatabaseViewModel.prototype.addGeodatabase = function(focusMap, geodatabaseFileUrl) {
    try {
        // Create the local geodatabase instance
        var localGeodatabase = ArcGISRuntime.createObject("Geodatabase");
        console.log("Trying to load geodatabase: " + geodatabaseFileUrl);

        // Add a strong reference to it
        this.geodatabases[geodatabaseFileUrl] = { 'geodatabase': localGeodatabase };
        GeodatabaseViewModel.datastore.push(localGeodatabase);

        // Set signal handler
        var changeHandler = new ValidChangeHandler();
        changeHandler.registerLocalGeodatabase(localGeodatabase);
        localGeodatabase.path = geodatabaseFileUrl;
    } catch (ex) {
        console.error(ex);
    }
}


/**
 * Handles all validation changes of a geodatabase instance.
 */
function ValidChangeHandler() {
    this.localGeodatabase = {};
}

ValidChangeHandler.prototype = new Object;

/**
 * Register a local geodatabase with this handler instance.
 * @localGeodatabase the local geodatabase which should be registered.
 */
ValidChangeHandler.prototype.registerLocalGeodatabase = function (localGeodatabase) {
    this.localGeodatabase = localGeodatabase;
    this.localGeodatabase.validChanged.connect(this.validChanged);
}

ValidChangeHandler.prototype.validChanged = function () {
    var localGeodatabase = GeodatabaseViewModel.datastore[0];
    if (!localGeodatabase) {
        console.error("The geodatabase instance must no be null!");
        return;
    }

    if (!localGeodatabase.valid) {
        console.error("Geodatabase " + localGeodatabase.path + " is not a valid geodatabase!");
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
        console.warn(geodatabaseFileUrl + " has no feature tables!");
    }
}

