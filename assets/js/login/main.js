$(document).ready(function () {
   const enterKey = 13;
   
   localStorage.clear();
   $(document).on('keypress', function(e) {
      if(e.keyCode == enterKey) {
         if(!$('#btn_entrar').is(":focus")){
            $('#btn_entrar').click();
         }
      }
   });

   $('.recuperar-senha').on('click', function() {
      REQUESTER.izitoast({
         type: 'error',
         title: 'Entre em contato com o suporte!',
      });
   });

   $('#btn_entrar').on('click', function () {
      let ladda = Ladda.create(this).start();
      
      let usuario = $.trim($('#usuario').val());
      let senha = $.trim($('#senha').val()); 
      let valido = true;
      let msg = "";

      $('.input-erro').removeClass('input-erro');
      
      if(usuario.length == 0) {
         $('#usuario').addClass('input-erro');
         valido = false;
         msg = "Preencha os campos corretamente";
      }

      if(senha.length == 0) {
         $('#senha').addClass('input-erro');
         valido = false;
         msg = "Preencha os campos corretamente";
      }

      if( valido ) {
         $.ajax({
            url: REQUESTER.gerarUrl('token'),
            processData: true,
            contentType: "application/x-www-form-urlencoded",
            dataType: 'json',
            type: "POST",
            data: {
               username: usuario, 
               password: senha,
               grant_type: 'user_credentials',
               client_id: 'web',
               client_secret: '6648ee7559e05d1549afb7d1694b6d822dd2a831'
            },
            success: function(data) {
               localStorage.setItem('token', JSON.stringify(data));
               window.location.href = 'dashboard';
            },
            error: function(xhr) {
               ladda.stop();
               REQUESTER.izitoast({
                  type: 'error',
                  title: 'Erro',
                  message: xhr.responseJSON.message
               });
            }
         })
      } else {
         ladda.stop();
         REQUESTER.izitoast({
            type: 'error',
            title: 'Erro',
            message: msg
         });
      }
      
   });
});