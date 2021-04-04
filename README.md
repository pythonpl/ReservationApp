# ReservationApp

Ticket reservation and payment services.

# Assumptions

Certain assumptions were made:

- The services are implemented using the Express framework.

- Modules are organized according to purpose (*thematically*), not technical function.

- Unit tests for module are in the same directory as module.

- API tests and E2E test are located in the api_tests directory.

- Each ticket, reservation and user has unique string ID that is seven characters long.

- Selling option is one at the time, and valid for all tickets in the database. Using different option for every single ticket could make them mutually exclusive. For example:
    * We have 3 tickets left. One of them has selling option "EVEN", the remaining two have selling option "AVOID ONE". The result is that no ticket can be sold.

- We do not have any information about database yet. So, I've created a DB simulator (`dbMock.js`). The only module that has access to it is `dbAPI.js`. There is a mutex inside that module, that prevents double-booking or any similar problem. In production environment that needs to be changed to, for example database TRANSACTION mechanism.

- We have three main routes: 
    * `GET /freeTickets` - that responses with array of free ticketIDs.
    * `POST /reserve` - to create reservation. Requests have to match ReservationRequestSchema. It responses with JSON: `{ id: "reservation id", price: "price to pay" }`, or with error.
    * `POST /pay` - to pay for the reservation. Requests have to match PaymentRequestSchema. It responses with JSON: `{ status: "success", price: "amount of money charged", currency : "currency" }` or with error.

- We have also few routes for testing purposes that are enabled in API tests:
    * `GET /reset` - resets the database to defaults (puts example data inside).
    * `GET /insertMoreData` - inserts more data into database.

- There is a schedule function that makes tickets in reservation if it is expired. Starting payment locks the reservation for the time of PaymentGateway response. If it fails, the reservation is released, if it succeeds tickets remain reserved.

- In case of (for example) the unexpected application restart, at the startup runs a function `onStartupReservationCleanup()`, which releases the tickets if the time is up, or sets a schedule to release them after remaining time.

# Summary
I had a great time doing this project. I'm waiting for feedback and I'm open to a conversation.