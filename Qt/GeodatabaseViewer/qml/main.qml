
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
                        var localFilePath = url.replace(/^(file:\/{3})/,"");
                        appWindow.viewModel.addGeodatabase(focusMap, localFilePath);
                    }
                }
            }
        }
    }

    Map {
        id: focusMap

        anchors.fill: parent

        wrapAroundEnabled: true

        ArcGISTiledMapServiceLayer {
            url: "http://services.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer"
        }

        Component.onCompleted: {
            appWindow.viewModel = new ViewModels.GeodatabaseViewModel();
        }
    }
}

