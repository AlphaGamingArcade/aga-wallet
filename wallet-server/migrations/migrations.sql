CREATE TABLE push_tokens (
    token_id INT NOT NULL,
    user_id NVARCHAR(510) NULL,
    token NVARCHAR(510) NULL,
    platform NVARCHAR(100) NULL,
    created_at DATETIME NULL,
    updated_at DATETIME NULL
);

CREATE TABLE notifications (
    id INT IDENTITY(1, 1) NOT NULL,
    user_id VARCHAR(250) NOT NULL,
    type VARCHAR(250) NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    is_viewed BIT DEFAULT 0,
    is_archived BIT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at DATETIME DEFAULT NULL
);

CREATE TABLE devices (
    id INT IDENTITY(1, 1) PRIMARY KEY,
    device_name VARCHAR(250) NOT NULL,
    user_id VARCHAR(250) NOT NULL,
	push_tokens VARCHAR(250) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT GETDATE()
);