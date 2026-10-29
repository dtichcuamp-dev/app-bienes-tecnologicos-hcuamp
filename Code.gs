function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Sistema Institucional - Inventario, Redes y Ofimática')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// ================= LECTURA DE BIENES =================
function obtenerTodosLosBienes() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("bienes");
    if (!sheet || sheet.getLastRow() <= 1) return [];
    
    var data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 15).getValues();
    var resultados = [];
    
    for (var i = 0; i < data.length; i++) {
      var row = data[i];
      var departamento = String(row[2] || "").trim();
      var nroBienCompleto = String(row[6] || "").trim();
      var estatus = String(row[14] || "Activo").trim();
      
      if (departamento !== "" || nroBienCompleto !== "") {
        resultados.push({
          sheetRow: i + 2,
          id: String(row[0] || ""),
          fecha: String(row[1] || ""),
          departamento: departamento,
          grupo: String(row[3] || ""),
          subgrupo: String(row[4] || ""),
          seccion: String(row[5] || ""),
          nroBienCompleto: nroBienCompleto,
          descripcion: String(row[7] || ""),
          caracteristicas: String(row[8] || ""),
          modelo: String(row[9] || ""),
          color: String(row[10] || ""),
          serial: String(row[11] || ""),
          estado: String(row[12] || "Bueno"),
          fotoUrl: String(row[13] || ""),
          estatus: estatus !== "" ? estatus : "Activo"
        });
      }
    }
    return resultados.reverse();
  } catch (e) {
    return [];
  }
}

// ================= LECTURA DE REDES =================
function obtenerTodasLasRedes() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("redes");
    if (!sheet || sheet.getLastRow() <= 1) return [];
    
    var data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 13).getValues();
    var resultados = [];
    
    for (var i = 0; i < data.length; i++) {
      var row = data[i];
      var ssid = String(row[7] || "").trim();
      var estatus = String(row[12] || "Activo").trim();
      
      if (ssid !== "") {
        resultados.push({
          sheetRow: i + 2,
          id: String(row[0] || ""),
          modem: row[1] || 0,
          router: row[2] || 0,
          switch: row[3] || 0,
          ap: row[4] || 0,
          cableado: String(row[5] || ""),
          canalizacion: String(row[6] || ""),
          ssid: ssid,
          banda: String(row[8] || ""),
          proveedor: String(row[9] || ""),
          velocidad: String(row[10] || ""),
          responsable: String(row[11] || ""),
          estatus: estatus !== "" ? estatus : "Activo"
        });
      }
    }
    return resultados.reverse();
  } catch (e) {
    return [];
  }
}

// ================= LECTURA DE OFIMÁTICA =================
function obtenerTodosLosDiagnosticos() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("cuestionario_ofimatica");
    if (!sheet || sheet.getLastRow() <= 1) return [];
    
    var data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 14).getValues();
    var resultados = [];
    
    for (var i = 0; i < data.length; i++) {
      var row = data[i];
      var nombre = String(row[1] || "").trim();
      var estatus = String(row[13] || "Activo").trim();
      
      if (nombre !== "") {
        resultados.push({
          sheetRow: i + 2,
          fechaHora: String(row[0] || ""),
          nombre: nombre,
          correo: String(row[2] || ""),
          tools: {
            word: { frecuencia: String(row[3] || "-"), nivel: String(row[4] || "-") },
            excel: { frecuencia: String(row[5] || "-"), nivel: String(row[6] || "-") },
            slides: { frecuencia: String(row[7] || "-"), nivel: String(row[8] || "-") },
            correo: { frecuencia: String(row[9] || "-"), nivel: String(row[10] || "-") },
            nube: { frecuencia: String(row[11] || "-"), nivel: String(row[12] || "-") }
          },
          estatus: estatus !== "" ? estatus : "Activo"
        });
      }
    }
    return resultados.reverse();
  } catch (e) {
    return [];
  }
}

// ================= SUBIDA AUTOMÁTICA DE FOTOS A GOOGLE DRIVE =================
function subirFotoADrive(base64Data, fileName, mimeType) {
  try {
    var folders = DriveApp.getFoldersByName("Inventario_Fotografias_Bienes");
    var folder;
    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder("Inventario_Fotografias_Bienes");
      folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    }
    
    var split = base64Data.split(",");
    var decodedData = Utilities.base64Decode(split[1]);
    var blob = Utilities.newBlob(decodedData, mimeType, fileName);
    
    var file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    var fileId = file.getId();
    var directUrl = "https://lh3.googleusercontent.com/d/" + fileId;
    
    return { status: "success", url: directUrl };
  } catch (error) {
    return { status: "error", message: error.toString() };
  }
}

// ================= GUARDAR Y ACTUALIZAR BIENES =================
function guardarBien(data) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("bienes") || ss.insertSheet("bienes");
    
    if (sheet.getLastRow() === 0) {
      var headers = ["ID", "Fecha", "Departamento", "Grupo", "SubGrupo", "Sección", "Nro. de Bien", "Descripción", "Características", "Modelo", "Color", "Serial", "Estado", "URL", "Estatus"];
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#1e3a8a").setFontColor("#ffffff");
    }
    
    var rowData = ["", new Date(), data.departamento, data.grupo, data.subgrupo, data.seccion || "", data.nroBienCompleto, data.descripcion, data.caracteristicas, data.modelo || "", data.color || "", data.serial || "", data.estado, data.fotoUrl || "", "Activo"];
    sheet.appendRow(rowData);
    return { status: "success", message: "Bien guardado con éxito." };
  } catch (error) {
    return { status: "error", message: "Error al guardar: " + error.toString() };
  }
}

function actualizarBien(sheetRow, data) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("bienes");
    if (!sheet) return { status: "error", message: "No se encontró la hoja bienes." };
    
    var idActual = sheet.getRange(sheetRow, 1).getValue();
    var fechaActual = sheet.getRange(sheetRow, 2).getValue() || new Date();
    var estatusActual = sheet.getRange(sheetRow, 15).getValue() || "Activo";
    
    var rowData = [idActual, fechaActual, data.departamento, data.grupo, data.subgrupo, data.seccion || "", data.nroBienCompleto, data.descripcion, data.caracteristicas, data.modelo || "", data.color || "", data.serial || "", data.estado, data.fotoUrl || "", estatusActual];
    sheet.getRange(sheetRow, 1, 1, rowData.length).setValues([rowData]);
    return { status: "success", message: "Bien actualizado correctamente." };
  } catch (error) {
    return { status: "error", message: "Error al actualizar: " + error.toString() };
  }
}

// ================= GUARDAR Y ACTUALIZAR REDES =================
function guardarInfraestructuraRed(data) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("redes") || ss.insertSheet("redes");
    
    if (sheet.getLastRow() === 0) {
      var headers = ["ID", "Modem (Cant)", "Router (Cant)", "Switch (Cant)", "Punto de Acceso (Cant)", "Tipo de Cableado", "Canalización", "SSID Wi-Fi", "Banda Wi-Fi", "Proveedor", "Velocidad", "Responsable de Pagos", "Estatus"];
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#1e3a8a").setFontColor("#ffffff");
    }
    
    var rowData = ["", data.modem || 0, data.router || 0, data.switch || 0, data.ap || 0, data.cableado || "", data.canalizacion || "", data.ssid || "", data.banda || "", data.proveedor || "", data.velocidad || "", data.responsable || "", "Activo"];
    sheet.appendRow(rowData);
    return { status: "success", message: "Red guardada con éxito." };
  } catch (e) { 
    return { status: "error", message: e.toString() }; 
  }
}

function actualizarRed(sheetRow, data) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("redes");
    if (!sheet) return { status: "error", message: "No se encontró la hoja redes." };
    
    var idActual = sheet.getRange(sheetRow, 1).getValue();
    var estatusActual = sheet.getRange(sheetRow, 13).getValue() || "Activo";
    
    var rowData = [idActual, data.modem || 0, data.router || 0, data.switch || 0, data.ap || 0, data.cableado || "", data.canalizacion || "", data.ssid || "", data.banda || "", data.proveedor || "", data.velocidad || "", data.responsable || "", estatusActual];
    sheet.getRange(sheetRow, 1, 1, rowData.length).setValues([rowData]);
    return { status: "success", message: "Red actualizada con éxito." };
  } catch (e) { 
    return { status: "error", message: e.toString() }; 
  }
}

// ================= GUARDAR Y ACTUALIZAR OFIMÁTICA =================
function guardarCuestionarioOfimatica(data) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("cuestionario_ofimatica") || ss.insertSheet("cuestionario_ofimatica");
    
    if (sheet.getLastRow() === 0) {
      var headers = ["Fecha / Hora", "Nombre Completo", "Correo / Departamento", "Word Frecuencia", "Word Nivel", "Excel Frecuencia", "Excel Nivel", "Slides Frecuencia", "Slides Nivel", "Correo Frecuencia", "Correo Nivel", "Nube Frecuencia", "Nube Nivel", "Estatus"];
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#1e3a8a").setFontColor("#ffffff");
    }
    
    var rowData = [new Date(), data.nombre || "", data.correo || "", data.tools.word.frecuencia || "", data.tools.word.nivel || "", data.tools.excel.frecuencia || "", data.tools.excel.nivel || "", data.tools.slides.frecuencia || "", data.tools.slides.nivel || "", data.tools.correo.frecuencia || "", data.tools.correo.nivel || "", data.tools.nube.frecuencia || "", data.tools.nube.nivel || "", "Activo"];
    sheet.appendRow(rowData);
    return { status: "success", message: "Diagnóstico guardado con éxito." };
  } catch (e) { 
    return { status: "error", message: e.toString() }; 
  }
}

function actualizarOfimatica(sheetRow, data) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("cuestionario_ofimatica");
    if (!sheet) return { status: "error", message: "No se encontró la hoja de ofimática." };
    
    var fechaActual = sheet.getRange(sheetRow, 1).getValue() || new Date();
    var estatusActual = sheet.getRange(sheetRow, 14).getValue() || "Activo";
    
    var rowData = [fechaActual, data.nombre || "", data.correo || "", data.tools.word.frecuencia || "", data.tools.word.nivel || "", data.tools.excel.frecuencia || "", data.tools.excel.nivel || "", data.tools.slides.frecuencia || "", data.tools.slides.nivel || "", data.tools.correo.frecuencia || "", data.tools.correo.nivel || "", data.tools.nube.frecuencia || "", data.tools.nube.nivel || "", estatusActual];
    sheet.getRange(sheetRow, 1, 1, rowData.length).setValues([rowData]);
    return { status: "success", message: "Diagnóstico actualizado con éxito." };
  } catch (e) { 
    return { status: "error", message: e.toString() }; 
  }
}

// ================= CAMBIO DE ESTATUS (Activo / Inactivo) =================
function cambiarEstatusSheets(nombreHoja, sheetRow, nuevoEstatus) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(nombreHoja);
    if (sheet && sheetRow) {
      var colEstatus = 15; // Columna O para "bienes"
      
      if (nombreHoja === "redes") {
        colEstatus = 13; // Columna M para "redes"
      } else if (nombreHoja === "cuestionario_ofimatica") {
        colEstatus = 14; // Columna N para "cuestionario_ofimatica"
      }
      
      sheet.getRange(sheetRow, colEstatus).setValue(nuevoEstatus);
      
      return { status: "success", message: "Estatus cambiado a " + nuevoEstatus + " correctamente." };
    }
    return { status: "error", message: "No se pudo localizar la fila o la hoja." };
  } catch (error) {
    return { status: "error", message: "Error al actualizar estatus: " + error.toString() };
  }
}