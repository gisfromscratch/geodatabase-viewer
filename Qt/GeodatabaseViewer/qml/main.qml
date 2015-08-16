
// Copyright 2014 ESRI
//
// All rights reserved under the copyright laws of the United States
// and applicable international laws, treaties, and conventions.
//
// You may freely redistribute and use this sample code, with or
// without modification, provided you include the original copyright
// notice and use restrictions.
//
// See the Sample code usage restrictions document for further information.
//

import QtQuick 2.1
import QtQuick.Controls 1.0
import ArcGIS.Runtime 10.3

import "GeodatabaseViewModel.js" as ViewModels

ApplicationWindow {
    id: appWindow
    width: 800
    height: 600
    title: "Geodatabase Viewer"

    property var viewModel: null

    DropArea {
        id: dropArea

        anchors.fill: parent

        onEntered: {
            if (!drag.hasUrls) {
                drag.accepted = false;
            }
        }

        onDropped: {
            if (drop.hasUrls) {
                // TODO: Validate the dropped file url
                for (var urlIndex in drop.urls) {
                    var url = drop.urls[urlIndex];
                    if (appWindow.viewModel) {
                        // Create a new map
                        var mapViewFactory = Qt.createComponent("mapview.qml");
                        var addDataCallback = function() {
                            var localFilePath = url.replace(/^(file:\/{3})/,"");
                            var focusMap = mapViewFactory.createObject(appWindow);
                            appWindow.viewModel.addGeodatabase(focusMap, localFilePath);
                        };

                        if (Component.Ready === mapViewFactory.status) {
                            addDataCallback();
                        } else {
                            mapViewFactory.statusChanged.connect(function () {
                                if (Component.Ready === mapViewFactory.status) {
                                    addDataCallback();
                                } else {
                                    console.error(mapViewFactory.errorString());
                                }
                            });
                        }

                    }
                }
            }
        }
    }

    Component.onCompleted: {
        appWindow.viewModel = new ViewModels.GeodatabaseViewModel();
    }
}

