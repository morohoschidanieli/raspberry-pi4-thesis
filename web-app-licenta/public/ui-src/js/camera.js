var cameraModule = {

    $toggleRecordingButton: $("#toggle-recording-action"),
    $toggleCaptureButton: $("#toggle-capture-action"),
    $toggleStreamButton: $("#toggle-stream"),

    $startingRecordingMessage: $(".js-recording-text"),

    toggleCapture: function(){
        this.$toggleRecordingButton.click(function(){
            $(".js-recording-text").toggleClass('hidden');
            $(this).toggleClass('active');
        })
    },

    toggleVideoStream: function(){
        this.$toggleStreamButton.click(function(){
            $(".fa-video-slash").toggleClass("stop-camera start-camera");
            if($(".fa-video-slash").hasClass('start-camera')){
                $("#stream-src").src="stream.mjpg";
            }else{
                $("#stream-src").src="/assets/img/video-stream/no-video-stream.png";
            }
        })
    }

};

// Outputs: Where in the world is Paul Irish today?
cameraModule.toggleCapture();
cameraModule.toggleVideoStream();