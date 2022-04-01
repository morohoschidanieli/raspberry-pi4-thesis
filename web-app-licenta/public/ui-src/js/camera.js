var cameraModule = {
    init:function(){
        cameraModule.config = {
            //Camera option buttons
            $toggleRecordingButton : $("#toggle-recording-action"),
            $toggleCaptureButton : $("#toggle-capture-action"),
            $toggleStreamButton : $("#toggle-stream"),
            $startingRecordingMessage : $(".js-recording-text"),

            //Camera move buttons
            $moveUpCameraButton : $("#up"),
            $moveDownCameraButton : $("#down"),
            $moveRightCameraButton : $("#right"),
            $moveLeftCameraButton : $("#left"),

            //Camera record text
            $startRecording :  $(".js-recording-text"),

            //Stream source
            $streamSource : $("#stream-src"),
        }

        let img = $("<img src='stream.mjpg' />");

        img.on('load', function(e){
            cameraModule.config.$streamSource.attr("src","stream.mjpg");

            //Show arrows for camera control
            cameraModule.config.$moveUpCameraButton.show();
            cameraModule.config.$moveDownCameraButton.show();
            cameraModule.config.$moveRightCameraButton.show();
            cameraModule.config.$moveLeftCameraButton.show();
        }).on('error', function(e) {
            cameraModule.config.$streamSource.attr("src","/assets/img/video-stream/no-video-stream.png");

            cameraModule.config.$toggleRecordingButton.attr("disabled", true);
            cameraModule.config.$toggleStreamButton.attr("disabled", true);
            cameraModule.config.$toggleCaptureButton.attr("disabled", true);
        });
    },

    toggleCapture: function(){
        cameraModule.config.$toggleRecordingButton.click(function(){
           cameraModule.config.$startRecording.toggleClass('hidden');
           $(this).toggleClass('active');

           const hasClassActive =$(this).hasClass('active');

           cameraModule.config.$toggleCaptureButton.attr("disabled", hasClassActive ? true : false);
           cameraModule.config.$toggleStreamButton.attr("disabled",  hasClassActive ? true : false);
        })
    },

    toggleVideoStream: function(){
        cameraModule.config.$toggleStreamButton.click(function(){
            cameraModule.config.$toggleStreamButton.toggleClass("stop-camera start-camera");

            const hasStartCameraClass = cameraModule.config.$toggleStreamButton.hasClass('start-camera');

            cameraModule.config.$toggleCaptureButton.attr("disabled", hasStartCameraClass ? true : false);
            cameraModule.config.$toggleRecordingButton.attr("disabled",  hasStartCameraClass ? true : false);

            if(hasStartCameraClass){
                let img = $("<img src='stream.mjpg' />");

                img.on('load', function(e){
                    cameraModule.config.$streamSource.attr("src","stream.mjpg");

                    //Show arrows for camera control
                    cameraModule.config.$moveUpCameraButton.show();
                    cameraModule.config.$moveDownCameraButton.show();
                    cameraModule.config.$moveRightCameraButton.show();
                    cameraModule.config.$moveLeftCameraButton.show();
                }).on('error', function(e) {
                    cameraModule.config.$streamSource.attr("src","/assets/img/video-stream/disabled-video-stream.png");
                });
            }else{
                cameraModule.config.$streamSource.attr("src","/assets/img/video-stream/no-video-stream.png");

                //Hide arrows for camera control
                cameraModule.config.$moveUpCameraButton.hide();
                cameraModule.config.$moveDownCameraButton.hide();
                cameraModule.config.$moveRightCameraButton.hide();
                cameraModule.config.$moveLeftCameraButton.hide();
            }
        })
    }

};

cameraModule.init();
cameraModule.toggleCapture();
cameraModule.toggleVideoStream();