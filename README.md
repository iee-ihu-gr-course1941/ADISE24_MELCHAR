# ADISE24_MELCHAR

## Project explaination
This project is an implementation of the Blokus online game. It is a 2-player online game. One player creates a room and waits for another player to join. Once the second player joins the room, the game starts. Each player has their own board with the available blocks. By clicking on a block, the available moves on the main board are displayed. When the player selects their next move on the main board, the block disappears from their board and appears on the main board. Then, it is the second player’s turn.

## End points

1. https://users.iee.ihu.gr/~iee2020188/adise_php/createRoom.php


This PHP script handles the creation of a new game room.

* HTTP 200: room creation.
* HTTP 404: error at room creating.
* HTTP 405: method not allowed.

2. https://users.iee.ihu.gr/~iee2020188/adise_php/deleteRoom.php


This PHP script handles POST requests to delete a room from the database based on the provided room_id.

* HTTP 200: delete room.
* HTTP 500: internal server error.
* HTTP 405: method not allowed.


3. https://users.iee.ihu.gr/~iee2020188/adise_php/getAvailableRooms.php

This PHP script handles GET requests to retrieve a list of rooms from the database and return the data as a JSON response.

* HTTP 200: returns available rooms.
* HTTP 500: internal server error.
* HTTP 405: method not allowed.

4. https://users.iee.ihu.gr/~iee2020188/adise_php/getBoardMatchDetailsRoom.php

This PHP script is designed to handle GET requests and retrieve game-related information from the database based on the board_id. 

* HTTP 200: returns player's turn, players points.
* HTTP 500: internal server error.
* HTTP 405: method not allowed.

5. https://users.iee.ihu.gr/~iee2020188/adise_php/getMainBoard.php

This PHP script handles a GET request to retrieve the main board data from the database.

* HTTP 200: returns main board.
* HTTP 500: internal server error.
* HTTP 405: method not allowed.

6. https://users.iee.ihu.gr/~iee2020188/adise_php/getPlayerBoardByIdAndRoom.php

This PHP script handles a GET request to fetch a specific board's data from the database.

* HTTP 200: returns players board.
* HTTP 500: internal server error.
* HTTP 405: method not allowed.

7. https://users.iee.ihu.gr/~iee2020188/adise_php/getRoomById.php

This PHP script handles the retrieval of room details based on a GET request.

* HTTP 200: returns room's information.
* HTTP 500: internal server error.
* HTTP 405: method not allowed.

8. https://users.iee.ihu.gr/~iee2020188/adise_php/login.php

This PHP script handles logging in a user from a session.

* HTTP 200: user logged in.
* HTTP 401: wrong username or password.
* HTTP 404: user not found.

9. https://users.iee.ihu.gr/~iee2020188/adise_php/logout.php 

This PHP script handles logging out a user from a session. 

* HTTP 405: method not allowed.
* HTTP 400: bad request.

10. https://users.iee.ihu.gr/~iee2020188/adise_php/player2Join.php

This PHP script handles requests for a player to join an existing game room.

* HTTP 200: player2 joins room.
* HTTP 400: bad request.
* HTTP 500: internal server error.
* HTTP 405: method not allowed.

11. https://users.iee.ihu.gr/~iee2020188/adise_php/register.php

This PHP script handles user registration requests.

* HTTP 201: account created.
* HTTP 400: bad request.
* HTTP 409: conflict.
* HTTP 405: method not allowed.

12. https://users.iee.ihu.gr/~iee2020188/adise_php/session_manager.php

This PHP script is responsible for managing session security and handling access control in a web application.

* HTTP 200: ok.
* HTTP 401: Unauthorized.
* HTTP 405: method not allowed.

13. https://users.iee.ihu.gr/~iee2020188/adise_php/setBlockToMainBoard.php

This PHP script handles a POST request to update a game board in the database. It receives the board ID, block data, initial blocks, player information, and player ID as input.

* HTTP 200: ok, block added to main board.
* HTTP 400: bad request.
* HTTP 404: board not found.
* HTTP 500: internal server error.

14. https://users.iee.ihu.gr/~iee2020188/adise_php/setBoards.php

This PHP script is used to create a new game board in the database when a POST request is made. The script processes the provided input and inserts the data into the boards table. It also handles possible errors and ensures that the correct request method is used.

* HTTP 200: ok, boards setted successfully.
* HTTP 400: bad request.
* HTTP 405: method not allowed.
* HTTP 409: conflict.

15. https://users.iee.ihu.gr/~iee2020188/adise_php/sse.php

This script implements Server-Sent Events (SSE), allowing the server to send real-time updates to the client by monitoring changes in a game board. Based on the board's state and the server's actions, the script returns different messages.

* event: error
This event is returned when there is an error, such as an invalid board_id or if the board is not found.

* event: connected
This event is returned when the connection is successfully established, and the client is connected via SSE.

* event: update 
This event is returned whenever the board is updated (based on the updated_at value from the database). It is sent when there is a change in the board.

