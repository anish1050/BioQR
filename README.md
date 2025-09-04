# BioQR, A Secure File Sharing System

1. 3 MySQL Tables To Be Created -
```
CREATE TABLE bioqr.users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- bcrypt hashes need up to 60 characters, 255 is safe
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bioqr.qr_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  token VARCHAR(64) NOT NULL,
  user_id INT NOT NULL,
  file_id INT NOT NULL,
  expires_at DATETIME NOT NULL
);

CREATE TABLE bioqr.files (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  filename VARCHAR(255) NOT NULL,
  mimetype VARCHAR(100) NOT NULL,
  filepath VARCHAR(500) NOT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
2. Then After Cloning The Repo and adding **.env file** , Run ``npm run dev`` & ``node server.js``
