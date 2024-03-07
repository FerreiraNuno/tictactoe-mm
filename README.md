## Websocket
### Sendable emits
- `search` To signal the server that you are searching for a game
```
<<empty>>
```
- `game.move` To send a move for a game to the server
```
MakeMoveDTO {
    gameId: number
    xPos: number
    yPos: number
}
```
- `game.message` Notifies you about a message that has been send in the game
```
InGameMassageDTO {
    gameId: number
    username: string
    message: string
}
```

### Receivable emits

- `search.count` Gives you the number of player in the queue
```
{
    count: this.inSearchQueue.size
}
```
- `search.list` ADMINS ONLY: Gives you information about who is searching for a game
```
[
    UserInfoDTO {
      id: number;
      username: string;
      mmr: number;
      isAdmin: boolean;
    }
]
```
- `game.list.info` ADMINS ONLY: Notifies you about the current games
```
[
    GameInfoDTO {
      gameId: number,
      player1: UserInfoDTO,
      player2: UserInfoDTO
    }
]

UserInfoDTO {
  id: number;
  username: string;
  mmr: number;
  isAdmin: boolean;
}
```
- `error` Notifies you about errors that occurred
```
{
    error: errorMsg
}
```
- `game.new` Notifies you about a new game that has been created for you and a partner that has been found
```
GameStatusDTO {
    gameId: number
    player1Username: string
    player2Username: string
    player1mmr: number
    player2mmr: number
    field: FieldStatus[][]
    currentUsername: string
}

FieldStatus {
    Empty = 0,
    P1 = 1,
    P2 = 2,
}
```
- `game.end` Notifies you that the game has ended
```
GameEndDTO {
    gameId: number
    winner: string
}
```
- `game.end.disconnected` Notifies you that the opponent has disconnected and the game has ended automatically
```
{
    gameId: gameId,
}
```
- `game.message` Notifies you about a message that has been send in the game
```
InGameMassageDTO {
    gameId: number
    username: string
    message: string
}
```
- `game.update` Notifies you about an update of your current game state
```
GameStatusDTO {
    gameId: number
    player1Username: string
    player2Username: string
    player1mmr: number
    player2mmr: number
    field: FieldStatus[][]
    currentUsername: string
}

FieldStatus {
    Empty = 0,
    P1 = 1,
    P2 = 2,
}
```