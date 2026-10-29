-- =========================================================================================
-- SISTEMA INSTITUCIONAL DE CONTROL - BIENES TECNOLÓGICOS, REDES Y OFIMÁTICA
-- Hospital Central Universitario Dr. Antonio María Pineda (HCUAMP)
-- Esquema SQL equivalente a la base de datos Google Sheets (ID: 1qEEyduhUlRvFNhdg-fJPxJAcQVOYHwNVWORoet5BqEE)
-- =========================================================================================

-- 1. TABLA: Bienes Tecnológicos (Hoja "bienes")
CREATE TABLE IF NOT EXISTS bienes (
    id VARCHAR(50) PRIMARY KEY,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    departamento VARCHAR(150) NOT NULL,
    grupo VARCHAR(50) NOT NULL,
    subgrupo VARCHAR(50) NOT NULL,
    seccion VARCHAR(50),
    nro_bien_completo VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    caracteristicas VARCHAR(100) NOT NULL,
    modelo VARCHAR(100),
    color VARCHAR(50),
    serial VARCHAR(100),
    estado VARCHAR(20) DEFAULT 'Bueno' CHECK (estado IN ('Bueno', 'Regular', 'Inoperativo')),
    url_foto TEXT,
    estatus VARCHAR(20) DEFAULT 'Activo' CHECK (estatus IN ('Activo', 'Inactivo'))
);

-- 2. TABLA: Infraestructura de Red (Hoja "redes")
CREATE TABLE IF NOT EXISTS redes (
    id VARCHAR(50) PRIMARY KEY,
    modem_cant INT DEFAULT 0,
    router_cant INT DEFAULT 0,
    switch_cant INT DEFAULT 0,
    ap_cant INT DEFAULT 0,
    tipo_cableado VARCHAR(50),
    canalizacion VARCHAR(10) CHECK (canalizacion IN ('Sí', 'No')),
    ssid_wifi VARCHAR(100) NOT NULL,
    banda_wifi VARCHAR(50),
    proveedor VARCHAR(100),
    velocidad VARCHAR(50),
    responsable_pagos VARCHAR(150),
    estatus VARCHAR(20) DEFAULT 'Activo' CHECK (estatus IN ('Activo', 'Inactivo'))
);

-- 3. TABLA: Cuestionario de Diagnóstico en Ofimática (Hoja "cuestionario_ofimatica")
CREATE TABLE IF NOT EXISTS cuestionario_ofimatica (
    id SERIAL PRIMARY KEY,
    fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    nombre_completo VARCHAR(150) NOT NULL,
    correo_departamento VARCHAR(150) NOT NULL,
    word_frecuencia VARCHAR(50),
    word_nivel VARCHAR(50),
    excel_frecuencia VARCHAR(50),
    excel_nivel VARCHAR(50),
    slides_frecuencia VARCHAR(50),
    slides_nivel VARCHAR(50),
    correo_frecuencia VARCHAR(50),
    correo_nivel VARCHAR(50),
    nube_frecuencia VARCHAR(50),
    nube_nivel VARCHAR(50),
    estatus VARCHAR(20) DEFAULT 'Activo' CHECK (estatus IN ('Activo', 'Inactivo'))
);
