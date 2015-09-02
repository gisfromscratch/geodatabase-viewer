
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

import QtQuick 2.3
import QtQuick.Controls 1.0
import QtQuick.Layouts 1.1
import ArcGIS.Runtime 10.26

import "GeodatabaseViewModel.js" as ViewModels

ApplicationWindow {
    id: appWindow
    width: 800
    height: 600
    title: "Geodatabase Viewer"

    property var viewModel: null

    ColumnLayout {
        MapGallery {
            id: mapGallery
            Layout.alignment: Qt.AlignTop
            Layout.fillWidth: true
            Layout.preferredWidth: appWindow.width
            Layout.preferredHeight: 80
        }

        Rectangle {
            id: mapArea
            Layout.alignment: Qt.AlignBottom
            Layout.preferredWidth: appWindow.width
            Layout.preferredHeight: appWindow.height - mapGallery.height
        }
    }

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
                        var mapViewFactory = Qt.createComponent("MapView.qml");
                        var addDataCallback = function() {
                            var localFilePath = url.replace(/^(file:\/{3})/,"");
                            var focusMap = mapViewFactory.createObject(mapArea);
                            appWindow.viewModel.addGeodatabase(focusMap, localFilePath);

                            // Create a map gallery item
                            mapGallery.addGeodatabaseItem(localFilePath);
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
            } else {
                console.error("No URLs in dropped element!");
            }
        }
    }

    Component.onCompleted: {
        appWindow.viewModel = new ViewModels.GeodatabaseViewModel();
    }

    onClosing: {
        appWindow.viewModel.destroy();
    }
}

