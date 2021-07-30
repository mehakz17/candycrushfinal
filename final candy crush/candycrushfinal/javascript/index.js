//how to play instruction popup//
$(document).ready(function () {
    $(".candy").on("click", function () {
        $(".popup, .popup-content").addClass("active");
    });
    $(".close, .popup").on("click", function () {
        $(".popup, .popup-content").removeClass("active");
    });

});
//speaker background music//
let image = document.getElementById('myImg');
    if (image.src.match("../images/volume-up.svg")) {
        image.src = "./images/volume-off.svg";
    } else {
        image.src = "./images/volume-up.svg";
    }

    $(".musicOff").click(function () {
        const image = document.getElementById('myImg');
        const x = document.getElementById("audioFile");
        x.play();
        if (image.src.match("./images/volume-off.svg")) {
            image.src = "./images/volume-up.svg";
        } else {
            image.src = "./images/volume-off.svg";
            x.pause();
        }
    });