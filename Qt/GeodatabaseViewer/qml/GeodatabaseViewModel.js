/**
 * View Model managing the loaded local geodatabases.
 */
function GeodatabaseViewModel() {
    this.geodatabases = [];
}
GeodatabaseViewModel.prototype = new Object;
GeodatabaseViewModel.prototype.addGeodatabase = function(geodatabase) {
    this.geodatabases.push(geodatabase);
    console.log(geodatabase);
}
