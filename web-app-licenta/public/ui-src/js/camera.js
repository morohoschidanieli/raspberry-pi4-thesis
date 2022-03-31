var cameraModule = {

    $toggleRecordingButton: $("#toggle-recording-action"),
    $toggleCaptureButton: $("#toggle-capture-action"),

    $startingRecordingMessage: $(".js-recording-text"),

    toggleCapture: function(){
        this.$toggleRecordingButton.click(function(){
            $(".js-recording-text").toggleClass('hidden');
            $(this).toggleClass('active');
        })
    }

};

// Outputs: Where in the world is Paul Irish today?
cameraModule.toggleCapture();