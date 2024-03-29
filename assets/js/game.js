
class Game {
    constructor() {
        this.cardArray = new Cards;
        this.firstCardClicked = null;
        this.secondCardClicked = null;
        this.matches = 0;
        this.maxMatches = 9;
        this.attempts = 0;
        this.gamesPlayed = 0;
        this.firstCardClickedImage = null;
        this.secondCardClickedImage = null;
        this.noClickable = false;
        this.executeGame = this.executeGame.bind(this);
        this.displayStats = this.displayStats.bind(this);
        this.handleCardClick = this.handleCardClick.bind(this);
        this.calculateAccuracy = this.calculateAccuracy.bind(this);
        this.displayStats = this.displayStats.bind(this);
        this.resetStats = this.resetStats.bind(this);
        this.applyClickHandlers = this.applyClickHandlers.bind(this);
        this.displayModalOnWin = this.displayModalOnWin.bind(this);
        this.resetGame = this.resetGame.bind(this);
        this.displayResetModal = this.displayResetModal.bind(this);
    }

    executeGame() {
        this.cardArray.appendCards();
        this.applyClickHandlers();
    }

    applyClickHandlers() {
        $('.card').click(this.handleCardClick);
        $('.card').click(this.displayStats);
        $('.modalReset').click(this.resetGame);
        $('.reset').click(this.displayResetModal);
    }

    handleCardClick (event) {
        if(this.noClickable) { 
            return;
        }
        
        $(event.currentTarget).addClass('isFlipped');
        if (this.firstCardClicked === null) {
            this.firstCardClicked = $(event.currentTarget);
            this.firstCardClickedImage = this.firstCardClicked.find('div:nth-child(2)').css('background-image');
            this.firstCardClicked.css('pointer-events', 'none'); // prevents card from being clicked again once flipped
            
        } else if (this.secondCardClicked === null) {
            this.secondCardClicked = $(event.currentTarget);
            this.secondCardClickedImage = this.secondCardClicked.find('div:nth-child(2)').css('background-image');
            this.secondCardClicked.css('pointer-events', 'none'); // prevents card from being clicked again once flipped
            this.attempts++;
        }
        if (this.firstCardClickedImage === this.secondCardClickedImage) {
            this.setCardValuesToNull();
            this.matches++;
            this.noClickable = false; 
        } else if (this.firstCardClicked === null || this.secondCardClicked === null || this.firstCardClickedImage === null || this.secondCardClickedImage === null) {
            return;
        } else if (this.firstCardClickedImage !== this.secondCardClickedImage) {
            this.flipCardsBackOnTimeout();
        }
        
        this.displayModalOnWin();
        
    }

    displayModalOnWin() {
        let modal = document.getElementsByClassName("modal1")[0];
        let button = document.getElementsByClassName("modalClose")[0];
    
        if (this.matches === this.maxMatches) {
            setTimeout( () => {
                modal.style.display = "block";
                this.resetStats();
            }, 1000)
        }
        button.onclick = () => {
            modal.style.display = "none";
        }
        window.onclick = (event) => {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    }

    displayResetModal() {

        let modal = document.getElementsByClassName("modal2")[0];
        let button = document.getElementsByClassName("modalReset")[0];
        
        modal.style.display = "block";
    
        button.onclick = () => {
            modal.style.display = "none";
        }

    }

    flipCardsBackOnTimeout() {
        this.noClickable = true; 
        setTimeout( () => {
            this.firstCardClicked.removeClass('isFlipped');
            this.firstCardClicked.css('pointer-events', ''); // allows for card to be clicked again once flipped back over
            this.firstCardClicked = null;
            this.firstCardClickedImage = null;
            this.noClickable = false; 
        }, 1300);
        setTimeout( () => {
            this.secondCardClicked.removeClass('isFlipped');
            this.secondCardClicked.css('pointer-events', '');  // allows for card to be clicked again once flipped back over
            this.secondCardClicked = null;
            this.secondCardClickedImage = null;
            this.noClickable = false; 
        }, 1300);
    }

    setCardValuesToNull() {
        this.firstCardClicked = null;
        this.firstCardClickedImage = null;
        this.secondCardClicked = null;
        this.secondCardClickedImage = null;
    }

    resetStats() {
        this.matches = 0;
        this.attempts = 0;
        this.gamesPlayed++;
        this.displayStats();
        this.cardArray.appendCards();
        $('.card').removeClass('isFlipped');
        $('.card').css('pointer-events', '');
        $('aside > div:last-child').text('0%');
    }

    displayStats() {
        let accuracy = this.calculateAccuracy()*100;
        $('aside > div:nth-child(5)').text(this.attempts);
        $('aside > div:last-child').text(Math.floor(accuracy) + "%");
        if ($('aside > div:last-child').text() === "NaN%") {
            $('aside > div:last-child').text('0%');
        }
        $('aside > div:nth-child(3)').text(this.gamesPlayed);
    }
    
    resetGame() {
        this.matches = 0;
        this.attempts = 0;
        this.displayStats();
        setTimeout(()=> {
            this.cardArray.appendCards();
        }, 400);
        this.setCardValuesToNull();
        $('.card').removeClass('isFlipped');
        $('.card').css('pointer-events', '');
        $('aside > div:last-child').text('0%');
        this.noClickable = false; 

    }

    calculateAccuracy () {
        return this.matches/this.attempts;
    }

}