/**
 * View Model managing the loaded local geodatabases.
 */
function GeodatabaseViewModel() {
    this.geodatabases = {};
}
GeodatabaseViewModel.prototype = new Object;
GeodatabaseViewModel.prototype.addGeodatabase = function(focusMap, geodatabaseFileUrl) {
    try {
        // Create the local geodatabase instance
        var localGeodatabase = ArcGISRuntime.createObject("Geodatabase");
        console.log("Trying to load geodatabase: " + geodatabaseFileUrl);
        localGeodatabase.validChanged.connect(localGeodatabase, this.validChanged);
        localGeodatabase.path = geodatabaseFileUrl;

        // Add a strong reference to it
        this.geodatabases[geodatabaseFileUrl] = { 'geodatabase': localGeodatabase };
    } catch (ex) {
        console.error(ex);
    }
}
GeodatabaseViewModel.prototype.validChanged = function (localGeodatabase) {
    if (!localGeodatabase || !localGeodatabase.valid) {
        console.error("Geodatabase is not a valid geodatabase!");
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
