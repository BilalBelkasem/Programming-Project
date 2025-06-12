
CREATE TABLE IF NOT EXISTS Likes (
  User_ID INT(11) NOT NULL,
  ID_target INT(11) NOT NULL,
  target_type VARCHAR(50) NOT NULL,
  PRIMARY KEY (User_ID, ID_target, target_type)
);
