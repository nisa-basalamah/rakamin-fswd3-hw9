-- create a new sequence for the 'id' column
CREATE SEQUENCE users_id_seq START 1;

-- set the next value of the sequence to the maximum existing 'id' value + 1
SELECT setval(
    'users_id_seq',
    (SELECT MAX(id) FROM users)
);

-- drop any existing default constraint on the 'id' column
ALTER TABLE users
    DROP CONSTRAINT IF EXISTS users_pkey;

-- alter the column 'id' to use auto-incrementing behavior (SERIAL)
ALTER TABLE users
    ALTER COLUMN id
    SET DEFAULT nextval('users_id_seq');

-- recreate the primary key constraint on the 'id' column
ALTER TABLE users
    ADD PRIMARY KEY (id);