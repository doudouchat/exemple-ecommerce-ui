USE test;

CREATE TYPE IF NOT EXISTS address (
    street text,
    city text,
    zip text,
    floor int,
	enable boolean
);

CREATE TYPE IF NOT EXISTS cgu (
	code text,
	version text
);

CREATE TABLE IF NOT EXISTS account ( 
	id UUID PRIMARY KEY,
	email text,
	status text,
	civility text, 
	lastname text, 
	firstname text, 
	birthday date,
    address address,	
	addresses map<text, frozen<address>>,
	profils set<text>,
	cgus set<frozen<cgu>>,
	age int,
	optin_mobile boolean,
	mobile text,
	creation_date timestamp,
	preferences list<frozen<map<text, text>>>
);

CREATE TABLE IF NOT EXISTS login (
	id UUID,
	login text PRIMARY KEY,
	password text,
	enable boolean,
	roles set<text>,
	scopes set<text>
);

CREATE TABLE IF NOT EXISTS subscription (
	email text PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS account_history ( 
	id UUID,
	field text,
	date timestamp,
	value text,
	PRIMARY KEY ((id), field)
);

CREATE TABLE IF NOT EXISTS parameter ( 
	app text PRIMARY KEY,
	histories map<text, boolean>,
	logins set<text>
);

CREATE TABLE IF NOT EXISTS resource_schema ( 
	app text,
    version text,
	resource text,
	content blob,
	filter set<text>,
	transform map<text, frozen<set<text>>>,
	rule map<text, frozen<set<text>>>,
	PRIMARY KEY ((app), resource, version)
);
       
CREATE INDEX IF NOT EXISTS account_status
	ON account ( status );

CREATE INDEX IF NOT EXISTS login_id
	ON login ( id );
	
CREATE TABLE IF NOT EXISTS stock ( 
	store text,
	product text,
	quantity counter,
	PRIMARY KEY ((store, product))
);