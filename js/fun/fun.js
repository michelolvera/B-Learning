//Variables Globales
var JsonIdioma;

//El documento se ha cargado completamente, ahora se puede añadir funcionamiento.
$(document).ready(function () {
  //Cargar cookie de Idioma
  var lang = getCookie("lang");
  if (lang != "") {
    CargarIdioma(lang);
  } else {
    CargarIdioma("en-US");
    lang = "en-US";
  }
  setCookie("lang", lang, 30);
  //Validar Cookie de usuario
  ValidarCookie();//Cada pagina maneja esto de manera diferente.
});

function CargarIdioma(idioma) {
  $.ajax({
    method: "post",
    url: langPath,
    dataType: "json"
  })
    .done(function (jsonObject) {
      JsonIdioma = jsonObject[idioma];
      CargarTextosPagina();
      CargarFunciones();
    })
    .fail(function () {

    });
}

function ComprobarRegex(regex, expresion) {
  return regex.test(expresion);
}

function setCookie(cname, cvalue, exdays) {
  if (exdays != 0) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  } else
    document.cookie = cname + "=" + cvalue + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function cargar_notificaciones() {
  $("#text_titulo_notificaciones_principal").empty();
  $("#text_titulo_notificaciones_principal").append(JsonIdioma["Notificacion"]);
  $.ajax({
    method: "post",
    url: phpPath,
    data: {
      funcion: "consultaNotificaciones",
    },
    dataType: "json"
  })
    .done(function (jsonObject) {
      $("#lista_notificaciones").empty();
      jsonObject.forEach(row => {
        $("#lista_notificaciones").append("<div class='alert alert-" + row["tipo"] + "' role='alert'>" + row["notificacion"] + "</div>");
      });
    })
    .fail(function () {
      alert("Error");
    });
}

function consulta_numero_notificaciones() {
  $.ajax({
    method: "post",
    url: phpPath,
    data: {
      funcion: "consultaNumeroNotificaciones",
    },
    dataType: "json"
  })
    .done(function (jsonObject) {
      $("#btn_mostrar_notificaciones").empty();
      $("#btn_mostrar_notificaciones").append(JsonIdioma["Notificacion"] + " <span class='badge badge-light'>" + jsonObject[0]["suma"] + "</span><span class='sr-only'>" + jsonObject[0]["suma"] + "</span>")
    })
    .fail(function () {
      alert("Error");
    });
}

function cargar_ranking() {
  $("#text_titulo_notificaciones_principal").empty();
  $("#text_titulo_notificaciones_principal").append(JsonIdioma["Clasificacion"]);
  $.ajax({
    method: "post",
    url: phpPath,
    data: {
      funcion: "obtenerRanking",
    },
    dataType: "json"
  })
    .done(function (jsonObject) {
      $("#lista_notificaciones").empty();
      let cont = 1;
      jsonObject.forEach(row => {
        $("#lista_notificaciones").append("<tr><td><div class='alert alert-info' role='alert'>" + cont + ".- "+ row["nombre_completo"] + "</div></td><td style='width: 20%; text-align: center;'><div class='alert alert-info' role='alert'>" + row["total"] + "</div></td></tr>");
        cont++;
      });
    })
    .fail(function () {
      alert("Error");
    });
}

function CerrarSesion() {
  setCookie("user", "", -1);
  setCookie("pass", "", -1);
  location.replace(homePath);
}

function cargar_datos_usuario() {
  $("#in_usuario_gestion").val("");
  $("#in_nombre_act_gestion").val("");
  $("#in_apellido_pat_act_gestion").val("");
  $("#in_apellido_mat_act_gestion").val("");
  $("#in_correo_act_gestion").val("");
  $("#in_contrasenia_act_gestion").val("");
  $("#in_escuela_act_gestion").val("");
  $("#in_carrera_act_gestion").val("");
  $("#in_semestre_act_gestion").val("");
  $.ajax({
    method: "post",
    url: phpPath,
    data: {
      funcion: "GestionarUsuario",
      userName: getCookie("user"),
      userPass: getCookie("pass")
    },
    dataType: "json"
  })
    .done(function (jsonObject) {
      $("#in_usuario_gestion").val(jsonObject[0]["usuario"]);
      $("#in_nombre_act_gestion").val(jsonObject[0]["nombre"]);
      $("#in_apellido_pat_act_gestion").val(jsonObject[0]["apellido_paterno"]);
      $("#in_apellido_mat_act_gestion").val(jsonObject[0]["apellido_materno"]);
      $("#in_correo_act_gestion").val(jsonObject[0]["correo"]);
      $("#in_contrasenia_act_gestion").val(jsonObject[0]["contrasena"]);
      $("#combo_pais_act_gestion").val(jsonObject[0]["pais"]);
      if (jsonObject[0]["estudiante"] == 1) {
        $("input[type=radio][name=in_estudia_si_gestion]")[0].checked = true;
        $("#PreguntasEstudiante_gestion").css("display", "block");
        $("#in_escuela_act_gestion").val(jsonObject[0]["escuela"]);
        $("#in_carrera_act_gestion").val(jsonObject[0]["carrera"]);
        $("#in_semestre_act_gestion").val(jsonObject[0]["semestre"]);
      } else {
        $('input[type=radio][name=in_estudia_si_gestion]')[1].checked = true;
        $("#PreguntasEstudiante_gestion").css("display", "none");
      }

    })
    .fail(function () {
      alert("Error");
    });
}

function guardar_datos_usuario() {
  $("#btn_cerrar_usuario_gestion").click();
  $.ajax({
    method: "post",
    url: phpPath,
    data: {
      funcion: "guardarUsuario",
      userName: getCookie("user"),
      userPass: getCookie("pass"),
      numSemestre: $("#in_semestre_act_gestion").val(),
      nombreCarrera: $("#in_carrera_act_gestion").val(),
      nombreEscuela: $("#in_escuela_act_gestion").val(),
      esEstudiante: $('[name=in_estudia_si_gestion]:checked').val(),
      codigoPais: $("#combo_pais_act_gestion").val(),
      correoElectronico: $("#in_correo_act_gestion").val(),
      contrasena: $("#in_contrasenia_act_gestion").val(),
      apellidoM: $("#in_apellido_mat_act_gestion").val(),
      apellidoP: $("#in_apellido_pat_act_gestion").val(),
      nombreReal: $("#in_nombre_act_gestion").val(),
      nombreUsuario: $("#in_usuario_gestion").val(),
    },
  })
    .done(function (respuesta) {
      if (respuesta == 1) {
        alert(JsonIdioma["ActualizacionCorrecta"]);
        setCookie("user", getCookie("user"), 0);
        setCookie("pass", $("#in_contrasenia_act_gestion").val(), 0);
      } else {
        alert("Error");
      }
    })
    .fail(function () {
      alert("Error");
    });
}

function detalles_usuario() {
  var deterministico = { tres: { puntos: "0", correctos: "0", incorrectos: "0" }, cuatro: { puntos: "0", correctos: "0", incorrectos: "0" }, cinco: { puntos: "0", correctos: "0", incorrectos: "0" } };
  var aleatorio = { tres: { puntos: "0", correctos: "0", incorrectos: "0" }, cuatro: { puntos: "0", correctos: "0", incorrectos: "0" }, cinco: { puntos: "0", correctos: "0", incorrectos: "0" } };
  $("#body_modal_detalles").empty();
  $.ajax({
    method: "post",
    url: phpPath,
    data: {
      funcion: "detallesUsuario",
      userName: getCookie("user"),
      userPass: getCookie("pass"),
      indice: 1
    },
    dataType: "json"
  })
    .done(function (jsonObject) {
      $("#body_modal_detalles").append("<p>" + JsonIdioma["UltimoIngreso"] + ": " + jsonObject[0].ultimo_ingreso + "</p>");

      $.ajax({
        method: "post",
        url: phpPath,
        data: {
          funcion: "detallesUsuario",
          userName: getCookie("user"),
          userPass: getCookie("pass"),
          indice: 2
        },
        dataType: "json"
      })
        .done(function (jsonObject) {
          if (jsonObject != 0) {
            jsonObject.forEach(element => {
              switch (element["variables"]) {
                case "Tres":
                  deterministico.tres.puntos = element["total"];
                  deterministico.tres.correctos = element["numero"];
                  break;
                case "Cuatro":
                  deterministico.cuatro.puntos = element["total"];
                  deterministico.cuatro.correctos = element["numero"];
                  break;
                case "Cinco":
                  deterministico.cinco.puntos = element["total"];
                  deterministico.cinco.correctos = element["numero"];
                  break;
              }
            });
          }
          $.ajax({
            method: "post",
            url: phpPath,
            data: {
              funcion: "detallesUsuario",
              userName: getCookie("user"),
              userPass: getCookie("pass"),
              indice: 3
            },
            dataType: "json"
          })
            .done(function (jsonObject) {
              if (jsonObject != 0) {
                jsonObject.forEach(element => {
                  switch (element["variables"]) {
                    case "Tres":
                      deterministico.tres.incorrectos = element["numero"];
                      break;
                    case "Cuatro":
                      deterministico.cuatro.incorrectos = element["numero"];
                      break;
                    case "Cinco":
                      deterministico.cinco.incorrectos = element["numero"];
                      break;
                  }
                });
              }
              $.ajax({
                method: "post",
                url: phpPath,
                data: {
                  funcion: "detallesUsuario",
                  userName: getCookie("user"),
                  userPass: getCookie("pass"),
                  indice: 4
                },
                dataType: "json"
              })
                .done(function (jsonObject) {
                  if (jsonObject != 0) {
                    jsonObject.forEach(element => {
                      switch (element["variables"]) {
                        case "Tres":
                          aleatorio.tres.puntos = element["total"];
                          aleatorio.tres.correctos = element["numero"];
                          break;
                        case "Cuatro":
                          aleatorio.cuatro.puntos = element["total"];
                          aleatorio.cuatro.correctos = element["numero"];
                          break;
                        case "Cinco":
                          aleatorio.cinco.puntos = element["total"];
                          aleatorio.cinco.correctos = element["numero"];
                          break;
                      }
                    });
                  }
                  $.ajax({
                    method: "post",
                    url: phpPath,
                    data: {
                      funcion: "detallesUsuario",
                      userName: getCookie("user"),
                      userPass: getCookie("pass"),
                      indice: 5
                    },
                    dataType: "json"
                  })
                    .done(function (jsonObject) {
                      if (jsonObject != 0) {
                        jsonObject.forEach(element => {
                          switch (element["variables"]) {
                            case "Tres":
                              aleatorio.tres.incorrectos = element["numero"];
                              break;
                            case "Cuatro":
                              aleatorio.cuatro.incorrectos = element["numero"];
                              break;
                            case "Cinco":
                              aleatorio.cinco.incorrectos = element["numero"];
                              break;
                          }
                        });
                      }
                      $("#body_modal_detalles").append("<p>" + JsonIdioma["PuntajeTotal"] + " = " + (parseInt(aleatorio.tres.puntos) + parseInt(aleatorio.cuatro.puntos) + parseInt(aleatorio.cinco.puntos) + parseInt(deterministico.tres.puntos) + parseInt(deterministico.cuatro.puntos) + parseInt(deterministico.cinco.puntos)) + "<p>");
                      $("#body_modal_detalles").append("<p>" + JsonIdioma["Conocido"] + ": <p>");
                      $("#body_modal_detalles").append("<table class='table text-center table-hover'><thead>" +
                        '<th>' + JsonIdioma["Variables"] + '</th>' +
                        '<th>' + JsonIdioma["Correctos"] + '</th>' +
                        '<th>' + JsonIdioma["Incorrectos"] + '</th>' +
                        '<th>' + JsonIdioma["Puntaje"] + '</th></thead><tbody>' +
                        '<tr><td>3</td><td>' + deterministico.tres.correctos + '</td><td>' + deterministico.tres.incorrectos + '</td><td>' + deterministico.tres.puntos + '</td></tr>' +
                        '<tr><td>4</td><td>' + deterministico.cuatro.correctos + '</td><td>' + deterministico.cuatro.incorrectos + '</td><td>' + deterministico.cuatro.puntos + '</td></tr>' +
                        '<tr><td>5</td><td>' + deterministico.cinco.correctos + '</td><td>' + deterministico.cinco.incorrectos + '</td><td>' + deterministico.cinco.puntos + '</td></tr>' +
                        "</tbody></table>");
                      $("#body_modal_detalles").append("<p>" + JsonIdioma["Total"] + " = " + (parseInt(deterministico.tres.puntos) + parseInt(deterministico.cuatro.puntos) + parseInt(deterministico.cinco.puntos)) + "<p>");
                      $("#body_modal_detalles").append("<p>" + JsonIdioma["Aleatorio"] + ": <p>");
                      $("#body_modal_detalles").append("<table class='table text-center table-hover'><thead>" +
                        '<th>' + JsonIdioma["Variables"] + '</th>' +
                        '<th>' + JsonIdioma["Correctos"] + '</th>' +
                        '<th>' + JsonIdioma["Incorrectos"] + '</th>' +
                        '<th>' + JsonIdioma["Puntaje"] + '</th></thead><tbody>' +
                        '<tr><td>3</td><td>' + aleatorio.tres.correctos + '</td><td>' + aleatorio.tres.incorrectos + '</td><td>' + aleatorio.tres.puntos + '</td></tr>' +
                        '<tr><td>4</td><td>' + aleatorio.cuatro.correctos + '</td><td>' + aleatorio.cuatro.incorrectos + '</td><td>' + aleatorio.cuatro.puntos + '</td></tr>' +
                        '<tr><td>5</td><td>' + aleatorio.cinco.correctos + '</td><td>' + aleatorio.cinco.incorrectos + '</td><td>' + aleatorio.cinco.puntos + '</td></tr>' +
                        "</tbody></table>");
                      $("#body_modal_detalles").append("<p>" + JsonIdioma["Total"] + " = " + (parseInt(aleatorio.tres.puntos) + parseInt(aleatorio.cuatro.puntos) + parseInt(aleatorio.cinco.puntos)) + "<p>");
                    })
                    .fail(function () {
                      alert("Error");
                    });
                })
                .fail(function () {
                  alert("Error");
                });
            })
            .fail(function () {
              alert("Error");
            });
        })
        .fail(function () {
          alert("Error");
        });
    })
    .fail(function () {
      alert("Error");
    });
}