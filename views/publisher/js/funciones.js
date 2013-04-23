function loadData(page){
  //loading_show();
  $.ajax({
    type    :   "POST",
    url     :   getBaseURL() + "publisher/displayPublisher",
    data    :   "page="+page,
    success :   function(msg){
      $("#grid").ajaxComplete(function(event, request, settings){
        //loading_hide();
        $("#grid").html(msg);
      });
    }
  });
}

$(document).ready(function(){
  // Otorgamos al primer input el focus
  $(":input:first").focus();
        
  loadData(1); // La primera página de resultados
  $('#grid .pagination li.active').live('click',function(){
    var page = $(this).attr('p');
    loadData(page);
  }); 
    
  $('#go_btn').live('click',function(){
    var page = parseInt($('.goto').val());
    var no_of_pages = parseInt($('.total').attr('a'));
    if(page != 0 && page <= no_of_pages){
      loadData(page);
    }else{
      jAlert('Ingrese una p&aacute;gina entre 1 y '+no_of_pages, 'Advertencia');
      $('.goto').val("").focus();
      return false;
    }                    
  });
    
  // Hacemos que todos los div cuyo id empiecen por frm inicialmente no se muestren
  $('div[id^="frm"]').addClass('hidden');
    
  // Todo div cuyo id terminen con Failed no se muestren inicialmente
  $('div[id $= "Failed"]').addClass('hidden');
    
  // Ocultamos la caja donde se muestran los errores y de éxito
  $('#error').hide();
  $('#exito').hide();
    
  // Editar un usuario
  $('.dataPublisher').live('click', function(){
    $('#error').hide();
    $('#exito').hide();
    var id = $(this).attr('p');
    $.post(getBaseURL()+'publisher/editPublisher', {'id': id}, function(data) {
      $('#frm_editPublisher').dialog({
        modal    :   true,
        minWidth :   620,
        minHeight:   250,
        title    :   'Editar Editorial',
        show     :   'slide',
        hide     :   'slide',
        resizable:   false,
        open     :   function(){
          $('div[id$="Failed"]').addClass('hidden');
          $('input[name^="hd"]').remove();
        }
      });
        $('#txtPublisherEdit').attr('value', data.publisher);
        $('textarea[name="txtDescription"]').text(data.description);
        $('textarea[name="txtDescription"]').after('<input type="hidden" name="hdId" value="' + id + '" />');
    }, 'json');
  });
        
  // Cargamos el div cuyo id addUser se muestre como modal
  $('#addPublisher').live('click', function(){
    $('#error').hide();
    $('#exito').hide();
    $('#frm_addPublisher').dialog({
      modal    :   true,
      minWidth :   620,
      minHeight:   250,
      title    :   'Agregar Editorial',
      show     :   'slide',
      hide     :   'slide',
      resizable:   false,
      open     :   function(){
        $('div[id$="Failed"]').addClass('hidden');
        $('input[name^="hd"]').remove();
        $('textarea[name="txtDescription"]').text('');
      }
    });
  });
    
  // Cambiamos el estilo de los input cuando tienen el focus
  $(':input').focus(function(){
    $(this).css('border', '1px dotted #666');
  })
    
  // Realizamos el submit a través del botón insertPublisher
  $('#insertPublisher').live('click', function() {
    $('#frmAddPublisher').submit();
    $('#frm_addPublisher').dialog("close");
  });
    
  // Realizamos el submit a través del botón editPublisher
  $('#editPublisher').live('click', function() {
    $('#frmEditPublisher').submit();
    $('#frm_editPublisher').dialog("close");
  });
    
  $('#loading').hide();
    
  $('#loading img').ajaxStart(function(){
    $(this).show();
  }).ajaxStop(function(){
    $(this).hide();
  });
    
  // Enviamos los datos a través del plugin jquery.form para agregar un nuevo usuario
  var options = { 
    target      :   '.informe', // elemento destino que se actualizará 
    beforeSubmit:   showRequest,  //  respuesta antes de llamarpre-submit callback 
    success     :   showResponse  //  respuesta después de llamar 
  }; 
 
  // vincular formulario usando 'ajaxForm' 
  $('#frmAddPublisher').ajaxForm(options); 
  $('#frmEditPublisher').ajaxForm(options);
})

// respuesta antes de envío 
function showRequest(formData, jqForm) { 
  var extra = [ {
    name: 'ajax', 
    value: '1'
  }];
  $.merge(formData, extra)
 
  return true;  
} 
 
// respuesta después de envío 
function showResponse(responseText, statusText)  { 
  if(responseText == 'Se ingres&oacute; correctamente la nueva editorial.' || responseText == 'La editorial se edit&oacute; satisfactoriamente.'){
    $('#exito').show();
    $('#error').hide();
    $('#frmAddPublisher').resetForm();
    loadData(1);
  }else{
    $('#error').show();
    $('#exito').hide();
  }
} 

// Función que preguntará de estar seguro de eliminar un registro
function deleteRow(registro, id){
  jConfirm('¿Está seguro que desea eliminar el registro '+registro+'?', 'Eliminación de registro', function(r) {
    if(r == true){
      $.ajax({
        type    :   "POST",
        url     :   getBaseURL() + "publisher/deletePublisher",
        data    :   "id="+id,
        success :   function(msg){
          if(msg == '0'){
            $('#error').text('No se pudo eliminar el registro').show();
            loadData(1);
          }else if(msg == '1'){
            $('#exito').text('El registro se elimino correctamente').show();
            loadData(1);
          }
        }
      });
    }
  });
}