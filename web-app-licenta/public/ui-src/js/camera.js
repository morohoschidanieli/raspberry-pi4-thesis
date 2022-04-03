const cameraModule = {
    init: function () {
        cameraModule.config = {
            //Camera option buttons
            $toggleRecordingButton: $("#toggle-recording-action"),
            $toggleCaptureButton: $("#toggle-capture-action"),
            $toggleStreamButton: $("#toggle-stream"),
            $startingRecordingMessage: $(".js-recording-text"),

            //Camera move buttons
            $moveUpCameraButton: $("#up"),
            $moveDownCameraButton: $("#down"),
            $moveRightCameraButton: $("#right"),
            $moveLeftCameraButton: $("#left"),

            //Refresh stream
            $refreshStreamButton: $("#refresh-stream"),

            //Camera record text
            $startRecording: $(".js-recording-text"),

            //Stream source
            $streamSource: $("#stream-src"),

            isConnectionActive: false,
            connection: io('192.168.0.116:9000'),
        }
        cameraModule.emitLeftEvent();
        cameraModule.emitRightEvent();
        cameraModule.emitUpEvent();
        cameraModule.emitDownEvent();

        cameraModule.config.$moveUpCameraButton.on('click',function(){
            cameraModule.emitUpEvent();
        });
        cameraModule.config.$moveDownCameraButton.on('click',function(){
            cameraModule.emitDownEvent();
        });
        cameraModule.config.$moveRightCameraButton.on('click',function(){
            cameraModule.emitRightEvent();
        });
        cameraModule.config.$moveLeftCameraButton.on('click',function(){
            cameraModule.emitLeftEvent();
        });


        let img = $("<img src='stream.mjpg' />");

        img.on('load', function (e) {
            cameraModule.config.$streamSource.attr("src", "stream.mjpg");

            //Show arrows for camera control
            cameraModule.config.$moveUpCameraButton.show();
            cameraModule.config.$moveDownCameraButton.show();
            cameraModule.config.$moveRightCameraButton.show();
            cameraModule.config.$moveLeftCameraButton.show();
        }).on('error', function (e) {
            cameraModule.config.$streamSource.attr("src", "/assets/img/video-stream/no-video-stream.png");

            cameraModule.config.$toggleRecordingButton.attr("disabled", true);
            cameraModule.config.$toggleStreamButton.attr("disabled", true);
            cameraModule.config.$toggleCaptureButton.attr("disabled", true);
        });
    },

    toggleCapture: function () {
        cameraModule.config.$toggleRecordingButton.click(function () {
            cameraModule.config.$startRecording.toggleClass('hidden');
            $(this).toggleClass('active');

            const hasClassActive = $(this).hasClass('active');

            cameraModule.config.$toggleCaptureButton.attr("disabled", hasClassActive ? true : false);
            cameraModule.config.$toggleStreamButton.attr("disabled", hasClassActive ? true : false);
        })
    },

    toggleVideoStream: function () {
        cameraModule.config.$toggleStreamButton.click(function () {
            const hasStartCameraClass = cameraModule.config.$toggleStreamButton.hasClass('start-camera');
            cameraModule.config.$toggleStreamButton.toggleClass("stop-camera start-camera");

            cameraModule.config.$toggleCaptureButton.attr("disabled", hasStartCameraClass ? true : false);
            cameraModule.config.$toggleRecordingButton.attr("disabled", hasStartCameraClass ? true : false);

            if (hasStartCameraClass) {
                let img = $("<img src='stream.mjpg' />");

                img.on('load', function (e) {
                    cameraModule.config.$streamSource.attr("src", "stream.mjpg");

                    //Show arrows for camera control
                    cameraModule.config.$moveUpCameraButton.show();
                    cameraModule.config.$moveDownCameraButton.show();
                    cameraModule.config.$moveRightCameraButton.show();
                    cameraModule.config.$moveLeftCameraButton.show();
                }).on('error', function (e) {
                    cameraModule.config.$streamSource.attr("src", "/assets/img/video-stream/disabled-video-stream.png");
                });
            } else {
                cameraModule.config.$streamSource.attr("src", "/assets/img/video-stream/no-video-stream.png");

                //Hide arrows for camera control
                cameraModule.config.$moveUpCameraButton.hide();
                cameraModule.config.$moveDownCameraButton.hide();
                cameraModule.config.$moveRightCameraButton.hide();
                cameraModule.config.$moveLeftCameraButton.hide();
            }
        })
    },

    refresh : function(){
        cameraModule.config.$refreshStreamButton.click(function(){
            cameraModule.init()
        });
    },

    emitLeftEvent: function(){
        cameraModule.config.connection.emit( 'moveServoLeft' );
    },

    emitRightEvent: function(){
        cameraModule.config.connection.emit( 'moveServoRight' );
    },

    emitUpEvent: function(){
        cameraModule.config.connection.emit( 'moveServoUp' );
    },

    emitDownEvent: function(){
        cameraModule.config.connection.emit( 'moveServoDown' );
    }

};

cameraModule.init();
cameraModule.refresh();
cameraModule.toggleCapture();
cameraModule.toggleVideoStream();