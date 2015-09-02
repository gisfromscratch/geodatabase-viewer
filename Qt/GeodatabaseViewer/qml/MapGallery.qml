import QtQuick 2.3
import ArcGIS.Runtime 10.26

///
/// A map gallery containing the available maps.
///
Rectangle {
    width: parent.width
    height: 80

    color: "lightgrey"

    /**
     * Adds a new item into this map gallery.
     */
    function addGeodatabaseItem(localFilePath) {
        itemModel.append({ localPath: localFilePath });
    }

    ///
    /// Item template displaying a map
    ///
    Component {
        id: mapItemTemplate

        Item {
            width: 80
            height: 80

            Column {

                Map {
                    id: galleryMap
                    width: 80
                    height: 80

                    Geodatabase {
                        id: localGeodatabase
                        path: localPath

                        onValidChanged: {
                            if (valid) {
                                console.debug("Geodatabase item loaded.");

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

                                    galleryMap.insertLayer(localFeatureLayer, 0);
                                    console.log("Feature layer added");
                                }
                                if (featureTables.length < 1) {
                                    console.warn(localGeodatabase.path + " has no feature tables!");
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    ///
    /// The list model for all the geodatabase items.
    ///
    ListModel {
        id: itemModel
    }

    ///
    /// The list view displaying all the maps.
    ///
    ListView {
        anchors.fill: parent
        orientation: Qt.Horizontal

        delegate: mapItemTemplate
        model: itemModel
    }
}
