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
        this.currentPlayer = 'O';
        this.gameActive = true;
        this.history = [];
    }

    startGame() {
        this.board.fill(null);
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.history = [];
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
        this.currentPlayer = this.currentPlayer === 'O' ? 'O' : 'X';

        // 이동이 성공적이면 history에 추가 
        this.history.push(cellIndex);
        
        // 게임 상태를 확인
        const gameStatus = this.checkGame();
        switch(gameStatus) {
            case 'X' :
                alert("X의 승리!") ;
                this.gameActive = false ; 
                break ;
            case 'O' :
                alert("O의 승리!") ;
                this.gameActive = false ; 
                break ;
            case 'draw' :
                alert("무승부!") ;
                this.gameActive = false ; 
                break ;
            default :
                break ; 
        }
    }
    
    undoMove() {
        // 마지막 이동을 되돌리는 로직(자기 차례일때만 가능)
        
        if(this.history.length === 0) {
            return; // 되돌릴 이동이 없으면 종료
        }
        
        let historyLen = this.history.length ;        
        this.board[historyLen-1] = null ;
        this.board[historyLen-2] = null ; 
        const gameStatus = this.checkGame();
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
        
        Object.entries(victoryConditions).forEach(([key, value]) => {
            let oCount = 0 ;
            let xCount = 0 ;  

            //elmt 부분 수정해야할듯 
            value.forEach(elmt => {
                if(oArray.includes(elmt)) oCount++ ;
                if(xArray.includes(elmt)) xCount++ ; 
            }) ;
            if(oCount == 3 || xCount == 3) {
                gameResult = oCount === 3 ? 'O' : 'X' ;  
            }
        }) ;
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

const cellElements = document.querySelectorAll('.cell');   
for (let i = 0; i < cellElements.length; i++) {
    cellElements[i].addEventListener('click', () => {
        const cellIndex = i; 
        game.makeMove(cellIndex);
        game.updateUI();
    });
}


// 해야할 것 : UI 업데이트 로직 구현 -> 
// 자신의 차리가 아닐시에는 화면 잠금 ?/makeMove함수 작동 x 
//  

// O 먼저 시작 
// 로직 : move다음에는 무조건 updateUI 호출
