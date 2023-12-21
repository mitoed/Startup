### Link to [all notes](/notes.md).

# Login Notes

## Authorization Services

If a device needs to remember if a user is authenticated, store the user's `Authorization Token` as a cookie. Then, pages can check the token against the tokens in the DB.

## Passwords

Store passwords as hashs, preferably with generated salts. Remember that users will commonly reuse passwords across accounts, so it doesn't matter if your application does not need to be secure. A break-in could jeprodize users' other accounts.