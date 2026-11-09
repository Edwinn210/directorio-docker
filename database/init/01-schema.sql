CREATE DATABASE IF NOT EXISTS directorio;

USE directorio;

CREATE TABLE IF NOT EXISTS personas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) NOT NULL UNIQUE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO personas (nombre, ciudad, telefono)
VALUES
('Juan Perez', 'Bucaramanga', '3001000004'),
('Maria Gomez', 'Saravena', '3001000005')
ON DUPLICATE KEY UPDATE
nombre = VALUES(nombre),
ciudad = VALUES(ciudad);
