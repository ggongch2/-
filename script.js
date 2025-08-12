// board에 대한 승리 조건
// key: 승리 조건의 종류
// value: 해당 승리 조건을 만족하는 인덱스 조합의 배열

const victoryConditions = {
    horizontal: [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8]
    ],
    vertical: [
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8]
    ],
    diagonal: [
        [0, 4, 8],
        [2, 4, 6]
    ]
}; 

class TicTacToe {

    constructor() {
        this.board = Array(9).fill(null);
        this.gamemode = 'PvP' ; 
        this.currentPlayer = 'O';
        this.gameActive = true;
        this.history = [];
    }

    startGame() {
        this.board.fill(null);
        this.currentPlayer = 'O';
        this.gameActive = true;
        this.history = [];
        this.gamemode = 'PvP' ; 

        const currentGameStatus = document.querySelector('#game-status') ;
        currentGameStatus.textContent = 'Game Status: In Progress' ; 

        this.updateUI();
        const cellElements = document.querySelectorAll('.cell');
        for (let i = 0; i < cellElements.length; i++) {
            const cell = cellElements[i];
            cell.textContent = null ; 
            cell.removeAttribute('user') ; 
        }   
    }

    updateUI() {
        // UI 업데이트 로직 
        const cellElements = document.querySelectorAll('.cell');
        for (let i = 0; i < cellElements.length; i++) {
            const cell = cellElements[i];
            cell.textContent = this.board[i] === null ? '' : this.board[i];
        }   
        const currentPlayer = document.querySelector('#current-player') ;
        currentPlayer.textContent = 'Current Player: '+ this.currentPlayer ; 
        this.checkGameEnd() ;
    }

    checkGameEnd() {
        // 게임 상태를 확인
        const gameStatus = this.checkGame();
        const currentGameStatus = document.querySelector('#game-status') ;
        switch(gameStatus) {
            case 'X' :
                alert("X의 승리!") ;
                this.gameActive = false ; 
                currentGameStatus.textContent = 'Game Status: ' + 'X win!' ;
                break ;
            case 'O' :
                alert("O의 승리!") ;
                this.gameActive = false ; 
                currentGameStatus.textContent = 'Game Status: '+  'O win!' ;
                break ;
            case 'draw' :
                alert("무승부!") ;
                this.gameActive = false ; 
                currentGameStatus.textContent = 'Game Status: '+  'Drew!' ;
                break ;
            default :
                currentGameStatus.textContent = 'Game Status: '+  'In Progress' ;
                break ; 
        }

    }
    // 플레이어의 이동을 처리하는 메소드(ai도 이용) 
    // 매개변수는 cellIndex (0-8) 
    makeMove(cellIndex) {

        // gameActive가 false이거나 이미 선택된 칸이면 null 반환, 자신의 처리가 아닐시에는 작동 x
        if(!this.gameActive || this.board[cellIndex] !== null ) {
            return null; 
        }  
        // 현재 플레이어의 이동을 board에 추가
        // 속성을 추가해서 style도 바꿔주기 
        this.board[cellIndex] = this.currentPlayer;
        const targetCell = document.querySelectorAll('.cell')[cellIndex] ; 
        targetCell.setAttribute('user', this.currentPlayer) ; 


        // 현재 플레이어를 변경
        this.currentPlayer = this.currentPlayer === 'O' ? 'X' : 'O';

        // 이동이 성공적이면 history에 추가 
        this.history.push(cellIndex);
        
    }


    AImakeMove() {
        // 칸을 순회하면서 가능한 move를 찾기 
        let possibleMoves = [] ;
        
        // 가능한 move중 최선의 수 찾기



        // 해당 move를 반환, 현재 플레이어 변경


        //이동이 성공적이면 history에 추가




    }
    
    undoMove() {
        // 마지막 이동을 되돌리는 로직(자기 차례일때만 가능)
        // PvP의 경우는 자신의 두번째수부터 가능 -> 앞선 두수를 지우면 됨
        if(this.history.length < 2) {
            return; // 되돌릴 이동이 없으면 종료
        }
        
        const lastMove_d1 = this.history.pop() ;
        const lastMove_d2 = this.history.pop() ;
        if(lastMove_d1 !== undefined) this.board[lastMove_d1] = null ;
        if(lastMove_d2 !== undefined) this.board[lastMove_d2] = null ;  


        const gameStatus = this.checkGame();
        this.gameActive = true ; 
        



    } 

    checkGame() {
        // 게임의 상태를 반환하는 메서드
        // 반환값은 'X', 'O', 'draw', 또는 null -> 아직 결정되지 않음

        let oArray = [] ;
        let xArray = [] ;
        let gameResult = null ;

        for (let i = 0; i < this.board.length; i++) {
            if(this.board[i] == 'O') {
              oArray.push(i) ;  
            }
            else if(this.board[i] == 'X') {
                xArray.push(i) ; 
            }
        }
        
        for(const key of Object.keys(victoryConditions)){
            victoryConditions[key].forEach(condition =>{
                let oCount = 0 ;
                let xCount = 0 ;
                for(const elmt of condition){
                    if(oArray.includes(elmt)) oCount++ ;
                    if(xArray.includes(elmt)) xCount++ ; 
                }
                if(oCount == 3){
                    gameResult = 'O' ; 
                }
                if(xCount == 3){
                    gameResult = 'X' ; 
                }
            });
        }

        //this.board가 모두 차있고 승리조건으로 결정X이면 draw 
        if(this.history.length === 9 && gameResult === null) gameResult = 'draw' ; 
        return gameResult ;  

    }
    resetGame() {
        this.startGame();
    }


   

}

const game = new TicTacToe();

const startButton = document.getElementById('start-button');
const undoMoveButton = document.getElementById('undo-button');
const resetButton = document.getElementById('reset-button');
const gamemodeButton = document.getElementById('game-mode') ; 

startButton.addEventListener('click', () => {
    game.startGame();
    game.updateUI(); 
});

// undo버튼은 자기차례일때만 클릭가능
undoMoveButton.addEventListener('click', () => {
    game.undoMove();
    game.updateUI();   
});

resetButton.addEventListener('click', () => {
    game.resetGame();
    game.updateUI();
}); 

gamemodeButton.addEventListener('click', () =>{
    if(game.gamemode == 'PvP'){
        const gamemodeText = document.querySelector('.container h1') ; 
        gamemodeText.textContent = 'Tic Tac Toe AI' ;
        game.gamemode = 'AI' ; 

    }
    else if(game.gamemode == 'AI'){
        const gamemodeText = document.querySelector('.container h1') ; 
        gamemodeText.textContent = 'Tic Tac Toe PvP' ;
        game.gamemode = 'PvP' ; 
    }
})

const cellElements = document.querySelectorAll('.cell');   
for (let i = 0; i < cellElements.length; i++) {
    cellElements[i].addEventListener('click', () => {
        const cellIndex = i; 
        game.makeMove(cellIndex);
        game.updateUI();
        if(game.gamemode === "AI"){
            // 이 기간 동안은 보드 잠그기ㅣ, makeMove 상호작용 불가 및 각종 버튼 작동불가 <- 걍 전체 화면을 터치불가?로 하는것도 ㄱㅊ을듯 
            const overlay = document.querySelector('#overlay') ;
            overlay.setAttribute('display',"") ;
            game.AImakeMove() ;
            game.updateUI() ;  
            overlay.setAttribute('display',"none") ;
        }
    });
}

