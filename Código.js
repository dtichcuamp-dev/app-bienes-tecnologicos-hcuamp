/**
 * =========================================================================================
 * SISTEMA INSTITUCIONAL DE CONTROL - BIENES TECNOLÓGICOS, REDES Y OFIMÁTICA
 * Hospital Central Universitario Dr. Antonio María Pineda (HCUAMP)
 *
 * Base de Datos: Google Sheets (ID: 1qEEyduhUlRvFNhdg-fJPxJAcQVOYHwNVWORoet5BqEE)
 * Web App Backend: https://script.google.com/macros/s/AKfycbyzY0V73VNkkrrHRwxCu_z2bSwmnEEDnEbjQwu81R4GYZLYHp3uo66vYgWDICAPinLR/exec
 * =========================================================================================
 */

var SPREADSHEET_ID = "1qEEyduhUlRvFNhdg-fJPxJAcQVOYHwNVWORoet5BqEE";
var FOLDER_NAME = "Inventario_Fotografias_Bienes";

// ================= CONEXIÓN CON SPREADSHEET =================
function getSpreadsheet() {
  try {
    if (SPREADSHEET_ID && SPREADSHEET_ID.trim() !== "") {
      return SpreadsheetApp.openById(SPREADSHEET_ID.trim());
    }
  } catch (e) {
    Logger.log("Aviso: No se pudo abrir por ID, intentando getActiveSpreadsheet: " + e.message);
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

// ================= INICIALIZACIÓN Y GENERACIÓN DE BASE DE DATOS =================
function inicializarBaseDeDatos() {
  try {
    var ss = getSpreadsheet();
    if (!ss) {
      return { status: "error", message: "No se pudo acceder a la hoja de cálculo con ID: " + SPREADSHEET_ID };
    }

    var headerBgColor = "#1e3a8a"; // Azul institucional
    var headerFontColor = "#ffffff";

    // 1. Hoja "bienes"
    var sheetBienes = ss.getSheetByName("bienes") || ss.insertSheet("bienes");
    var headersBienes = ["ID", "Fecha", "Departamento", "Grupo", "SubGrupo", "Sección", "Nro. de Bien", "Descripción", "Características", "Modelo", "Color", "Serial", "Estado", "URL", "Estatus"];
    if (sheetBienes.getLastRow() === 0) {
      sheetBienes.appendRow(headersBienes);
    } else {
      sheetBienes.getRange(1, 1, 1, headersBienes.length).setValues([headersBienes]);
    }
    sheetBienes.getRange(1, 1, 1, headersBienes.length)
      .setFontWeight("bold")
      .setBackground(headerBgColor)
      .setFontColor(headerFontColor)
      .setHorizontalAlignment("center");
    sheetBienes.setFrozenRows(1);

    // 2. Hoja "redes"
    var sheetRedes = ss.getSheetByName("redes") || ss.insertSheet("redes");
    var headersRedes = ["ID", "Modem (Cant)", "Router (Cant)", "Switch (Cant)", "Punto de Acceso (Cant)", "Tipo de Cableado", "Canalización", "SSID Wi-Fi", "Banda Wi-Fi", "Proveedor", "Velocidad", "Responsable de Pagos", "Estatus"];
    if (sheetRedes.getLastRow() === 0) {
      sheetRedes.appendRow(headersRedes);
    } else {
      sheetRedes.getRange(1, 1, 1, headersRedes.length).setValues([headersRedes]);
    }
    sheetRedes.getRange(1, 1, 1, headersRedes.length)
      .setFontWeight("bold")
      .setBackground(headerBgColor)
      .setFontColor(headerFontColor)
      .setHorizontalAlignment("center");
    sheetRedes.setFrozenRows(1);

    // 3. Hoja "cuestionario_ofimatica"
    var sheetOfi = ss.getSheetByName("cuestionario_ofimatica") || ss.insertSheet("cuestionario_ofimatica");
    var headersOfi = ["Fecha / Hora", "Nombre Completo", "Correo / Departamento", "Word Frecuencia", "Word Nivel", "Excel Frecuencia", "Excel Nivel", "Slides Frecuencia", "Slides Nivel", "Correo Frecuencia", "Correo Nivel", "Nube Frecuencia", "Nube Nivel", "Estatus"];
    if (sheetOfi.getLastRow() === 0) {
      sheetOfi.appendRow(headersOfi);
    } else {
      sheetOfi.getRange(1, 1, 1, headersOfi.length).setValues([headersOfi]);
    }
    sheetOfi.getRange(1, 1, 1, headersOfi.length)
      .setFontWeight("bold")
      .setBackground(headerBgColor)
      .setFontColor(headerFontColor)
      .setHorizontalAlignment("center");
    sheetOfi.setFrozenRows(1);

    // Si existe "Hoja 1" o "Sheet1" vacía, eliminarla para mantener limpio el libro
    var defaultSheet = ss.getSheetByName("Hoja 1") || ss.getSheetByName("Sheet1");
    if (defaultSheet && ss.getSheets().length > 1 && defaultSheet.getLastRow() === 0) {
      try { ss.deleteSheet(defaultSheet); } catch (e) {}
    }

    return {
      status: "success",
      message: "Estructura de Base de Datos verificada e inicializada correctamente en Google Sheets.",
      spreadsheetId: SPREADSHEET_ID,
      sheets: ["bienes", "redes", "cuestionario_ofimatica"]
    };
  } catch (error) {
    return { status: "error", message: "Error al inicializar BD: " + error.toString() };
  }
}

// ================= API ENDPOINT: doGet (Consultas y Render) =================
function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : "";

  // Si no se pide ninguna acción de API, sirve el index o devuelve info de estado
  if (!action) {
    try {
      return HtmlService.createTemplateFromFile('Index')
        .evaluate()
        .setTitle('Sistema Institucional - Inventario, Redes y Ofimática')
        .addMetaTag('viewport', 'width=device-width, initial-scale=1')
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    } catch (err) {
      return createJsonResponse({
        status: "success",
        message: "API Web App HCUAMP Activa y Operativa",
        spreadsheetId: SPREADSHEET_ID,
        endpoints: ["obtenerTodosLosBienes", "obtenerTodasLasRedes", "obtenerTodosLosDiagnosticos", "obtenerTodo", "init_db", "ping"]
      });
    }
  }

  var response;
  try {
    switch (action) {
      case "ping":
        response = { status: "success", message: "Backend activo", spreadsheetId: SPREADSHEET_ID, timestamp: new Date() };
        break;
      case "init_db":
        response = inicializarBaseDeDatos();
        break;
      case "obtenerTodosLosBienes":
        response = { status: "success", data: obtenerTodosLosBienes() };
        break;
      case "obtenerTodasLasRedes":
        response = { status: "success", data: obtenerTodasLasRedes() };
        break;
      case "obtenerTodosLosDiagnosticos":
        response = { status: "success", data: obtenerTodosLosDiagnosticos() };
        break;
      case "obtenerTodo":
        response = {
          status: "success",
          bienes: obtenerTodosLosBienes(),
          redes: obtenerTodasLasRedes(),
          ofimatica: obtenerTodosLosDiagnosticos()
        };
        break;
      default:
        response = { status: "error", message: "Acción GET no reconocida: " + action };
    }
  } catch (err) {
    response = { status: "error", message: "Error en doGet: " + err.toString() };
  }

  return createJsonResponse(response);
}

// ================= API ENDPOINT: doPost (Creación, Actualización, Eliminación, Fotos) =================
function doPost(e) {
  var response;
  try {
    var payload = {};
    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        payload = e.parameter || {};
      }
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    var action = payload.action || (e && e.parameter && e.parameter.action);

    switch (action) {
      case "guardarBien":
        response = guardarBien(payload.data || payload);
        break;
      case "actualizarBien":
        response = actualizarBien(payload.sheetRow, payload.data || payload);
        break;
      case "guardarInfraestructuraRed":
        response = guardarInfraestructuraRed(payload.data || payload);
        break;
      case "actualizarRed":
        response = actualizarRed(payload.sheetRow, payload.data || payload);
        break;
      case "guardarCuestionarioOfimatica":
        response = guardarCuestionarioOfimatica(payload.data || payload);
        break;
      case "actualizarOfimatica":
        response = actualizarOfimatica(payload.sheetRow, payload.data || payload);
        break;
      case "eliminarFilaSheets":
        response = eliminarFilaSheets(payload.sheetName || payload.nombreHoja, payload.sheetRow);
        break;
      case "subirFotoADrive":
        response = subirFotoADrive(payload.base64Data, payload.fileName, payload.mimeType);
        break;
      case "init_db":
        response = inicializarBaseDeDatos();
        break;
      default:
        response = { status: "error", message: "Acción POST no reconocida: " + action };
    }
  } catch (err) {
    response = { status: "error", message: "Error procesando POST: " + err.toString() };
  }

  return createJsonResponse(response);
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ================= 1. MÓDULO BIENES =================
function obtenerTodosLosBienes() {
  try {
    var ss = getSpreadsheet();
    if (!ss) return [];
    var sheet = ss.getSheetByName("bienes");
    if (!sheet || sheet.getLastRow() <= 1) return [];

    var lastRow = sheet.getLastRow();
    var data = sheet.getRange(2, 1, lastRow - 1, 15).getValues();
    var resultados = [];

    for (var i = 0; i < data.length; i++) {
      var row = data[i];
      var estatus = String(row[14] || "").trim(); // Columna O
      if (estatus === "") estatus = "Activo";

      if (estatus.toLowerCase() !== "inactivo") {
        var departamento = String(row[2] || "").trim();
        var nroBien = String(row[6] || "").trim();

        if (departamento !== "" || nroBien !== "") {
          resultados.push({
            sheetRow: i + 2,
            id: String(row[0] || ""),
            fecha: row[1] instanceof Date ? Utilities.formatDate(row[1], "America/Caracas", "yyyy-MM-dd HH:mm") : String(row[1] || ""),
            departamento: departamento,
            grupo: String(row[3] || ""),
            subgrupo: String(row[4] || ""),
            seccion: String(row[5] || ""),
            nroBienCompleto: nroBien,
            descripcion: String(row[7] || ""),
            caracteristicas: String(row[8] || ""),
            modelo: String(row[9] || ""),
            color: String(row[10] || ""),
            serial: String(row[11] || ""),
            estado: String(row[12] || "Bueno"),
            fotoUrl: String(row[13] || ""),
            estatus: estatus
          });
        }
      }
    }
    return resultados.reverse();
  } catch (e) {
    Logger.log("Error en obtenerTodosLosBienes: " + e.message);
    return [];
  }
}

function guardarBien(data) {
  try {
    var ss = getSpreadsheet();
    if (!ss) return { status: "error", message: "No se pudo conectar a Spreadsheet." };
    var sheet = ss.getSheetByName("bienes");
    if (!sheet) {
      inicializarBaseDeDatos();
      sheet = ss.getSheetByName("bienes");
    }

    var idGenerado = "BN-" + Utilities.formatDate(new Date(), "America/Caracas", "yyyyMMdd-HHmmss");
    var rowData = [
      idGenerado,
      new Date(),
      data.departamento || "",
      data.grupo || "",
      data.subgrupo || "",
      data.seccion || "",
      data.nroBienCompleto || "",
      data.descripcion || "",
      data.caracteristicas || "",
      data.modelo || "",
      data.color || "",
      data.serial || "",
      data.estado || "Bueno",
      data.fotoUrl || "",
      "Activo"
    ];

    sheet.appendRow(rowData);
    return { status: "success", message: "Bien tecnológico registrado con éxito.", id: idGenerado };
  } catch (error) {
    return { status: "error", message: "Error al guardar bien: " + error.toString() };
  }
}

function actualizarBien(sheetRow, data) {
  try {
    var ss = getSpreadsheet();
    if (!ss) return { status: "error", message: "No se pudo conectar a Spreadsheet." };
    var sheet = ss.getSheetByName("bienes");
    if (!sheet) return { status: "error", message: "No se encontró la hoja bienes." };

    var idActual = sheet.getRange(sheetRow, 1).getValue() || ("BN-" + Date.now());
    var fechaActual = sheet.getRange(sheetRow, 2).getValue() || new Date();
    var estatusActual = sheet.getRange(sheetRow, 15).getValue() || "Activo";

    var rowData = [
      idActual,
      fechaActual,
      data.departamento || "",
      data.grupo || "",
      data.subgrupo || "",
      data.seccion || "",
      data.nroBienCompleto || "",
      data.descripcion || "",
      data.caracteristicas || "",
      data.modelo || "",
      data.color || "",
      data.serial || "",
      data.estado || "Bueno",
      data.fotoUrl || "",
      estatusActual
    ];

    sheet.getRange(sheetRow, 1, 1, rowData.length).setValues([rowData]);
    return { status: "success", message: "Bien actualizado correctamente." };
  } catch (error) {
    return { status: "error", message: "Error al actualizar bien: " + error.toString() };
  }
}

// ================= 2. MÓDULO REDES =================
function obtenerTodasLasRedes() {
  try {
    var ss = getSpreadsheet();
    if (!ss) return [];
    var sheet = ss.getSheetByName("redes");
    if (!sheet || sheet.getLastRow() <= 1) return [];

    var lastRow = sheet.getLastRow();
    var data = sheet.getRange(2, 1, lastRow - 1, 13).getValues();
    var resultados = [];

    for (var i = 0; i < data.length; i++) {
      var row = data[i];
      var estatus = String(row[12] || "").trim(); // Columna M
      if (estatus === "") estatus = "Activo";

      if (estatus.toLowerCase() !== "inactivo") {
        var ssid = String(row[7] || "").trim();
        if (ssid !== "") {
          resultados.push({
            sheetRow: i + 2,
            id: String(row[0] || ""),
            modem: Number(row[1]) || 0,
            router: Number(row[2]) || 0,
            switch: Number(row[3]) || 0,
            ap: Number(row[4]) || 0,
            cableado: String(row[5] || ""),
            canalizacion: String(row[6] || ""),
            ssid: ssid,
            banda: String(row[8] || ""),
            proveedor: String(row[9] || ""),
            velocidad: String(row[10] || ""),
            responsable: String(row[11] || ""),
            estatus: estatus
          });
        }
      }
    }
    return resultados.reverse();
  } catch (e) {
    Logger.log("Error en obtenerTodasLasRedes: " + e.message);
    return [];
  }
}

function guardarInfraestructuraRed(data) {
  try {
    var ss = getSpreadsheet();
    if (!ss) return { status: "error", message: "No se pudo conectar a Spreadsheet." };
    var sheet = ss.getSheetByName("redes");
    if (!sheet) {
      inicializarBaseDeDatos();
      sheet = ss.getSheetByName("redes");
    }

    var idGenerado = "RED-" + Utilities.formatDate(new Date(), "America/Caracas", "yyyyMMdd-HHmmss");
    var rowData = [
      idGenerado,
      Number(data.modem) || 0,
      Number(data.router) || 0,
      Number(data.switch) || 0,
      Number(data.ap) || 0,
      data.cableado || "",
      data.canalizacion || "",
      data.ssid || "",
      data.banda || "",
      data.proveedor || "",
      data.velocidad || "",
      data.responsable || "",
      "Activo"
    ];

    sheet.appendRow(rowData);
    return { status: "success", message: "Infraestructura de red registrada con éxito.", id: idGenerado };
  } catch (e) {
    return { status: "error", message: "Error al guardar red: " + e.toString() };
  }
}

function actualizarRed(sheetRow, data) {
  try {
    var ss = getSpreadsheet();
    if (!ss) return { status: "error", message: "No se pudo conectar a Spreadsheet." };
    var sheet = ss.getSheetByName("redes");
    if (!sheet) return { status: "error", message: "No se encontró la hoja redes." };

    var idActual = sheet.getRange(sheetRow, 1).getValue() || ("RED-" + Date.now());
    var estatusActual = sheet.getRange(sheetRow, 13).getValue() || "Activo";

    var rowData = [
      idActual,
      Number(data.modem) || 0,
      Number(data.router) || 0,
      Number(data.switch) || 0,
      Number(data.ap) || 0,
      data.cableado || "",
      data.canalizacion || "",
      data.ssid || "",
      data.banda || "",
      data.proveedor || "",
      data.velocidad || "",
      data.responsable || "",
      estatusActual
    ];

    sheet.getRange(sheetRow, 1, 1, rowData.length).setValues([rowData]);
    return { status: "success", message: "Infraestructura de red actualizada con éxito." };
  } catch (e) {
    return { status: "error", message: "Error al actualizar red: " + e.toString() };
  }
}

// ================= 3. MÓDULO OFIMÁTICA =================
function obtenerTodosLosDiagnosticos() {
  try {
    var ss = getSpreadsheet();
    if (!ss) return [];
    var sheet = ss.getSheetByName("cuestionario_ofimatica");
    if (!sheet || sheet.getLastRow() <= 1) return [];

    var lastRow = sheet.getLastRow();
    var data = sheet.getRange(2, 1, lastRow - 1, 14).getValues();
    var resultados = [];

    for (var i = 0; i < data.length; i++) {
      var row = data[i];
      var estatus = String(row[13] || "").trim(); // Columna N
      if (estatus === "") estatus = "Activo";

      if (estatus.toLowerCase() !== "inactivo") {
        var nombre = String(row[1] || "").trim();
        if (nombre !== "") {
          resultados.push({
            sheetRow: i + 2,
            fechaHora: row[0] instanceof Date ? Utilities.formatDate(row[0], "America/Caracas", "yyyy-MM-dd HH:mm") : String(row[0] || ""),
            nombre: nombre,
            correo: String(row[2] || ""),
            tools: {
              word: { frecuencia: String(row[3] || "-"), nivel: String(row[4] || "-") },
              excel: { frecuencia: String(row[5] || "-"), nivel: String(row[6] || "-") },
              slides: { frecuencia: String(row[7] || "-"), nivel: String(row[8] || "-") },
              correo: { frecuencia: String(row[9] || "-"), nivel: String(row[10] || "-") },
              nube: { frecuencia: String(row[11] || "-"), nivel: String(row[12] || "-") }
            },
            estatus: estatus
          });
        }
      }
    }
    return resultados.reverse();
  } catch (e) {
    Logger.log("Error en obtenerTodosLosDiagnosticos: " + e.message);
    return [];
  }
}

function guardarCuestionarioOfimatica(data) {
  try {
    var ss = getSpreadsheet();
    if (!ss) return { status: "error", message: "No se pudo conectar a Spreadsheet." };
    var sheet = ss.getSheetByName("cuestionario_ofimatica");
    if (!sheet) {
      inicializarBaseDeDatos();
      sheet = ss.getSheetByName("cuestionario_ofimatica");
    }

    var tools = data.tools || {};
    var rowData = [
      new Date(),
      data.nombre || "",
      data.correo || "",
      (tools.word && tools.word.frecuencia) || "",
      (tools.word && tools.word.nivel) || "",
      (tools.excel && tools.excel.frecuencia) || "",
      (tools.excel && tools.excel.nivel) || "",
      (tools.slides && tools.slides.frecuencia) || "",
      (tools.slides && tools.slides.nivel) || "",
      (tools.correo && tools.correo.frecuencia) || "",
      (tools.correo && tools.correo.nivel) || "",
      (tools.nube && tools.nube.frecuencia) || "",
      (tools.nube && tools.nube.nivel) || "",
      "Activo"
    ];

    sheet.appendRow(rowData);
    return { status: "success", message: "Diagnóstico de ofimática registrado con éxito." };
  } catch (e) {
    return { status: "error", message: "Error al guardar diagnóstico: " + e.toString() };
  }
}

function actualizarOfimatica(sheetRow, data) {
  try {
    var ss = getSpreadsheet();
    if (!ss) return { status: "error", message: "No se pudo conectar a Spreadsheet." };
    var sheet = ss.getSheetByName("cuestionario_ofimatica");
    if (!sheet) return { status: "error", message: "No se encontró la hoja de ofimática." };

    var fechaActual = sheet.getRange(sheetRow, 1).getValue() || new Date();
    var estatusActual = sheet.getRange(sheetRow, 14).getValue() || "Activo";
    var tools = data.tools || {};

    var rowData = [
      fechaActual,
      data.nombre || "",
      data.correo || "",
      (tools.word && tools.word.frecuencia) || "",
      (tools.word && tools.word.nivel) || "",
      (tools.excel && tools.excel.frecuencia) || "",
      (tools.excel && tools.excel.nivel) || "",
      (tools.slides && tools.slides.frecuencia) || "",
      (tools.slides && tools.slides.nivel) || "",
      (tools.correo && tools.correo.frecuencia) || "",
      (tools.correo && tools.correo.nivel) || "",
      (tools.nube && tools.nube.frecuencia) || "",
      (tools.nube && tools.nube.nivel) || "",
      estatusActual
    ];

    sheet.getRange(sheetRow, 1, 1, rowData.length).setValues([rowData]);
    return { status: "success", message: "Diagnóstico de ofimática actualizado con éxito." };
  } catch (e) {
    return { status: "error", message: "Error al actualizar diagnóstico: " + e.toString() };
  }
}

// ================= BORRADO LÓGICO (Soft Delete) =================
function eliminarFilaSheets(nombreHoja, sheetRow) {
  try {
    var ss = getSpreadsheet();
    if (!ss) return { status: "error", message: "No se pudo conectar a Spreadsheet." };
    var sheet = ss.getSheetByName(nombreHoja);

    if (sheet && sheetRow && sheetRow > 1) {
      var colEstatus = 15; // Columna O para "bienes"
      if (nombreHoja === "redes") {
        colEstatus = 13; // Columna M para "redes"
      } else if (nombreHoja === "cuestionario_ofimatica") {
        colEstatus = 14; // Columna N para "cuestionario_ofimatica"
      }

      sheet.getRange(sheetRow, colEstatus).setValue("Inactivo");
      return { status: "success", message: "Registro marcado como inactivo correctamente." };
    }
    return { status: "error", message: "No se pudo localizar la fila o la hoja indicada (" + nombreHoja + ", fila " + sheetRow + ")." };
  } catch (error) {
    return { status: "error", message: "Error al actualizar estatus: " + error.toString() };
  }
}

// ================= SUBIDA AUTOMÁTICA DE FOTOS A GOOGLE DRIVE =================
function subirFotoADrive(base64Data, fileName, mimeType) {
  try {
    if (!base64Data) {
      return { status: "error", message: "No se proporcionaron datos de imagen." };
    }

    var folders = DriveApp.getFoldersByName(FOLDER_NAME);
    var folder;
    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(FOLDER_NAME);
      folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    }

    var rawData = base64Data;
    if (rawData.indexOf(",") > -1) {
      rawData = rawData.split(",")[1];
    }

    var decodedData = Utilities.base64Decode(rawData);
    var blobName = fileName || ("Bien_" + Date.now() + ".jpg");
    var blobMime = mimeType || "image/jpeg";
    var blob = Utilities.newBlob(decodedData, blobMime, blobName);

    var file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    var fileId = file.getId();
    var directUrl = "https://lh3.googleusercontent.com/d/" + fileId;

    return {
      status: "success",
      url: directUrl,
      fileId: fileId,
      viewUrl: file.getUrl()
    };
  } catch (error) {
    return { status: "error", message: "Error al subir a Google Drive: " + error.toString() };
  }
}
