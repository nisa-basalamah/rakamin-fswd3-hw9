-- create a new sequence for the 'id' column
CREATE SEQUENCE movies_id_seq START 1;

-- set the next value of the sequence to the maximum existing 'id' value + 1
SELECT setval(
    'movies_id_seq',
    (SELECT MAX(id) FROM movies)
);

-- drop any existing default constraint on the 'id' column
ALTER TABLE movies
    DROP CONSTRAINT IF EXISTS movies_pkey;

-- alter the column 'id' to use auto-incrementing behavior (SERIAL)
ALTER TABLE movies
    ALTER COLUMN id
    SET DEFAULT nextval('movies_id_seq');

-- recreate the primary key constraint on the 'id' column
ALTER TABLE movies
    ADD PRIMARY KEY (id);