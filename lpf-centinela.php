<?php





  include "login/conexion.php";

  function traer_datos()
{
  $user = "Centinela";


  $pasw = "123";
  $consulta = "SELECT hash FROM masgps.hash where user='$user' and pasw='$pasw'";

  $resutaldo = mysqli_query($mysqli, $consulta);

  $data = mysqli_fetch_array($resutaldo);

  $hash = $data['hash'];

  $cap = $hash;


  //header("refresh:2");
  $listado = '';
  $i = 0;
  $curl = curl_init();

  curl_setopt_array($curl, array(
    CURLOPT_URL => 'http://www.trackermasgps.com/api-v2/tracker/list',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => '',
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 0,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => 'POST',
    CURLOPT_POSTFIELDS => '{"hash":"' . $cap . '"}',
    CURLOPT_HTTPHEADER => array(
      'Accept: application/json, text/plain, */*',
      'Accept-Language: es-419,es;q=0.9,en;q=0.8',
      'Connection: keep-alive',
      'Content-Type: application/json',
      'Cookie: _ga=GA1.2.728367267.1665672802; locale=es; _gid=GA1.2.967319985.1673009696; _gat=1; session_key=5d7875e2bf96b5966225688ddea8f098',
      'Origin: http://www.trackermasgps.com',
      'Referer: http://www.trackermasgps.com/',
      'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
    ),
  ));

  $response2 = curl_exec($curl);

  $json = json_decode($response2);

  $array = $json->list;


  //echo '[';
  foreach ($array as $item) {


    $id = $item->id;
    $imei = $item->source->device_id;
    //echo " , &nbsp";


    $curl = curl_init();

    curl_setopt_array($curl, array(
      CURLOPT_URL => 'http://www.trackermasgps.com/api-v2/tracker/get_state',
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_ENCODING => '',
      CURLOPT_MAXREDIRS => 10,
      CURLOPT_TIMEOUT => 0,
      CURLOPT_FOLLOWLOCATION => true,
      CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
      CURLOPT_CUSTOMREQUEST => 'POST',
      CURLOPT_POSTFIELDS => '{"hash": "' . $cap . '", "tracker_id": ' . $id . '}',
      CURLOPT_HTTPHEADER => array(
        'Content-Type: application/json'
      ),
    ));


    $response2 = curl_exec($curl);

    curl_close($curl);

    $json2 = json_decode($response2);


    $alt = $array2 = $json2->state->gps->alt;
    $lat = $array2 = $json2->state->gps->location->lat;


    $lng = $array2 = $json2->state->gps->location->lng;


    $last_u = $array2 = $json2->state->last_update;

    $ultima_Conexion = date("d/m/Y H:i:s", strtotime($last_u));


    $plate = substr($item->label, 0, 7);

    $patente = str_replace("-", "", $plate);

    $speed = $json2->state->gps->speed;

    $direccion = $json2->state->gps->heading;

    $connection_status = $json2->state->connection_status;

    $movement_status = $json2->state->movement_status;

    $signal_level = $json2->state->gps->signal_level;

    $ignicion = $json2->state->inputs[0];

    if ($ignicion) {
      $motor = 1;
    } else {
      $motor = 0;
    }

    if ($movement_status == 'moving' && $motor == '1') {
      $evento = 41;
    } elseif ($movement_status == 'parked' && $motor == '0') {
      $evento = 42;
    } elseif ($movement_status == 'parked' && $motor == '1') {
      $evento = 51;
    } else {
      $evento = 52;
    }

    /*
            EVENTO DESCRIPCIÓN
          41 Posición con Ignición ON (Movimiento)
          42 Posición con Ignición OFF (Estacionado)
          51 Ignición ON
          52 Ignición OFF
          911 Botón de Pánico

          */

    $json = array(

      'patente' => $patente,
      'imei' => $imei,

      'latitud' => $lat,
      'longitud' => $lng,
      'altitud' => $alt,
      'evento' => $evento,

      'velocidad' => $speed,
      'heading' => $direccion,
      'fechaHora' => $ultima_Conexion,

      //'connection_status' => $connection_status,
      //'signal_level' => $signal_level,
      //'movement_status' => $movement_status,
      'ignicion' => $motor,


    );

    $total[$i] = $json;

    $i++;
  }
   
  return($total);
  //echo json_encode($total, http_response_code(200));


 // $payrol = json_encode($total, http_response_code(200));

}

function enviar_datos($payrol)
{
  $curl = curl_init();

  curl_setopt_array($curl, array(
    CURLOPT_URL => 'https://external.skynav.cl/integrador/centinela/test/transmision',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => '',
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 0,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => 'POST',
    CURLOPT_POSTFIELDS => $payrol,
    CURLOPT_HTTPHEADER => array(
      'Authorization: Bearer d96adbd0b5066c73ccce0cfaa2990fe957d183d66014ef5b61f86bfe3d94971738731463c56caf1f2cdf0636ed505e8f72444922f72e3c6e47ff98a23cf0185b',
      'Content-Type: application/json'
    ),
  ));

  $response = curl_exec($curl);

  curl_close($curl);
  echo $response;
}


function comparar($datosAnteriores, $datosActuales){

  $nuevaColeccion = $datosActuales;
  $versionAnterior =$datosAnteriores;
  
  // Identificar elementos actualizados
  $elementosActualizados = [];
  foreach ($nuevaColeccion as $indice => $elemento) {
      // Comparar cada elemento con su correspondiente en la versión anterior
      if (!isset($versionAnterior[$indice]) || $elemento['fechaHora'] !== $versionAnterior[$indice]['fechaHora']) {
          // Si la fecha y hora son diferentes, se considera que el elemento se ha actualizado
          $elementosActualizados[] = $elemento;
      }
  }

     return json_encode($elementosActualizados,http_response_code(200));


}



$datosAnteriores=[];

 Loop:
  $datosActuales=traer_datos();

  $payrol=comparar($datosAnteriores,$datosActuales);

  enviar_datos($payrol);

  $datosAnteriores=$datosActuales;
  sleep(30);
  goto Loop;

  

  

 








