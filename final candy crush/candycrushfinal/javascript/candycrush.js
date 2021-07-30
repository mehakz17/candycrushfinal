$(document).ready(function () {
    let timeLeftDisplay = document.querySelector("#time-left");
    let startButton = document.querySelector("#start-button");
    let scoreDisplay = document.getElementById('score');
    let DisplayMoves = document.getElementById("noOfMoves");
    const newGAME = document.getElementById("new-game");
    let nextLevel = document.getElementById("next-level")
    nextLevel.disabled=false
    let timeLeft = 45;
    const target = 45;
    const grid = $(".grid");
    const squares = [];
    let square;
    let score = 0;
    let noOfMoves = 15;
    const width = 8;
    let timerInterval = null;
    let gameInterval = null;
    const candyColors = [
        "url(../images/blue.png)",
        "url(../images/yellow.png)",
        "url(../images/orange.png)",
        "url(../images/green.png)",
        "url(../images/red.png)",
        "url(../images/purple.png)"
    ];

    function checkIfAllPops() {
        let checkIfAllPops = false;
        noOfMoves -= 1;
        DisplayMoves.innerHTML = noOfMoves;

        while (
            checkColumnForFive() ||
            checkRowForFive() ||
            checkColumnForFour() ||
            checkRowForFour() ||
            checkColumnForThree() ||
            checkRowForThree()
        ) {
            checkIfAllPops = true;
        }
        return checkIfAllPops;


    }


    //speaker for background music on and off //
    let image = document.getElementById('myImg');
    if (image.src.match("../images/volume-up.svg")) {
        image.src = "../images/volume-off.svg";
    } else {
        image.src = "../images/volume-up.svg";
    }

    $(".musicOff").click(function () {
        const image = document.getElementById('myImg');
        const x = document.getElementById("audioFile");
        x.play();
        if (image.src.match("../images/volume-off.svg")) {
            image.src = "../images/volume-up.svg";
        } else {
            image.src = "../images/volume-off.svg";
            x.pause();
        }
    });

    function clearAllIntervals() {
        if (timerInterval) {
            clearInterval(timerInterval);

        }

        if (gameInterval) { clearInterval(gameInterval); }

    }

    //countdown timer//
    function countDown() {
        clearAllIntervals();
        timerInterval = setInterval(function () {
            if (timeLeft <= 0) {
                $('.grid').on('dragstart drop', function (e) {
                    e.preventDefault();
                    return false;
                });
                clearAllIntervals();
            } else {
                timeLeft -= 1;
            }
            timeLeftDisplay.innerHTML = timeLeft;

        }, 1000)
    }


    startButton.addEventListener('click', startGame);
    newGAME.addEventListener('click', newgame);
    //startbutton can be clicked once//
    let clicked = false;
    function startGame() {
        
        if (!clicked) {
            clicked = true
            //startButton.style.backGroundColor
            document.querySelector(".clickOnStart").innerHTML = "";
            //Set Interval will repeatedly check for matches
            createBoard();
            countDown();
            gameInterval = setInterval(() => {

                moveIntoSquareBelow();
                checkColumnForFive();
                checkRowForFive();
                checkColumnForFour();
                checkRowForFour();
                checkRowForThree();
                checkColumnForThree();

                if (score >= target) {
                    if (timeLeft >= 0 || noOfMoves >= 0) {
                        squares.forEach(function (square) {
                            square.setAttribute("draggable", "false")
                            

                        })
                        clearAllIntervals()
                        $('document').ready(function () {
                            const audio = new Audio("../sound/winner.mp3");
                            audio.play();
                        });


                        $('.winner').show();

                        $('.popupCloseButton').click(function () {
                            $('.winner').hide();
                        });
                        nextLevel.disabled=true

                        nextLevel.onclick = function () {
                            location.href = "../html/level2.html"
                        }
                    }
                }
                if (score < target) {
                    if (timeLeft == 0 || noOfMoves == 0) {
                        squares.forEach(function (square) {
                            square.setAttribute("draggable", "false")
                            
                        })
                        clearAllIntervals()
                        $('.loser').show();

                        $('.popupCloseButton').click(function () {
                            $('.loser').hide();
                        });
                        $('document').ready(function () {
                            const audio = new Audio("../sound/gameover.mp3");
                            audio.play();
                        });
                    }

                }
            }, 1000);


            squares.forEach(function (square) {
                square.addEventListener('dragstart', dragStart);
                square.addEventListener('dragend', dragEnd);
                square.addEventListener('dragover', dragOver);
                square.addEventListener('drop', dragDrop);
                square.addEventListener('dragleave', dragLeave);
                square.setAttribute('draggable', "true")

                // square.addEventListener('dragEnter', dragEnter)
            })

        }

    }




    //candycrush board with 64 squares (70*8=560)
    function createBoard() {
        for (let i = 0; i < width * width; ++i) {

            square = document.createElement("div");
            square.setAttribute("draggable", "true");
            square.setAttribute("id", i);
            let randomColor = Math.floor(Math.random() * candyColors.length);
            square.style.backgroundImage = candyColors[randomColor];
            // square.animate([
            //     // keyframes
            //     { transform: 'translateY(25px)' },
            //     { transform: 'rotate(360deg)'}
            //   ], {
            //     // timing options
            //     duration: 1000,
            //     iterations: Infinity

            //   });
            grid.append(square);
            squares.push(square);

        }
        console.log(squares);

    }

    let colorBeingDragged;
    let colorBeingReplaced;
    let squareIdBeingDragged;
    let squareIdBeingReplaced;

    //dragStart:fired when user drag an element//
    function dragStart() {
        console.log(this.id, "dragstart");

        colorBeingDragged = this.style.backgroundImage;
        squareIdBeingDragged = Number(this.id);
        console.log(colorBeingDragged);
    }


    //dragOver:fired when user drag an element over a valid drop target. It prevents dropping//
    function dragOver(event) {
        event.preventDefault();
        console.log(this.id, "dragover");
    }
    //drop:fired when the user drag an element at the valid drop target//
    function dragDrop() {
        console.log(this.id, "drop");
        colorBeingReplaced = this.style.backgroundImage;
        squareIdBeingReplaced = Number(this.id);
        this.style.backgroundImage = colorBeingDragged;
        squares[squareIdBeingDragged].style.backgroundImage = colorBeingReplaced;
    }
    //gragleave:fired when the dragged element leaves the valid target
    function dragLeave() {
        console.log(this.id, "dragleave");
    }
    // function dragEnter(event) {
    //     event.preventDefault()
    //     console.log(this.id, "dragenter")
    // }
    // dragend:fired when the drag action is being ended (releasing the mouse button)
    function dragEnd() {
        //What is a valid move? left , right , top and bottom

        let validMoves = [squareIdBeingDragged - 1,
        squareIdBeingDragged - width,
        squareIdBeingDragged + 1,
        squareIdBeingDragged + width
        ];

        let validMove = validMoves.includes(squareIdBeingReplaced);
        console.log("valid move", validMove);

        if (squareIdBeingReplaced >= 0 && validMove) {
            //switch the background color//
            squares[squareIdBeingDragged].style.backgroundImage = colorBeingReplaced;
            if (!checkIfAllPops()) {
                // go back to your place if no candy pops
                squares[squareIdBeingReplaced].style.backgroundImage = colorBeingReplaced;
                squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged;
            }


        } else if (squareIdBeingReplaced >= 0 && !validMove) {
            squares[squareIdBeingReplaced].style.backgroundImage = colorBeingReplaced;
            squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged;
        } else squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged;
    }




    //crush 3 candies in a row//
    function checkRowForThree() {
        let checkIfPop = false
        for (i = 0; i < 62; i++) {

            let rowOfThree = [i, i + 1, i + 2];
            let decidedColor = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === "";

            // const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55];

            // if (notValid.includes(i)) continue

            if (rowOfThree.every(function (index) {

                return squares[index].style.backgroundImage === decidedColor && !isBlank;

            })) {
                score += 3;
                scoreDisplay.innerHTML = score;
                if (noOfMoves <= 0) {

                    DisplayMoves.innerHTML = 0
                    squares.forEach(function (square) {
                        square.setAttribute("draggable", "false");

                    })
                }
                rowOfThree.forEach(function (i) {
                    squares[i].style.backgroundImage = '';
                    checkIfPop = true;

                })
                $('document').ready(function () {
                    const audio = new Audio("../sound/crush-audio.mp3");
                    audio.play();
                });

            }
        }
        return checkIfPop

    }

    function checkColumnForThree() {
        let checkIfPop = false
        for (i = 0; i < 48; i++) {
            let columnOfThree = [i, i + width, i + width * 2];

            let decidedColor = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === "";

            const notValid = [48, 49, 50, 51, 52, 53, 54, 56, 57, 58, 59, 60, 61, 62, 63];

            if (notValid.includes(i)) continue

            if (columnOfThree.every(function (index) {

                return squares[index].style.backgroundImage === decidedColor && !isBlank;

            })) {

                score += 3;
                scoreDisplay.innerHTML = score;

                if (noOfMoves <= 0) {

                    DisplayMoves.innerHTML = 0;
                    squares.forEach(function (square) {
                        square.setAttribute("draggable", "false")
                    });
                }

                columnOfThree.forEach(function (index) {
                    console.log(columnOfThree);
                    squares[index].style.backgroundImage = '';
                    checkIfPop = true;


                })
                $('document').ready(function () {
                    const audio = new Audio("../sound/crush-audio.mp3");
                    audio.play();
                });
            }
        }

        return checkIfPop;
    }

    //drop candies once some have been cleared
    function moveIntoSquareBelow() {
        for (i = 0; i < 56; i++) {
            if (squares[i + width].style.backgroundImage === '') {
                squares[i + width].style.backgroundImage = squares[i].style.backgroundImage;
                squares[i].style.backgroundImage = '';
                const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
                const isFirstRow = firstRow.includes(i);
                if (isFirstRow && (squares[i].style.backgroundImage === '')) {
                    let randomColor = Math.floor(Math.random() * candyColors.length);
                    squares[i].style.backgroundImage = candyColors[randomColor];
                }
                // $('document').ready(function () {
                //     const audio = new Audio("../.mp3");
                //     audio.play();
                // });

            }

        }
    }
    //for row of Four
    function checkRowForFour() {
        let checkIfPop = false
        for (i = 0; i < 61; i++) {
            let rowOfFour = [i, i + 1, i + 2, i + 3];
            let decidedColor = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === '';
            const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55];
            if (notValid.includes(i)) continue

            if (rowOfFour.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
                score += 4;
                scoreDisplay.innerHTML = score;

                if (noOfMoves <= 0) {

                    DisplayMoves.innerHTML = 0;
                }
                rowOfFour.forEach(function (index) {
                    squares[index].style.backgroundImage = ''
                    checkIfPop = true;

                    $('document').ready(function () {
                        const audio = new Audio("../sound/tasty.wav");
                        audio.play();
                    });
                })
            }
        }
        return checkIfPop
    }


    //for column of Four
    function checkColumnForFour() {
        let checkIfPop = false
        for (i = 0; i < 40; i++) {
            let columnOfFour = [i, i + width, i + width * 2, i + width * 3]
            let decidedColor = squares[i].style.backgroundImage
            const isBlank = squares[i].style.backgroundImage === ''

            if (columnOfFour.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {

                score += 4
                scoreDisplay.innerHTML = score

                if (noOfMoves <= 0) {

                    DisplayMoves.innerHTML = 0
                }

                columnOfFour.forEach(function (index) {
                    squares[index].style.backgroundImage = ''
                    checkIfPop = true

                })


                $('document').ready(function () {
                    const audio = new Audio("../sound/tasty.wav");
                    audio.play();
                });
            }
        }

        return checkIfPop

    }

    //row for five
    function checkRowForFive() {
        let checkIfPop = false
        for (i = 0; i < 60; i++) {
            let rowOfFive = [i, i + 1, i + 2, i + 3, i + 4]
            let decidedColor = squares[i].style.backgroundImage
            const isBlank = squares[i].style.backgroundImage === ''

            const notValid = [ 20, 28, 36, 44, 52, 60, 5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55]
            if (notValid.includes(i)) continue

            if (rowOfFive.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {

                score += 4
                scoreDisplay.innerHTML = score

                if (noOfMoves <= 0) {

                    DisplayMoves.innerHTML = 0
                }

                rowOfFive.forEach(function (index) {
                    squares[index].style.backgroundImage = ''
                    checkIfPop = true;

                    $('document').ready(function () {
                        const audio = new Audio("../sound/tasty.wav");
                        audio.play();
                    });
                })
            }
        }
        return checkIfPop
    }


    function checkColumnForFive() {
        let checkIfPop = false
        for (i = 0; i < 32; i++) {
            let columnOfFive = [i, i + width, i + width * 2, i + width * 3, i + width * 4]
            let decidedColor = squares[i].style.backgroundImage
            const isBlank = squares[i].style.backgroundImage === ''

            const notValid = [32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60]
            if (notValid.includes(i)) continue

            if (columnOfFive.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {

                score += 4
                scoreDisplay.innerHTML = score

                if (noOfMoves <= 0) {

                    DisplayMoves.innerHTML = 0
                }

                columnOfFive.forEach(function (index) {
                    squares[index].style.backgroundImage = ''
                    checkIfPop = true;

                    $('document').ready(function () {
                        const audio = new Audio("../sound/tasty.wav");
                        audio.play();
                    });
                })
            }
        }
        return checkIfPop
    }


    


    // How To Play Button//


    function newgame() {
        squares.forEach(function (square) {
            square.addEventListener('dragstart', dragStart)
            square.addEventListener('dragend', dragEnd)
            square.addEventListener('dragover', dragOver)
            square.addEventListener('drop', dragDrop)
            square.addEventListener('dragleave', dragLeave)
            square.setAttribute('draggable', "true")

            // square.addEventListener('dragEnter', dragEnter)
        })



        clearAllIntervals();

        noOfMoves = 15
        DisplayMoves.innerHTML = noOfMoves
        timeLeft = 45
        timeLeftDisplay.innerHTML = timeLeft
        score = 0
        scoreDisplay.innerHTML = score
        squares.forEach(function (square) {

            square.style.backgroundImage = ""
            let randomColor = Math.floor(Math.random() * candyColors.length)
            square.style.backgroundImage = candyColors[randomColor]
        })
        countDown()


        gameInterval = setInterval(() => {
            checkColumnForFive()
            checkColumnForFour()
            checkRowForFive()
            checkRowForFour()
            moveIntoSquareBelow()
            checkRowForThree()
            checkColumnForThree()
            if (score >= target) {
                if (timeLeft >= 0 || noOfMoves >= 0) {
                    squares.forEach(function (square) {
                        square.setAttribute("draggable", "false")
                       

                    })
                    clearAllIntervals()
                    $('document').ready(function () {
                        const audio = new Audio("../sound/winner.mp3");
                        audio.play();
                    });


                    $('.winner').show();

                    $('.popupCloseButton').click(function () {
                        $('.winner').hide();
                    });
                    nextLevel.disabled=false
                    nextLevel.onclick = function () {
                        location.href = "../html/level2.html"
                    }
                }
            }
            if (score < target) {
                if (timeLeft == 0 || noOfMoves == 0) {
                    squares.forEach(function (square) {
                        square.setAttribute("draggable", "false")
                       
                    })
                    clearAllIntervals()
                    $('.loser').show();

                    $('.popupCloseButton').click(function () {
                        $('.loser').hide();
                    });
                    $('document').ready(function () {
                        const audio = new Audio("../sound/gameover.mp3");
                        audio.play();
                    });
                }

            }
            
        }, 1000);

        if(timeLeft==0||noOfMoves==0){
            $('.grid').on('dragstart drop', function (e) {
                e.preventDefault();
                return false;
            });
        }




    }
})

